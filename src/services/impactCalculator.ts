import { DailyRoutineItem, UserProfile, LocationData } from '../types';

export interface CalculatedImpact {
  lungDoseSavedUg: number;
  cigarettesAvoided: number;
  co2SavedKg: number;
  noxSavedGrams: number;
  monetarySavingsUsd: number;
  healthRiskReductionPercent: number;
}

/**
 * Calculates physiological lung intake savings and emission reductions based on user actions.
 */
export function calculateImpact(
  profile: UserProfile,
  location: LocationData,
  completedRoutines: DailyRoutineItem[],
  customSliders?: {
    purifierHours: number;
    maskGrade: 'none' | 'cloth' | 'surgical' | 'n95';
    transitSwapKm: number;
    sealedWindows: boolean;
  }
): CalculatedImpact {
  // Base calculation from completed routines
  let routineLungSavedUg = 0;
  let routineCo2Saved = 0;

  completedRoutines.forEach(item => {
    if (item.completed) {
      routineLungSavedUg += item.lungDoseSavedUg;
      routineCo2Saved += item.co2SavedKg;
    }
  });

  // Slider adjustments
  const rawPurifier = customSliders ? customSliders.purifierHours : 12;
  const safePurifierHours = Math.max(0, Math.min(24, Number.isFinite(rawPurifier) ? rawPurifier : 0));
  const maskGrade = customSliders ? customSliders.maskGrade : 'n95';
  const rawTransitKm = customSliders ? customSliders.transitSwapKm : profile.commute.dailyDistanceKm;
  const safeTransitKm = Math.max(0, Number.isFinite(rawTransitKm) ? rawTransitKm : 0);
  const sealed = customSliders ? customSliders.sealedWindows : true;

  // Mask filtration efficiency
  const maskEfficiency: Record<string, number> = {
    'none': 0,
    'cloth': 0.28,
    'surgical': 0.45,
    'n95': 0.95
  };
  const activeMaskEff = maskEfficiency[maskGrade] ?? 0; // ?? preserves 'none'=0

  // Physiological vulnerability weighting from profile
  let vulnerabilityWeight = 1.0;
  if (profile?.householdMembers?.hasInfant) {
    vulnerabilityWeight = Math.max(vulnerabilityWeight, 1.5);
  }
  if (profile?.householdMembers?.hasRespiratoryCondition) {
    vulnerabilityWeight = Math.max(vulnerabilityWeight, 1.4);
  }
  if (profile?.householdMembers?.hasElderly) {
    vulnerabilityWeight = Math.max(vulnerabilityWeight, 1.25);
  }

  // Safe PM2.5 calculation guarding against NaN
  const safePm25 = (location && Number.isFinite(location.pm25)) ? Math.max(0, location.pm25) : 0;
  const outdoorDeltaPm = Math.max(0, safePm25 - 25); // Target healthy level 25 ug/m3
  
  // Outdoor exposure avoided via N95/mask (assumed 2.5 hours outdoor daily)
  const outdoorHours = 2.5;
  const transitInhalationRate = 0.85 * vulnerabilityWeight; // m3/hr
  const maskLungProtection = outdoorHours * transitInhalationRate * outdoorDeltaPm * activeMaskEff * 0.65; // 0.65 alveolar fraction

  // Indoor HEPA / CR Box protection
  const restingInhalationRate = 0.55 * vulnerabilityWeight;
  const indoorProtectionPerHour = outdoorDeltaPm * (sealed ? 0.80 : 0.55) * restingInhalationRate * 0.65;
  const totalIndoorLungProtection = safePurifierHours * indoorProtectionPerHour;

  const totalLungDoseSavedUg = Math.round(routineLungSavedUg + maskLungProtection + totalIndoorLungProtection);

  // Berkeley Earth equivalency: 22 ug/m3 for 24h = 1 cigarette (528 ug-hrs/m3)
  // Total exposure equivalent avoided in cigarettes:
  const cigarettesAvoided = totalLungDoseSavedUg > 0
    ? Math.round(((totalLungDoseSavedUg / (0.55 * 0.65)) / (22 * 24)) * 10) / 10
    : 0;

  // Emissions saved from transit swap:
  // Solo car: ~192g CO2/km, Metro: ~28g CO2/km -> ~164g/km saved
  const transitCo2Saved = safeTransitKm * 0.164;
  const transitNoxSavedGrams = safeTransitKm > 0 ? Math.round(safeTransitKm * 0.42 * 10) / 10 : 0;

  const totalCo2SavedKg = Math.round((routineCo2Saved + transitCo2Saved) * 10) / 10;

  // Monetary savings (less fuel, car maintenance, medical/nebulizer costs avoided)
  const monetarySavingsUsd = Math.round(safeTransitKm * 0.28 + (safePurifierHours > 0 ? 1.5 : 0));

  // Health risk reduction percentage based on PM2.5 dosage curve
  const healthRiskReductionPercent = Math.min(94, Math.round(20 + (activeMaskEff * 35) + (safePurifierHours / 24 * 35)));

  return {
    lungDoseSavedUg: totalLungDoseSavedUg,
    cigarettesAvoided: totalLungDoseSavedUg > 0 ? cigarettesAvoided : 0,
    co2SavedKg: totalCo2SavedKg,
    noxSavedGrams: safeTransitKm > 0 ? transitNoxSavedGrams : 0,
    monetarySavingsUsd,
    healthRiskReductionPercent
  };
}

/**
 * Calculates Corsi-Rosenthal Box Air Delivery and Coverage
 */
export function calculateCrBoxSpecs(params: {
  fanDiameterInches: 12 | 20;
  mervRating: 11 | 13 | 14;
  numFilters: 1 | 4 | 5;
  fanSpeed: 'low' | 'medium' | 'high';
  roomAreaSqFt: number;
  ceilingHeightFt: number;
}) {
  const { fanDiameterInches, mervRating, numFilters, fanSpeed, roomAreaSqFt, ceilingHeightFt } = params;

  // Base CFM of typical fan
  let baseCfm = fanDiameterInches === 20 ? 1800 : 750;
  if (fanSpeed === 'medium') baseCfm *= 0.75;
  if (fanSpeed === 'low') baseCfm *= 0.55;

  // Flow resistance factor: more filters = more surface area = lower resistance
  // 4 filters has 4x area of 1 filter, dramatically boosting flow!
  const areaMultipliers: Record<number, number> = { 1: 0.38, 4: 0.85, 5: 0.92 };
  const filterResistance = areaMultipliers[numFilters] || 0.85;

  // Single pass efficiency for PM2.5:
  const mervEfficiencies: Record<number, number> = { 11: 0.65, 13: 0.88, 14: 0.95 };
  const filterEfficiency = mervEfficiencies[mervRating] || 0.88;

  // CADR = Airflow (CFM) * Single pass efficiency
  const effectiveCfm = baseCfm * filterResistance;
  const cadrCfm = Math.round(effectiveCfm * filterEfficiency);

  // Room Volume
  const safeArea = Math.max(0, Number.isFinite(roomAreaSqFt) ? roomAreaSqFt : 0);
  const safeHeight = Math.max(0, Number.isFinite(ceilingHeightFt) ? ceilingHeightFt : 0);
  const roomVolumeCuFt = safeArea * safeHeight;

  // Air Changes Per Hour (ACH) = (CADR * 60) / Room Volume
  // Guard against division-by-zero if roomAreaSqFt or ceilingHeightFt is 0
  const ach = roomVolumeCuFt > 0
    ? Math.round(((cadrCfm * 60) / roomVolumeCuFt) * 10) / 10
    : 0;

  // Estimated noise (dB)
  const noiseDb = fanSpeed === 'high' ? 52 : fanSpeed === 'medium' ? 44 : 38;

  // Monthly electricity cost ($0.16/kWh, 12h/day)
  const wattage = fanSpeed === 'high' ? 70 : fanSpeed === 'medium' ? 50 : 35;
  const monthlyCostUsd = Math.round((wattage * 12 * 30 / 1000) * 0.16 * 100) / 100;

  return {
    cadrCfm,
    ach,
    noiseDb,
    monthlyCostUsd,
    ratingText: ach >= 5 ? 'Excellent (Hospital/Classroom Grade)' : ach >= 3 ? 'Good (Standard Residential)' : 'Marginal (Consider higher fan speed)',
    equivalentCommercialCost: fanDiameterInches === 20 && numFilters >= 4 ? '$450 - $600' : '$250 - $350',
    diyCost: fanDiameterInches === 20 ? (numFilters === 4 ? '$55' : '$65') : '$35'
  };
}

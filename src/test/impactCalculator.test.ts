import { describe, it, expect } from 'vitest';
import { calculateImpact, calculateCrBoxSpecs } from '../services/impactCalculator';
import type { UserProfile, LocationData, DailyRoutineItem } from '../types';

// ─── Fixtures ───────────────────────────────────────────────────────────────

const mockLocation: LocationData = {
  id: 'delhi',
  name: 'New Delhi',
  region: 'National Capital Region',
  country: 'India',
  flag: '🇮🇳',
  aqi: 320,
  level: 'hazardous',
  pm25: 180,
  pm10: 290,
  no2: 85,
  co: 3.2,
  temp: 12,
  humidity: 68,
  windSpeed: 4,
  inversionRisk: 'Severe',
  inversionCeiling: 220,
  primaryPollutant: 'PM2.5',
  hourlyForecast: [],
  notes: 'Test location',
};

const mockProfile: UserProfile = {
  cityId: 'delhi',
  activePersona: 'family-guard',
  householdMembers: {
    total: 4,
    hasInfant: false,
    hasElderly: false,
    hasRespiratoryCondition: false,
    hasPets: false,
    hasOutdoorWorkers: false,
  },
  dwelling: {
    type: 'apartment-high',
    airFiltration: 'single-hepa',
    cookingType: 'lpg-gas',
    heatingType: 'electric-radiator',
  },
  commute: {
    mode: 'solo-car',
    dailyDistanceKm: 20,
  },
};

// ─── calculateImpact ────────────────────────────────────────────────────────

describe('calculateImpact', () => {
  it('returns numbers without NaN when mask is "none"', () => {
    const result = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 8,
      maskGrade: 'none',
      transitSwapKm: 0,
      sealedWindows: false,
    });
    expect(isNaN(result.lungDoseSavedUg)).toBe(false);
    expect(isNaN(result.cigarettesAvoided)).toBe(false);
    expect(isNaN(result.healthRiskReductionPercent)).toBe(false);
  });

  it('mask="none" gives LOWER health protection than mask="n95"', () => {
    const noMask = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 0,
      maskGrade: 'none',
      transitSwapKm: 0,
      sealedWindows: false,
    });
    const n95 = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 0,
      maskGrade: 'n95',
      transitSwapKm: 0,
      sealedWindows: false,
    });
    expect(noMask.lungDoseSavedUg).toBeLessThan(n95.lungDoseSavedUg);
    expect(noMask.healthRiskReductionPercent).toBeLessThan(n95.healthRiskReductionPercent);
  });

  it('healthRiskReductionPercent is clamped to max 94', () => {
    const result = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 24,
      maskGrade: 'n95',
      transitSwapKm: 50,
      sealedWindows: true,
    });
    expect(result.healthRiskReductionPercent).toBeLessThanOrEqual(94);
  });

  it('cigarettesAvoided is 0 when no exposure is avoided', () => {
    const result = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 0,
      maskGrade: 'none',
      transitSwapKm: 0,
      sealedWindows: false,
    });
    expect(result.cigarettesAvoided).toBe(0);
    expect(result.noxSavedGrams).toBe(0);
  });

  it('cigarettesAvoided is greater than 0 when purifier is used', () => {
    const result = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 12,
      maskGrade: 'n95',
      transitSwapKm: 10,
      sealedWindows: true,
    });
    expect(result.cigarettesAvoided).toBeGreaterThan(0);
    expect(result.noxSavedGrams).toBeGreaterThan(0);
  });

  it('accumulates lung dose from completed routines', () => {
    const routines: DailyRoutineItem[] = [
      { id: 'r1', completed: true, lungDoseSavedUg: 200, co2SavedKg: 0.5, timeSlot: '', title: '', activity: '', windowSafety: 'Optimal Window', recommendation: '', sustainableSwap: '', category: 'exercise' },
      { id: 'r2', completed: false, lungDoseSavedUg: 300, co2SavedKg: 1.0, timeSlot: '', title: '', activity: '', windowSafety: 'Optimal Window', recommendation: '', sustainableSwap: '', category: 'commute' },
    ];
    const withOne = calculateImpact(mockProfile, mockLocation, routines, {
      purifierHours: 0,
      maskGrade: 'none',
      transitSwapKm: 0,
      sealedWindows: false,
    });
    // Only 200µg from completed routine should be added (not 300 from incomplete)
    expect(withOne.lungDoseSavedUg).toBeGreaterThanOrEqual(200);
  });

  it('incorporates vulnerability weighting: infants (1.5x) save more lung dose than standard baseline', () => {
    const infantProfile: UserProfile = {
      ...mockProfile,
      householdMembers: { ...mockProfile.householdMembers, hasInfant: true }
    };
    const baseline = calculateImpact(mockProfile, mockLocation, [], {
      purifierHours: 8,
      maskGrade: 'n95',
      transitSwapKm: 0,
      sealedWindows: true
    });
    const withInfant = calculateImpact(infantProfile, mockLocation, [], {
      purifierHours: 8,
      maskGrade: 'n95',
      transitSwapKm: 0,
      sealedWindows: true
    });
    expect(withInfant.lungDoseSavedUg).toBeGreaterThan(baseline.lungDoseSavedUg);
  });

  it('guards against NaN in location.pm25 gracefully', () => {
    const nanLocation: LocationData = {
      ...mockLocation,
      pm25: NaN
    };
    const result = calculateImpact(mockProfile, nanLocation, [], {
      purifierHours: 8,
      maskGrade: 'n95',
      transitSwapKm: 0,
      sealedWindows: true
    });
    expect(isNaN(result.lungDoseSavedUg)).toBe(false);
    expect(result.lungDoseSavedUg).toBe(0);
    expect(result.cigarettesAvoided).toBe(0);
  });
});

// ─── calculateCrBoxSpecs ────────────────────────────────────────────────────

describe('calculateCrBoxSpecs', () => {
  it('returns ACH = 0 when room area is 0 (division-by-zero guard)', () => {
    const result = calculateCrBoxSpecs({
      fanDiameterInches: 20,
      mervRating: 13,
      numFilters: 4,
      fanSpeed: 'high',
      roomAreaSqFt: 0,
      ceilingHeightFt: 9,
    });
    expect(result.ach).toBe(0);
  });

  it('returns ACH = 0 when ceiling height is 0 (division-by-zero guard)', () => {
    const result = calculateCrBoxSpecs({
      fanDiameterInches: 20,
      mervRating: 13,
      numFilters: 4,
      fanSpeed: 'high',
      roomAreaSqFt: 400,
      ceilingHeightFt: 0,
    });
    expect(result.ach).toBe(0);
  });

  it('20-inch fan with 4 MERV-13 filters on high produces CADR > 0', () => {
    const result = calculateCrBoxSpecs({
      fanDiameterInches: 20,
      mervRating: 13,
      numFilters: 4,
      fanSpeed: 'high',
      roomAreaSqFt: 400,
      ceilingHeightFt: 9,
    });
    expect(result.cadrCfm).toBeGreaterThan(0);
  });

  it('low speed produces lower CADR than high speed', () => {
    const common = { fanDiameterInches: 20 as const, mervRating: 13 as const, numFilters: 4 as const, roomAreaSqFt: 300, ceilingHeightFt: 9 };
    const low  = calculateCrBoxSpecs({ ...common, fanSpeed: 'low' });
    const high = calculateCrBoxSpecs({ ...common, fanSpeed: 'high' });
    expect(low.cadrCfm).toBeLessThan(high.cadrCfm);
  });
});

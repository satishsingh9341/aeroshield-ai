export type AqiLevel = 'good' | 'moderate' | 'unhealthySensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous' | 'severe';

export interface LocationData {
  id: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  aqi: number;
  level: AqiLevel;
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  no2: number;  // ppb or ug/m3
  co: number;   // mg/m3
  temp: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  inversionRisk: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  inversionCeiling: number; // meters above ground
  primaryPollutant: 'PM2.5' | 'PM10' | 'NO2';
  smogSeasonName?: string; // e.g. "5th Season" or "Post-Diwali Inversion"
  hourlyForecast: {
    hour: string;
    aqi: number;
    inversionFactor: number; // 0 to 1 (1 = strongest inversion trapping)
    safeWindow: boolean;
  }[];
  notes: string;
}

export type PersonaType = 'family-guard' | 'pediatric-safety' | 'eco-commuter' | 'community-leader';

export interface UserProfile {
  cityId: string;
  customCityName?: string;
  householdMembers: {
    total: number;
    hasInfant: boolean;
    hasElderly: boolean;
    hasRespiratoryCondition: boolean; // Asthma, COPD
    hasPets: boolean;
    hasOutdoorWorkers: boolean;
  };
  dwelling: {
    type: 'apartment-high' | 'apartment-low' | 'independent-house' | 'poorly-sealed';
    airFiltration: 'none' | 'single-hepa' | 'multiple-hepa' | 'diy-cr-box' | 'central-merv';
    cookingType: 'lpg-gas' | 'electric-induction' | 'biomass-wood';
    heatingType: 'heat-pump' | 'electric-radiator' | 'gas-heater' | 'wood-stove' | 'none';
  };
  commute: {
    mode: 'solo-car' | 'two-wheeler' | 'bus' | 'metro-train' | 'carpool' | 'active-walk-bike' | 'wfh';
    dailyDistanceKm: number;
  };
  activePersona: PersonaType;
}

export interface DailyRoutineItem {
  id: string;
  timeSlot: string;
  title: string;
  activity: string;
  windowSafety: 'Optimal Window' | 'Moderate Caution' | 'Hazardous Inversion';
  recommendation: string;
  sustainableSwap: string;
  lungDoseSavedUg: number; // PM2.5 in micrograms saved from alveolar retention
  co2SavedKg: number;
  completed: boolean;
  category: 'commute' | 'exercise' | 'ventilation' | 'cooking' | 'school' | 'rest';
}

export interface IndoorHack {
  id: string;
  title: string;
  category: 'filtration' | 'ventilation' | 'cooking-clean' | 'sealing' | 'plants-humidity';
  difficulty: 'Easy' | 'Moderate' | 'DIY Builder';
  cost: '$0 (Free)' | '$5 - $20' | '$30 - $70';
  pmReductionPercent: number; // e.g. 85%
  summary: string;
  steps: string[];
  scientificMechanism: string;
  proTip: string;
  warning?: string;
  badge?: string;
}

export interface ImpactRecord {
  totalPm25AvoidedUg: number;
  cigarettesAvoided: number;
  co2SavedKg: number;
  noxSavedGrams: number;
  activeStreakDays: number;
  actionsTakenCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  impactBadge?: {
    metric: string;
    value: string;
    color: string;
  };
  actionableRoutines?: string[];
  hackReferenceId?: string;
}

export interface CommunityAlert {
  id: string;
  title: string;
  neighborhood: string;
  type: 'stubble-smoke' | 'waste-fire' | 'clean-air-haven' | 'carpool-offer' | 'inversion-peak';
  severity: 'info' | 'warning' | 'emergency';
  timestamp: string;
  description: string;
  actionRequested: string;
  upvotes: number;
}

export interface CleanAirHaven {
  id: string;
  name: string;
  address: string;
  type: 'Public Library' | 'Community Hall' | 'Coworking Hub' | 'Civic Center';
  filtration: string;
  indoorAqi: number;
  capacity: string;
  amenities: string[];
  openHours: string;
  cityId?: string;
}

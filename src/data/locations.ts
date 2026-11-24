import { LocationData } from '../types';

export const LOCATIONS: LocationData[] = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    region: 'National Capital Region',
    country: 'India',
    flag: '🇮🇳',
    aqi: 412,
    level: 'severe',
    pm25: 345,
    pm10: 480,
    no2: 88,
    co: 3.2,
    temp: 14,
    humidity: 78,
    windSpeed: 4,
    inversionRisk: 'Critical',
    inversionCeiling: 120, // Low winter boundary layer capping smoke
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Post-Harvest Inversion Smog',
    hourlyForecast: [
      { hour: '06:00', aqi: 445, inversionFactor: 0.95, safeWindow: false },
      { hour: '08:00', aqi: 460, inversionFactor: 0.98, safeWindow: false },
      { hour: '10:00', aqi: 410, inversionFactor: 0.85, safeWindow: false },
      { hour: '12:00', aqi: 310, inversionFactor: 0.55, safeWindow: true },
      { hour: '14:00', aqi: 280, inversionFactor: 0.40, safeWindow: true },
      { hour: '16:00', aqi: 330, inversionFactor: 0.65, safeWindow: false },
      { hour: '18:00', aqi: 415, inversionFactor: 0.90, safeWindow: false },
      { hour: '20:00', aqi: 450, inversionFactor: 0.96, safeWindow: false },
      { hour: '22:00', aqi: 470, inversionFactor: 0.99, safeWindow: false },
    ],
    notes: 'Severe ground-level thermal inversion combines with calm surface winds (<5 km/h) and regional biomass burning, trapping particulates below 150m.'
  },
  {
    id: 'lahore',
    name: 'Lahore',
    region: 'Punjab',
    country: 'Pakistan',
    flag: '🇵🇰',
    aqi: 395,
    level: 'hazardous',
    pm25: 320,
    pm10: 440,
    no2: 74,
    co: 2.8,
    temp: 13,
    humidity: 82,
    windSpeed: 3,
    inversionRisk: 'Critical',
    inversionCeiling: 140,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'The 5th Season (Winter Smog)',
    hourlyForecast: [
      { hour: '06:00', aqi: 430, inversionFactor: 0.95, safeWindow: false },
      { hour: '08:00', aqi: 440, inversionFactor: 0.96, safeWindow: false },
      { hour: '10:00', aqi: 380, inversionFactor: 0.80, safeWindow: false },
      { hour: '12:00', aqi: 290, inversionFactor: 0.50, safeWindow: true },
      { hour: '14:00', aqi: 270, inversionFactor: 0.42, safeWindow: true },
      { hour: '16:00', aqi: 320, inversionFactor: 0.62, safeWindow: false },
      { hour: '18:00', aqi: 390, inversionFactor: 0.88, safeWindow: false },
      { hour: '20:00', aqi: 420, inversionFactor: 0.95, safeWindow: false },
      { hour: '22:00', aqi: 445, inversionFactor: 0.98, safeWindow: false },
    ],
    notes: 'Transboundary haze and stagnant winter anticyclone trap low-grade diesel soot and industrial emissions in the Lahore basin.'
  },
  {
    id: 'salt-lake',
    name: 'Salt Lake City',
    region: 'Utah Valley',
    country: 'United States',
    flag: '🇺🇸',
    aqi: 168,
    level: 'unhealthy',
    pm25: 78,
    pm10: 92,
    no2: 42,
    co: 1.4,
    temp: -2,
    humidity: 71,
    windSpeed: 5,
    inversionRisk: 'Severe',
    inversionCeiling: 250,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Wasatch Winter Cold-Air Inversion',
    hourlyForecast: [
      { hour: '06:00', aqi: 185, inversionFactor: 0.90, safeWindow: false },
      { hour: '08:00', aqi: 195, inversionFactor: 0.92, safeWindow: false },
      { hour: '10:00', aqi: 175, inversionFactor: 0.78, safeWindow: false },
      { hour: '12:00', aqi: 140, inversionFactor: 0.50, safeWindow: true },
      { hour: '14:00', aqi: 130, inversionFactor: 0.45, safeWindow: true },
      { hour: '16:00', aqi: 155, inversionFactor: 0.65, safeWindow: false },
      { hour: '18:00', aqi: 175, inversionFactor: 0.85, safeWindow: false },
      { hour: '20:00', aqi: 188, inversionFactor: 0.91, safeWindow: false },
      { hour: '22:00', aqi: 192, inversionFactor: 0.94, safeWindow: false },
    ],
    notes: 'High-pressure cold air settles on snow-covered valley floor while warm air aloft seals the valley like a lid, trapping vehicle & woodstove particulate.'
  },
  {
    id: 'beijing',
    name: 'Beijing',
    region: 'Hebei Plain',
    country: 'China',
    flag: '🇨🇳',
    aqi: 178,
    level: 'unhealthy',
    pm25: 98,
    pm10: 145,
    no2: 55,
    co: 1.8,
    temp: 2,
    humidity: 58,
    windSpeed: 6,
    inversionRisk: 'Moderate',
    inversionCeiling: 320,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Winter Heating Season Haze',
    hourlyForecast: [
      { hour: '06:00', aqi: 190, inversionFactor: 0.82, safeWindow: false },
      { hour: '08:00', aqi: 185, inversionFactor: 0.80, safeWindow: false },
      { hour: '10:00', aqi: 170, inversionFactor: 0.65, safeWindow: false },
      { hour: '12:00', aqi: 135, inversionFactor: 0.42, safeWindow: true },
      { hour: '14:00', aqi: 125, inversionFactor: 0.38, safeWindow: true },
      { hour: '16:00', aqi: 150, inversionFactor: 0.55, safeWindow: false },
      { hour: '18:00', aqi: 180, inversionFactor: 0.78, safeWindow: false },
      { hour: '20:00', aqi: 195, inversionFactor: 0.86, safeWindow: false },
      { hour: '22:00', aqi: 200, inversionFactor: 0.89, safeWindow: false },
    ],
    notes: 'North china winter centralized district heating kick-in combined with slow southerly air currents trapped against the Yanshan mountains.'
  },
  {
    id: 'milan',
    name: 'Milan',
    region: 'Po Valley (Lombardy)',
    country: 'Italy',
    flag: '🇮🇹',
    aqi: 148,
    level: 'unhealthySensitive',
    pm25: 56,
    pm10: 78,
    no2: 62,
    co: 1.1,
    temp: 6,
    humidity: 86,
    windSpeed: 3,
    inversionRisk: 'Severe',
    inversionCeiling: 220,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Po Valley Winter Smog Basin',
    hourlyForecast: [
      { hour: '06:00', aqi: 160, inversionFactor: 0.88, safeWindow: false },
      { hour: '08:00', aqi: 165, inversionFactor: 0.90, safeWindow: false },
      { hour: '10:00', aqi: 145, inversionFactor: 0.70, safeWindow: false },
      { hour: '12:00', aqi: 110, inversionFactor: 0.45, safeWindow: true },
      { hour: '14:00', aqi: 105, inversionFactor: 0.40, safeWindow: true },
      { hour: '16:00', aqi: 130, inversionFactor: 0.60, safeWindow: false },
      { hour: '18:00', aqi: 155, inversionFactor: 0.82, safeWindow: false },
      { hour: '20:00', aqi: 165, inversionFactor: 0.88, safeWindow: false },
      { hour: '22:00', aqi: 170, inversionFactor: 0.92, safeWindow: false },
    ],
    notes: 'Surrounded by the Alps and Apennines, the Po Valley suffers from near-zero air circulation in winter, causing prolonged particulate pooling.'
  },
  {
    id: 'krakow',
    name: 'Kraków',
    region: 'Lesser Poland',
    country: 'Poland',
    flag: '🇵🇱',
    aqi: 162,
    level: 'unhealthy',
    pm25: 72,
    pm10: 105,
    no2: 48,
    co: 1.3,
    temp: 0,
    humidity: 79,
    windSpeed: 4,
    inversionRisk: 'Severe',
    inversionCeiling: 200,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Vistula Valley Coal & Wood Inversion',
    hourlyForecast: [
      { hour: '06:00', aqi: 175, inversionFactor: 0.88, safeWindow: false },
      { hour: '08:00', aqi: 180, inversionFactor: 0.91, safeWindow: false },
      { hour: '10:00', aqi: 155, inversionFactor: 0.72, safeWindow: false },
      { hour: '12:00', aqi: 120, inversionFactor: 0.48, safeWindow: true },
      { hour: '14:00', aqi: 115, inversionFactor: 0.42, safeWindow: true },
      { hour: '16:00', aqi: 145, inversionFactor: 0.68, safeWindow: false },
      { hour: '18:00', aqi: 170, inversionFactor: 0.86, safeWindow: false },
      { hour: '20:00', aqi: 185, inversionFactor: 0.92, safeWindow: false },
      { hour: '22:00', aqi: 190, inversionFactor: 0.95, safeWindow: false },
    ],
    notes: 'Basin topography along the Vistula River leads to persistent winter radiation inversions, holding domestic solid fuel combustion exhaust.'
  },
  {
    id: 'ulaanbaatar',
    name: 'Ulaanbaatar',
    region: 'Tuul Valley',
    country: 'Mongolia',
    flag: '🇲🇳',
    aqi: 385,
    level: 'hazardous',
    pm25: 295,
    pm10: 410,
    no2: 68,
    co: 3.5,
    temp: -18,
    humidity: 65,
    windSpeed: 2,
    inversionRisk: 'Critical',
    inversionCeiling: 100,
    primaryPollutant: 'PM2.5',
    smogSeasonName: 'Extreme Ger-District Raw Coal Smog',
    hourlyForecast: [
      { hour: '06:00', aqi: 420, inversionFactor: 0.98, safeWindow: false },
      { hour: '08:00', aqi: 435, inversionFactor: 0.99, safeWindow: false },
      { hour: '10:00', aqi: 360, inversionFactor: 0.82, safeWindow: false },
      { hour: '12:00', aqi: 280, inversionFactor: 0.55, safeWindow: true },
      { hour: '14:00', aqi: 260, inversionFactor: 0.48, safeWindow: true },
      { hour: '16:00', aqi: 310, inversionFactor: 0.70, safeWindow: false },
      { hour: '18:00', aqi: 395, inversionFactor: 0.92, safeWindow: false },
      { hour: '20:00', aqi: 415, inversionFactor: 0.97, safeWindow: false },
      { hour: '22:00', aqi: 430, inversionFactor: 0.99, safeWindow: false },
    ],
    notes: 'The coldest national capital on Earth, ringed by mountains with sub -20°C temperatures causing deep temperature inversion trapping stove coal smoke.'
  },
  {
    id: 'london',
    name: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    aqi: 72,
    level: 'moderate',
    pm25: 22,
    pm10: 34,
    no2: 45,
    co: 0.7,
    temp: 8,
    humidity: 85,
    windSpeed: 14,
    inversionRisk: 'Low',
    inversionCeiling: 850,
    primaryPollutant: 'NO2',
    smogSeasonName: 'Winter Traffic & Wood Stove Episodes',
    hourlyForecast: [
      { hour: '06:00', aqi: 65, inversionFactor: 0.40, safeWindow: true },
      { hour: '08:00', aqi: 82, inversionFactor: 0.55, safeWindow: false },
      { hour: '10:00', aqi: 75, inversionFactor: 0.45, safeWindow: true },
      { hour: '12:00', aqi: 60, inversionFactor: 0.30, safeWindow: true },
      { hour: '14:00', aqi: 55, inversionFactor: 0.25, safeWindow: true },
      { hour: '16:00', aqi: 72, inversionFactor: 0.50, safeWindow: true },
      { hour: '18:00', aqi: 85, inversionFactor: 0.60, safeWindow: false },
      { hour: '20:00', aqi: 78, inversionFactor: 0.52, safeWindow: true },
      { hour: '22:00', aqi: 68, inversionFactor: 0.42, safeWindow: true },
    ],
    notes: 'Occasional calm winter anticyclonic days trap domestic wood burner particulate and diesel emissions along arterial roads and river basins.'
  }
];

export function getAqiCategory(aqi: number): {
  level: LocationData['level'];
  label: string;
  colorClass: string;
  bgClass: string;
  badgeClass: string;
  textClass: string;
  healthSummary: string;
} {
  if (typeof aqi !== 'number' || !Number.isFinite(aqi) || aqi < 0) {
    return {
      level: 'moderate',
      label: 'Data Unavailable',
      colorClass: '#94a3b8',
      bgClass: 'bg-slate-800/60 border-slate-700 text-slate-300',
      badgeClass: 'bg-slate-700 text-slate-100 font-semibold',
      textClass: 'text-slate-300',
      healthSummary: 'Air quality telemetry is currently unavailable or invalid.'
    };
  }

  if (aqi <= 50) {
    return {
      level: 'good',
      label: 'Good',
      colorClass: '#10b981',
      bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badgeClass: 'bg-emerald-500 text-slate-950 font-semibold',
      textClass: 'text-emerald-400',
      healthSummary: 'Air quality is satisfactory and poses little or no risk.'
    };
  } else if (aqi <= 100) {
    return {
      level: 'moderate',
      label: 'Moderate',
      colorClass: '#f59e0b',
      bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badgeClass: 'bg-amber-500 text-slate-950 font-semibold',
      textClass: 'text-amber-400',
      healthSummary: 'Acceptable; unusually sensitive people should consider limiting heavy exertion.'
    };
  } else if (aqi <= 150) {
    return {
      level: 'unhealthySensitive',
      label: 'Unhealthy for Sensitive Groups',
      colorClass: '#f97316',
      bgClass: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      badgeClass: 'bg-orange-400 text-slate-950 font-bold',
      textClass: 'text-orange-400',
      healthSummary: 'Children, older adults, and individuals with asthma/COPD face heightened risk.'
    };
  } else if (aqi <= 200) {
    return {
      level: 'unhealthy',
      label: 'Unhealthy',
      colorClass: '#ef4444',
      bgClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      badgeClass: 'bg-rose-600 text-white font-semibold',
      textClass: 'text-rose-400',
      healthSummary: 'Everyone may begin to experience health effects; members of sensitive groups experience more serious effects.'
    };
  } else if (aqi <= 300) {
    return {
      level: 'veryUnhealthy',
      label: 'Very Unhealthy',
      colorClass: '#8b5cf6',
      bgClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      badgeClass: 'bg-purple-600 text-white font-semibold',
      textClass: 'text-purple-400',
      healthSummary: 'Health alert: the risk of health effects is increased for everyone. Avoid prolonged outdoor exertion.'
    };
  } else if (aqi <= 400) {
    return {
      level: 'hazardous',
      label: 'Hazardous',
      colorClass: '#dc2626',
      bgClass: 'bg-red-600/15 border-red-500/40 text-red-400',
      badgeClass: 'bg-red-700 text-white font-bold',
      textClass: 'text-red-400',
      healthSummary: 'Health warnings of emergency conditions. The entire population is even more likely to be affected.'
    };
  } else {
    return {
      level: 'severe',
      label: 'Severe / Emergency',
      colorClass: '#701a75',
      bgClass: 'bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-300',
      badgeClass: 'bg-fuchsia-800 text-fuchsia-100 font-extrabold animate-pulse',
      textClass: 'text-fuchsia-300',
      healthSummary: 'Catastrophic smog episode. Atmospheric inversion trapping particulate. Extreme cardiopulmonary risk.'
    };
  }
}

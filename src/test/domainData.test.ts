import { describe, it, expect } from 'vitest';
import { LOCATIONS, getAqiCategory } from '../data/locations';
import { INDOOR_HACKS } from '../data/hacks';
import { COMMUNITY_ALERTS, CLEAN_AIR_HAVENS } from '../data/community';

describe('domainData: locations.ts', () => {
  describe('getAqiCategory boundary conditions and categories', () => {
    it('returns Data Unavailable for invalid, negative, or non-finite inputs', () => {
      const invalidInputs = [NaN, -1, -50, -Infinity, Infinity, null as unknown as number, undefined as unknown as number, 'bad' as unknown as number];
      for (const input of invalidInputs) {
        const result = getAqiCategory(input);
        expect(result.level).toBe('moderate');
        expect(result.label).toBe('Data Unavailable');
        expect(result.textClass).toBe('text-slate-300');
        expect(result.colorClass).toBe('#94a3b8');
        expect(result.healthSummary).toContain('unavailable or invalid');
      }
    });

    it('handles exact boundary AQI 0 and 50 as Good', () => {
      const at0 = getAqiCategory(0);
      expect(at0.level).toBe('good');
      expect(at0.label).toBe('Good');
      expect(at0.badgeClass).toContain('bg-emerald-500');
      expect(at0.badgeClass).toContain('text-slate-950'); // High contrast dark text on bright emerald

      const at50 = getAqiCategory(50);
      expect(at50.level).toBe('good');
      expect(at50.label).toBe('Good');
    });

    it('handles boundary AQI 51 and 100 as Moderate', () => {
      const at51 = getAqiCategory(51);
      expect(at51.level).toBe('moderate');
      expect(at51.label).toBe('Moderate');
      expect(at51.badgeClass).toContain('bg-amber-500');
      expect(at51.badgeClass).toContain('text-slate-950'); // High contrast dark text on amber

      const at100 = getAqiCategory(100);
      expect(at100.level).toBe('moderate');
      expect(at100.label).toBe('Moderate');
    });

    it('handles boundary AQI 101 and 150 as Unhealthy for Sensitive Groups with high-contrast badge (A11Y-01)', () => {
      const at101 = getAqiCategory(101);
      expect(at101.level).toBe('unhealthySensitive');
      expect(at101.label).toBe('Unhealthy for Sensitive Groups');
      expect(at101.badgeClass).toBe('bg-orange-400 text-slate-950 font-bold'); // Accessible WCAG AA contrast

      const at150 = getAqiCategory(150);
      expect(at150.level).toBe('unhealthySensitive');
      expect(at150.label).toBe('Unhealthy for Sensitive Groups');
    });

    it('handles boundary AQI 151 and 200 as Unhealthy', () => {
      const at151 = getAqiCategory(151);
      expect(at151.level).toBe('unhealthy');
      expect(at151.label).toBe('Unhealthy');
      expect(at151.badgeClass).toContain('bg-rose-600 text-white');

      const at200 = getAqiCategory(200);
      expect(at200.level).toBe('unhealthy');
      expect(at200.label).toBe('Unhealthy');
    });

    it('handles boundary AQI 201 and 300 as Very Unhealthy', () => {
      const at201 = getAqiCategory(201);
      expect(at201.level).toBe('veryUnhealthy');
      expect(at201.label).toBe('Very Unhealthy');
      expect(at201.badgeClass).toContain('bg-purple-600 text-white');

      const at300 = getAqiCategory(300);
      expect(at300.level).toBe('veryUnhealthy');
      expect(at300.label).toBe('Very Unhealthy');
    });

    it('handles boundary AQI 301 and 400 as Hazardous', () => {
      const at301 = getAqiCategory(301);
      expect(at301.level).toBe('hazardous');
      expect(at301.label).toBe('Hazardous');
      expect(at301.badgeClass).toContain('bg-red-700 text-white font-bold');

      const at400 = getAqiCategory(400);
      expect(at400.level).toBe('hazardous');
      expect(at400.label).toBe('Hazardous');
    });

    it('handles AQI > 400 as Severe / Emergency', () => {
      const at401 = getAqiCategory(401);
      expect(at401.level).toBe('severe');
      expect(at401.label).toBe('Severe / Emergency');
      expect(at401.badgeClass).toContain('bg-fuchsia-800 text-fuchsia-100');

      const at999 = getAqiCategory(999);
      expect(at999.level).toBe('severe');
      expect(at999.healthSummary).toContain('Catastrophic smog episode');
    });

    it('never uses text-slate-500 or text-slate-600 in contrast classes', () => {
      const testAqiValues = [25, 75, 125, 175, 250, 350, 500, -1, NaN];
      for (const aqi of testAqiValues) {
        const cat = getAqiCategory(aqi);
        expect(cat.bgClass).not.toContain('text-slate-500');
        expect(cat.bgClass).not.toContain('text-slate-600');
        expect(cat.badgeClass).not.toContain('text-slate-500');
        expect(cat.badgeClass).not.toContain('text-slate-600');
        expect(cat.textClass).not.toContain('text-slate-500');
        expect(cat.textClass).not.toContain('text-slate-600');
      }
    });
  });

  describe('LOCATIONS data integrity', () => {
    it('contains all expected winter smog cities across multiple continents', () => {
      const cityIds = LOCATIONS.map(l => l.id);
      expect(cityIds).toEqual(
        expect.arrayContaining(['delhi', 'lahore', 'salt-lake', 'milan', 'beijing', 'krakow', 'ulaanbaatar', 'london'])
      );
    });

    it('ensures each location has complete valid data fields', () => {
      for (const loc of LOCATIONS) {
        expect(loc.id).toBeTruthy();
        expect(loc.name).toBeTruthy();
        expect(loc.region).toBeTruthy();
        expect(loc.country).toBeTruthy();
        expect(loc.flag).toBeTruthy();
        expect(typeof loc.aqi).toBe('number');
        expect(loc.aqi).toBeGreaterThan(0);
        expect(typeof loc.pm25).toBe('number');
        expect(loc.pm25).toBeGreaterThan(0);
        expect(typeof loc.pm10).toBe('number');
        expect(typeof loc.no2).toBe('number');
        expect(typeof loc.inversionCeiling).toBe('number');
        expect(loc.inversionCeiling).toBeGreaterThan(0);
        expect(['Critical', 'Severe', 'Moderate', 'Low']).toContain(loc.inversionRisk);
        expect(loc.notes).toBeTruthy();
        expect(Array.isArray(loc.hourlyForecast)).toBe(true);
        expect(loc.hourlyForecast.length).toBeGreaterThan(0);
      }
    });

    it('validates hourly forecast structure and safe window metadata', () => {
      for (const loc of LOCATIONS) {
        let hasSafeWindow = false;
        for (const slot of loc.hourlyForecast) {
          expect(slot.hour).toMatch(/^\d{2}:\d{2}$/);
          expect(typeof slot.aqi).toBe('number');
          expect(slot.aqi).toBeGreaterThan(0);
          expect(typeof slot.inversionFactor).toBe('number');
          expect(slot.inversionFactor).toBeGreaterThanOrEqual(0);
          expect(slot.inversionFactor).toBeLessThanOrEqual(1);
          expect(typeof slot.safeWindow).toBe('boolean');
          if (slot.safeWindow) hasSafeWindow = true;
        }
        // Every city should define at least one safer diurnal mixing window
        expect(hasSafeWindow).toBe(true);
      }
    });
  });
});

describe('domainData: hacks.ts', () => {
  it('contains comprehensive DIY and physics-based IAQ hacks', () => {
    expect(INDOOR_HACKS.length).toBeGreaterThanOrEqual(5);
  });

  it('validates each hack has complete metadata and efficiency ratings', () => {
    const validCategories = ['filtration', 'ventilation', 'cooking-clean', 'sealing', 'plants-humidity'];

    for (const hack of INDOOR_HACKS) {
      expect(hack.id).toBeTruthy();
      expect(hack.title).toBeTruthy();
      expect(validCategories).toContain(hack.category);
      expect(hack.difficulty).toBeTruthy();
      expect(hack.cost).toBeTruthy();
      expect(typeof hack.pmReductionPercent).toBe('number');
      expect(hack.pmReductionPercent).toBeGreaterThan(0);
      expect(hack.pmReductionPercent).toBeLessThanOrEqual(100);
      expect(hack.summary).toBeTruthy();
      expect(Array.isArray(hack.steps)).toBe(true);
      expect(hack.steps.length).toBeGreaterThanOrEqual(3);
      expect(hack.scientificMechanism).toBeTruthy();
    }
  });

  it('includes the gold-standard Corsi-Rosenthal Box specifications', () => {
    const crBox = INDOOR_HACKS.find(h => h.id === 'cr-box-fan');
    expect(crBox).toBeDefined();
    expect(crBox?.category).toBe('filtration');
    expect(crBox?.pmReductionPercent).toBeGreaterThanOrEqual(90);
    expect(crBox?.badge).toBe('Gold Standard DIY');
    expect(crBox?.steps.some(s => s.includes('MERV-13'))).toBe(true);
    expect(crBox?.steps.some(s => s.includes('box fan'))).toBe(true);
    expect(crBox?.steps.some(s => s.includes('shroud'))).toBe(true);
    expect(crBox?.scientificMechanism).toContain('Clean Air Delivery Rates');
  });

  it('includes solar noon micro-flushing protocol for inversion mitigation', () => {
    const flushHack = INDOOR_HACKS.find(h => h.id === 'solar-noon-flush');
    expect(flushHack).toBeDefined();
    expect(flushHack?.category).toBe('ventilation');
    expect(flushHack?.title).toContain('Solar Noon');
    expect(flushHack?.scientificMechanism).toContain('thermal inversion');
  });

  it('includes the ultrasonic humidifier mineral mist warning', () => {
    const humidHack = INDOOR_HACKS.find(h => h.id === 'ultrasonic-humidifier-alert');
    expect(humidHack).toBeDefined();
    expect(humidHack?.category).toBe('plants-humidity');
    expect(humidHack?.summary).toContain('dissolved calcium and magnesium');
    expect(humidHack?.warning).toBeDefined();
  });
});

describe('domainData: community.ts', () => {
  describe('COMMUNITY_ALERTS', () => {
    it('contains community alerts with valid alert types and positive upvotes', () => {
      expect(COMMUNITY_ALERTS.length).toBeGreaterThanOrEqual(3);

      const validTypes = ['inversion-peak', 'waste-fire', 'carpool-offer', 'clean-air-haven'];
      const validSeverities = ['emergency', 'warning', 'info'];

      for (const alert of COMMUNITY_ALERTS) {
        expect(alert.id).toBeTruthy();
        expect(alert.title).toBeTruthy();
        expect(alert.neighborhood).toBeTruthy();
        expect(validTypes).toContain(alert.type);
        expect(validSeverities).toContain(alert.severity);
        expect(alert.timestamp).toBeTruthy();
        expect(alert.description).toBeTruthy();
        expect(alert.actionRequested).toBeTruthy();
        expect(typeof alert.upvotes).toBe('number');
        expect(alert.upvotes).toBeGreaterThanOrEqual(0);
      }
    });

    it('includes specific alerts for waste fire and inversion peak', () => {
      const types = COMMUNITY_ALERTS.map(a => a.type);
      expect(types).toContain('waste-fire');
      expect(types).toContain('inversion-peak');
      expect(types).toContain('clean-air-haven');
    });
  });

  describe('CLEAN_AIR_HAVENS', () => {
    it('contains clean air havens mapped to major smog cities', () => {
      expect(CLEAN_AIR_HAVENS.length).toBeGreaterThanOrEqual(8);

      const citiesWithHavens = new Set(CLEAN_AIR_HAVENS.map(h => h.cityId));
      expect(citiesWithHavens.has('delhi')).toBe(true);
      expect(citiesWithHavens.has('milan')).toBe(true);
      expect(citiesWithHavens.has('beijing')).toBe(true);
      expect(citiesWithHavens.has('salt-lake')).toBe(true);
      expect(citiesWithHavens.has('london')).toBe(true);
      expect(citiesWithHavens.has('lahore')).toBe(true);
      expect(citiesWithHavens.has('krakow')).toBe(true);
      expect(citiesWithHavens.has('ulaanbaatar')).toBe(true);
    });

    it('ensures every clean air haven maintains low indoor AQI and filtration specs', () => {
      for (const haven of CLEAN_AIR_HAVENS) {
        expect(haven.id).toBeTruthy();
        expect(haven.name).toBeTruthy();
        expect(haven.address).toBeTruthy();
        expect(haven.type).toBeTruthy();
        expect(haven.filtration).toBeTruthy();
        expect(typeof haven.indoorAqi).toBe('number');
        // Clean air havens must maintain safe indoor AQI (< 50)
        expect(haven.indoorAqi).toBeLessThanOrEqual(50);
        expect(haven.capacity).toBeTruthy();
        expect(Array.isArray(haven.amenities)).toBe(true);
        expect(haven.amenities.length).toBeGreaterThan(0);
        expect(haven.openHours).toBeTruthy();
        expect(haven.cityId).toBeTruthy();
      }
    });
  });
});

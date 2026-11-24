import { describe, it, expect } from 'vitest';
import { getAqiCategory, LOCATIONS } from '../data/locations';

describe('locations – getAqiCategory and data integrity', () => {
  it('handles NaN gracefully without throwing', () => {
    const result = getAqiCategory(NaN);
    expect(result.level).toBe('moderate');
    expect(result.label).toBe('Data Unavailable');
  });

  it('handles null, undefined, and negative numbers gracefully', () => {
    // @ts-expect-error testing invalid inputs
    expect(getAqiCategory(null).label).toBe('Data Unavailable');
    // @ts-expect-error testing invalid inputs
    expect(getAqiCategory(undefined).label).toBe('Data Unavailable');
    expect(getAqiCategory(-10).label).toBe('Data Unavailable');
  });

  it('returns accessible high-contrast badge for unhealthySensitive (A11Y-01)', () => {
    const cat = getAqiCategory(125);
    expect(cat.level).toBe('unhealthySensitive');
    expect(cat.badgeClass).toBe('bg-orange-400 text-slate-950 font-bold');
  });

  it('correctly categorizes across standard AQI brackets', () => {
    expect(getAqiCategory(35).level).toBe('good');
    expect(getAqiCategory(75).level).toBe('moderate');
    expect(getAqiCategory(125).level).toBe('unhealthySensitive');
    expect(getAqiCategory(175).level).toBe('unhealthy');
    expect(getAqiCategory(250).level).toBe('veryUnhealthy');
    expect(getAqiCategory(350).level).toBe('hazardous');
    expect(getAqiCategory(450).level).toBe('severe');
  });

  it('includes international locations like Milan, Beijing, Salt Lake City, London', () => {
    const ids = LOCATIONS.map(l => l.id);
    expect(ids).toContain('delhi');
    expect(ids).toContain('lahore');
    expect(ids).toContain('milan');
    expect(ids).toContain('beijing');
    expect(ids).toContain('salt-lake');
    expect(ids).toContain('london');
  });
});

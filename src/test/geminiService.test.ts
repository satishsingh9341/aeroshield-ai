import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const store: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  },
  writable: true,
});

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: {} } });

import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  SUPPORTED_MODELS,
  queryAeroGuideAi,
} from '../services/geminiService';
import { clearMemoryFallback } from '../services/storageService';

describe('geminiService – storage helpers', () => {
  beforeEach(() => {
    clearMemoryFallback();
    delete store['aeroshield_gemini_api_key'];
    delete store['aeroshield_gemini_model'];
  });

  it('getStoredModel returns default "gemini-1.5-flash" when nothing stored', () => {
    store['aeroshield_gemini_model'] = '';
    // localStorage.getItem returns '' not null, so we clear it properly
    delete store['aeroshield_gemini_model'];
    expect(getStoredModel()).toBe('gemini-1.5-flash');
  });

  it('setStoredModel persists and getStoredModel retrieves it', () => {
    setStoredModel('gemini-1.5-pro');
    expect(getStoredModel()).toBe('gemini-1.5-pro');
  });

  it('setStoredModel rejects invalid model not in SUPPORTED_MODELS', () => {
    setStoredModel('unsupported-gpt-model' as any);
    expect(getStoredModel()).toBe('gemini-1.5-flash');
  });

  it('setStoredApiKey trims whitespace', () => {
    setStoredApiKey('  my-key  ');
    expect(getStoredApiKey()).toBe('my-key');
  });

  it('getStoredApiKey returns empty string when nothing is stored', () => {
    delete store['aeroshield_gemini_api_key'];
    expect(getStoredApiKey()).toBe('');
  });

  it('exports expected SUPPORTED_MODELS allowlist', () => {
    expect(SUPPORTED_MODELS).toContain('gemini-1.5-flash');
    expect(SUPPORTED_MODELS).toContain('gemini-1.5-pro');
    expect(SUPPORTED_MODELS).toContain('gemini-2.0-flash-exp');
  });

  it('aborts queryAeroGuideAi when AbortSignal is aborted', async () => {
    delete store['aeroshield_gemini_api_key'];
    const controller = new AbortController();
    controller.abort();

    const dummyProfile: any = {
      householdMembers: { total: 4 },
      dwelling: { type: 'apartment', airFiltration: 'none', cookingType: 'gas', heatingType: 'electric' },
      commute: { mode: 'car', dailyDistanceKm: 10 },
      activePersona: 'family-guard'
    };
    const dummyLocation: any = {
      name: 'Delhi', country: 'India', aqi: 300, level: 'severe', pm25: 200, inversionRisk: 'Severe', inversionCeiling: 150
    };

    await expect(queryAeroGuideAi('hello', dummyProfile, dummyLocation, controller.signal))
      .rejects.toThrow();
  });
});

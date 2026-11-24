import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LOCATIONS, getAqiCategory } from '../data/locations';
import { CLEAN_AIR_HAVENS } from '../data/community';
import { calculateCrBoxSpecs } from '../services/impactCalculator';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { ProfileModal } from '../components/ProfileModal';
import { CommunityTab } from '../components/CommunityTab';
import { EmergencyPlanTab } from '../components/EmergencyPlanTab';
import { InversionBanner } from '../components/InversionBanner';
import { LocationData, UserProfile } from '../types';

// WCAG 2.1 Contrast Oracle
function srgbLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sc = c / 255;
    return sc <= 0.03928 ? sc / 12.92 : Math.pow((sc + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(x => x + x).join('') : cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = srgbLuminance(...hexToRgb(hex1));
  const l2 = srgbLuminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const mockLocation: LocationData = LOCATIONS[0];

const mockProfile: UserProfile = {
  cityId: 'delhi',
  activePersona: 'family-guard',
  householdMembers: {
    total: 4,
    hasInfant: true,
    hasElderly: false,
    hasRespiratoryCondition: true,
    hasPets: false,
    hasOutdoorWorkers: false,
  },
  dwelling: {
    type: 'apartment-high',
    airFiltration: 'diy-cr-box',
    cookingType: 'electric-induction',
    heatingType: 'electric-radiator',
  },
  commute: {
    mode: 'metro-train',
    dailyDistanceKm: 12,
  },
};

describe('Adversarial Challenge Suite — Challenger 2', () => {

  describe('1. WCAG 2.1 AA Color Contrast Oracle', () => {
    it('verifies that #f97316 (orange-500) fails WCAG AA against white text but passes against dark text', () => {
      const contrastOnWhite = contrastRatio('#f97316', '#ffffff');
      const contrastOnDark = contrastRatio('#f97316', '#020617');

      // #f97316 on white fails WCAG AA normal (requires 4.5:1)
      expect(contrastOnWhite).toBeLessThan(3.0);
      expect(contrastOnWhite).toBeCloseTo(2.80, 1);

      // #f97316 on #020617 passes WCAG AA and AAA (>7.0:1)
      expect(contrastOnDark).toBeGreaterThanOrEqual(7.0);
      expect(contrastOnDark).toBeCloseTo(7.20, 1);
    });

    it('verifies that all AQI badge classes meet WCAG 2.1 AA (and AAA) contrast standards', () => {
      const aqiTestValues = [25, 75, 125, 175, 250, 350, 450, NaN];
      
      const badgeColorHexMap: Record<string, { bg: string; text: string }> = {
        'bg-emerald-500': { bg: '#10b981', text: '#020617' },
        'bg-amber-500': { bg: '#f59e0b', text: '#020617' },
        'bg-orange-400': { bg: '#fb923c', text: '#020617' },
        'bg-rose-600': { bg: '#e11d48', text: '#ffffff' },
        'bg-purple-600': { bg: '#9333ea', text: '#ffffff' },
        'bg-red-700': { bg: '#b91c1c', text: '#ffffff' },
        'bg-fuchsia-800': { bg: '#86198f', text: '#fae8ff' },
        'bg-slate-700': { bg: '#334155', text: '#f1f5f9' },
      };

      for (const aqi of aqiTestValues) {
        const cat = getAqiCategory(aqi);
        // Find matching badge bg
        const matchedKey = Object.keys(badgeColorHexMap).find(k => cat.badgeClass.includes(k));
        expect(matchedKey).toBeTruthy();
        if (matchedKey) {
          const { bg, text } = badgeColorHexMap[matchedKey];
          const ratio = contrastRatio(bg, text);
          // All badges must exceed WCAG 2.1 AA minimum 4.5:1
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    it('empirically verifies text contrast against dark backgrounds #020617 and #0f172a', () => {
      const textColors = [
        { name: 'slate-300', hex: '#cbd5e1' },
        { name: 'slate-400', hex: '#94a3b8' },
        { name: 'emerald-400', hex: '#34d399' },
        { name: 'amber-400', hex: '#fbbf24' },
        { name: 'orange-400', hex: '#fb923c' },
        { name: 'rose-400', hex: '#fb7185' },
        { name: 'purple-400', hex: '#c084fc' },
        { name: 'red-400', hex: '#f87171' },
        { name: 'fuchsia-300', hex: '#f0abfc' },
      ];

      for (const color of textColors) {
        const ratioOnDark = contrastRatio(color.hex, '#020617');
        const ratioOnSurface = contrastRatio(color.hex, '#0f172a');
        expect(ratioOnDark).toBeGreaterThanOrEqual(4.5);
        expect(ratioOnSurface).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  describe('2. Modal Focus Trapping Under Rapid Tab Navigation', () => {
    it('ProfileModal wraps focus from last element to first element on Tab', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={mockProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const dialog = screen.getByRole('dialog');
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusables.length).toBeGreaterThan(1);

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      // Focus last element and simulate Tab
      lastElement.focus();
      expect(document.activeElement).toBe(lastElement);

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
      expect(document.activeElement).toBe(firstElement);
    });

    it('ProfileModal wraps focus from first element to last element on Shift+Tab', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={mockProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const dialog = screen.getByRole('dialog');
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      // Focus first element and simulate Shift+Tab
      firstElement.focus();
      expect(document.activeElement).toBe(firstElement);

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(lastElement);
    });

    it('ApiKeyModal wraps focus properly on Tab and Shift+Tab', () => {
      render(<ApiKeyModal isOpen={true} onClose={vi.fn()} />);

      const dialog = screen.getByRole('dialog');
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusables.length).toBeGreaterThan(1);

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      // Forward Tab wrap
      lastElement.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
      expect(document.activeElement).toBe(firstElement);

      // Backward Shift+Tab wrap
      firstElement.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(lastElement);
    });
  });

  describe('3. Accessible Names and Label Mappings (Emergency Checkboxes & Form Controls)', () => {
    it('verifies that all 16 emergency plan checkboxes are enclosed in labels and can be toggled via label text', () => {
      const { container } = render(
        <EmergencyPlanTab location={mockLocation} profile={mockProfile} />
      );

      const checkboxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
      expect(checkboxes.length).toBe(16);

      checkboxes.forEach((cb, idx) => {
        const label = cb.closest('label');
        expect(label).not.toBeNull();
        expect(label?.textContent?.trim().length).toBeGreaterThan(10);

        // Click the label span
        const span = label?.querySelector('span');
        expect(span).not.toBeNull();

        const initialChecked = cb.checked;
        fireEvent.click(span!);
        // Clicking the associated label text toggles the checkbox
        expect(cb.checked).toBe(!initialChecked);
      });
    });

    it('verifies programmatic labels for all form inputs across modals', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={mockProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const requiredLabels = [
        'Total people:',
        'Housing Structure',
        'Air Purification',
        'Heating Source',
        'Cooking Source',
        'Primary Transit Mode',
        'Daily Transit Distance (km)'
      ];

      for (const labelText of requiredLabels) {
        const input = screen.getByLabelText(labelText);
        expect(input).toBeInTheDocument();
        expect(input.getAttribute('id')).toBeTruthy();
      }
    });
  });

  describe('4. Domain Physics Calculations (Corsi-Rosenthal Box ACH)', () => {
    it('strictly satisfies mass conservation and ACH dimensional formula', () => {
      const testCases = [
        { area: 150, height: 8, fan: 20 as const, merv: 13 as const, filters: 4 as const, speed: 'medium' as const },
        { area: 300, height: 9, fan: 20 as const, merv: 13 as const, filters: 4 as const, speed: 'high' as const },
        { area: 500, height: 10, fan: 12 as const, merv: 11 as const, filters: 1 as const, speed: 'low' as const },
      ];

      for (const tc of testCases) {
        const res = calculateCrBoxSpecs({
          fanDiameterInches: tc.fan,
          mervRating: tc.merv,
          numFilters: tc.filters,
          fanSpeed: tc.speed,
          roomAreaSqFt: tc.area,
          ceilingHeightFt: tc.height
        });

        const expectedVolume = tc.area * tc.height;
        const expectedAch = Math.round(((res.cadrCfm * 60) / expectedVolume) * 10) / 10;
        expect(res.ach).toBe(expectedAch);
        expect(res.cadrCfm).toBeGreaterThan(0);
      }
    });

    it('handles extreme bounds gracefully without NaN, Infinity, or crash', () => {
      const zeroResult = calculateCrBoxSpecs({
        fanDiameterInches: 20,
        mervRating: 13,
        numFilters: 4,
        fanSpeed: 'medium',
        roomAreaSqFt: 0,
        ceilingHeightFt: 0
      });
      expect(zeroResult.ach).toBe(0);
      expect(Number.isFinite(zeroResult.ach)).toBe(true);

      const negativeResult = calculateCrBoxSpecs({
        fanDiameterInches: 20,
        mervRating: 13,
        numFilters: 4,
        fanSpeed: 'medium',
        roomAreaSqFt: -100,
        ceilingHeightFt: -9
      });
      expect(negativeResult.ach).toBe(0);

      const hugeResult = calculateCrBoxSpecs({
        fanDiameterInches: 20,
        mervRating: 13,
        numFilters: 4,
        fanSpeed: 'medium',
        roomAreaSqFt: 100000,
        ceilingHeightFt: 20
      });
      expect(hugeResult.ach).toBeGreaterThanOrEqual(0);
      expect(hugeResult.ach).toBeLessThan(1);
    });

    it('models multi-filter resistance drop: 4 filters yields >2x CADR of 1 filter', () => {
      const oneFilter = calculateCrBoxSpecs({
        fanDiameterInches: 20,
        mervRating: 13,
        numFilters: 1,
        fanSpeed: 'high',
        roomAreaSqFt: 300,
        ceilingHeightFt: 9
      });

      const fourFilter = calculateCrBoxSpecs({
        fanDiameterInches: 20,
        mervRating: 13,
        numFilters: 4,
        fanSpeed: 'high',
        roomAreaSqFt: 300,
        ceilingHeightFt: 9
      });

      expect(fourFilter.cadrCfm).toBeGreaterThan(oneFilter.cadrCfm * 2);
    });
  });

  describe('5. Inversion Forecast Active Hour Highlight', () => {
    it('safely maps all 24 hours (0..23) to a valid forecast index without out-of-bounds error', () => {
      const forecast = mockLocation.hourlyForecast;
      expect(forecast.length).toBeGreaterThan(0);

      for (let h = 0; h < 24; h++) {
        const closestIdx = forecast.reduce((prevIdx, curr, currIdx, arr) => {
          const currH = parseInt(curr.hour.split(':')[0], 10) || 0;
          const prevH = parseInt(arr[prevIdx].hour.split(':')[0], 10) || 0;
          return Math.abs(currH - h) < Math.abs(prevH - h) ? currIdx : prevIdx;
        }, 0);

        expect(closestIdx).toBeGreaterThanOrEqual(0);
        expect(closestIdx).toBeLessThan(forecast.length);
        expect(forecast[closestIdx]).toBeDefined();
      }
    });

    it('renders InversionBanner and active hour without crashing', () => {
      const { container } = render(<InversionBanner location={mockLocation} />);
      expect(container).toBeInTheDocument();
      // Expand physics section
      const expandBtn = screen.getByRole('button', { name: /Inversion Physics & Hourly Curve/i });
      fireEvent.click(expandBtn);

      // Now badge exists
      expect(screen.getByText('Now')).toBeInTheDocument();
    });
  });

  describe('6. International City Haven Mappings', () => {
    it('verifies that all 8 global cities have at least 1 verified clean air haven', () => {
      expect(LOCATIONS.length).toBe(8);

      for (const loc of LOCATIONS) {
        const cityHavens = CLEAN_AIR_HAVENS.filter(h => h.cityId === loc.id);
        expect(cityHavens.length).toBeGreaterThanOrEqual(1);

        cityHavens.forEach(haven => {
          expect(haven.name.length).toBeGreaterThan(3);
          expect(haven.address.length).toBeGreaterThan(5);
          expect(haven.indoorAqi).toBeLessThan(50); // Clean air haven requirement
          expect(haven.filtration.length).toBeGreaterThan(3);
          expect(haven.openHours.length).toBeGreaterThan(3);
        });
      }
    });

    it('CommunityTab displays localized havens corresponding to selected city', () => {
      for (const loc of LOCATIONS) {
        const { unmount } = render(<CommunityTab location={loc} profile={mockProfile} />);
        
        const expectedHavens = CLEAN_AIR_HAVENS.filter(h => h.cityId === loc.id);
        expect(expectedHavens.length).toBeGreaterThanOrEqual(1);

        for (const haven of expectedHavens) {
          expect(screen.getByText(haven.name)).toBeInTheDocument();
        }
        unmount();
      }
    });
  });
});

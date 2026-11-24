import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { InversionBanner } from '../components/InversionBanner';
import { EmergencyPlanTab } from '../components/EmergencyPlanTab';
import { ProfileModal } from '../components/ProfileModal';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { IaqLabTab } from '../components/IaqLabTab';
import { RoutinesTab } from '../components/RoutinesTab';
import { ImpactTab } from '../components/ImpactTab';
import { CommunityTab } from '../components/CommunityTab';
import { Footer } from '../components/Footer';
import { getAqiCategory, LOCATIONS } from '../data/locations';
import { generateSmartRoutines } from '../services/geminiService';
import type { LocationData, UserProfile } from '../types';

// Raw component sources for contrast static verification
import navbarSrc from '../components/Navbar.tsx?raw';
import inversionBannerSrc from '../components/InversionBanner.tsx?raw';
import emergencyPlanSrc from '../components/EmergencyPlanTab.tsx?raw';
import profileModalSrc from '../components/ProfileModal.tsx?raw';
import apiKeyModalSrc from '../components/ApiKeyModal.tsx?raw';
import iaqLabSrc from '../components/IaqLabTab.tsx?raw';
import routinesSrc from '../components/RoutinesTab.tsx?raw';
import impactSrc from '../components/ImpactTab.tsx?raw';
import communitySrc from '../components/CommunityTab.tsx?raw';
import footerSrc from '../components/Footer.tsx?raw';
import chatTabSrc from '../components/ChatTab.tsx?raw';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const testLocation: LocationData = LOCATIONS.find(l => l.id === 'delhi') || LOCATIONS[0];

const testProfile: UserProfile = {
  cityId: 'delhi',
  activePersona: 'family-guard',
  householdMembers: {
    total: 3,
    hasInfant: false,
    hasElderly: true,
    hasRespiratoryCondition: true,
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
    dailyDistanceKm: 15,
  },
};

describe('Accessibility Verification (WCAG 2.1 AA Compliance)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Programmatic Form Labels', () => {
    it('ProfileModal inputs all have associated label elements via htmlFor and id', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={testProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const labeledControls = [
        'Total people:',
        'Housing Structure',
        'Air Purification',
        'Heating Source',
        'Cooking Source',
        'Primary Transit Mode',
        'Daily Transit Distance (km)',
      ];

      for (const labelText of labeledControls) {
        const input = screen.getByLabelText(labelText);
        expect(input).toBeInTheDocument();
        const id = input.getAttribute('id');
        expect(id).toBeTruthy();

        // Verify there is a corresponding label with matching htmlFor
        const labelEl = document.querySelector(`label[for="${id}"]`);
        expect(labelEl).not.toBeNull();
      }
    });

    it('ApiKeyModal input has associated programmatic label', () => {
      render(<ApiKeyModal isOpen={true} onClose={vi.fn()} />);

      const keyInput = screen.getByLabelText('Google Gemini API Key');
      expect(keyInput).toBeInTheDocument();
      expect(keyInput.getAttribute('id')).toBe('gemini-api-key');

      const modelSelect = screen.getByLabelText('Select Gemini Model');
      expect(modelSelect).toBeInTheDocument();
      expect(modelSelect.getAttribute('id')).toBe('gemini-model-select');
    });

    it('EmergencyPlanTab: every single checkbox is programmatically wrapped by a label', () => {
      const { container } = render(
        <EmergencyPlanTab location={testLocation} profile={testProfile} />
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(16);

      checkboxes.forEach(cb => {
        const parentLabel = cb.closest('label');
        expect(parentLabel).not.toBeNull();
        expect(parentLabel?.textContent?.trim().length).toBeGreaterThan(5);
      });
    });

    it('IaqLabTab: room area slider has programmatic label matching htmlFor', () => {
      render(<IaqLabTab />);

      const slider = screen.getByLabelText(/Target Room Floor Area/i);
      expect(slider).toBeInTheDocument();
      expect(slider.getAttribute('id')).toBe('room-area-slider');

      const label = document.querySelector('label[for="room-area-slider"]');
      expect(label).not.toBeNull();
    });

    it('ImpactTab: transit and purifier sliders have programmatic labels matching htmlFor', () => {
      render(
        <ImpactTab
          location={testLocation}
          profile={testProfile}
          routines={generateSmartRoutines(testLocation, testProfile)}
        />
      );

      const transitSlider = screen.getByLabelText(/Clean Transit \/ Carpool Distance Swapped/i);
      expect(transitSlider).toHaveAttribute('id', 'slider-transit');
      expect(document.querySelector('label[for="slider-transit"]')).not.toBeNull();

      const purifierSlider = screen.getByLabelText(/Air Purifier \/ CR Box Operating Hours/i);
      expect(purifierSlider).toHaveAttribute('id', 'slider-purifier');
      expect(document.querySelector('label[for="slider-purifier"]')).not.toBeNull();
    });

    it('CommunityTab incident report modal has labeled form controls', () => {
      render(<CommunityTab location={testLocation} profile={testProfile} />);

      const openBtn = screen.getByRole('button', { name: /Report Local Smoke or Incident/i });
      fireEvent.click(openBtn);

      expect(screen.getByLabelText('Incident Type')).toHaveAttribute('id', 'report-incident-type');
      expect(screen.getByLabelText('Short Title')).toHaveAttribute('id', 'report-title');
      expect(screen.getByLabelText('Neighborhood / Sector')).toHaveAttribute('id', 'report-neighborhood');
      expect(screen.getByLabelText('Details & Location')).toHaveAttribute('id', 'report-description');
    });
  });

  describe('2. Accessible Names on Buttons and Interactive Controls', () => {
    it('Navbar: all buttons, links, and selects have accessible names or titles', () => {
      const { container } = render(
        <Navbar
          currentLocation={testLocation}
          onSelectLocation={vi.fn()}
          userProfile={testProfile}
          onOpenProfile={vi.fn()}
          onOpenApiKey={vi.fn()}
          activeTab="chat"
          setActiveTab={vi.fn()}
        />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(btn => {
        const hasAriaLabel = btn.getAttribute('aria-label');
        const hasTitle = btn.getAttribute('title');
        const hasText = btn.textContent?.trim();
        expect(Boolean(hasAriaLabel || hasTitle || hasText)).toBe(true);
      });

      const select = screen.getByLabelText('Select location');
      expect(select).toBeInTheDocument();
    });

    it('IaqLabTab: accordion triggers specify aria-expanded and have accessible text', () => {
      const { container } = render(<IaqLabTab />);

      const accordionButtons = container.querySelectorAll('button[aria-expanded]');
      expect(accordionButtons.length).toBeGreaterThan(0);

      accordionButtons.forEach(btn => {
        expect(['true', 'false']).toContain(btn.getAttribute('aria-expanded'));
        expect(btn.getAttribute('aria-controls')).toBeTruthy();
        expect(btn.textContent?.trim().length).toBeGreaterThan(3);
      });
    });

    it('ImpactTab: mask option buttons include aria-pressed and accessible descriptions', () => {
      render(
        <ImpactTab
          location={testLocation}
          profile={testProfile}
          routines={generateSmartRoutines(testLocation, testProfile)}
        />
      );

      const maskButtons = [
        screen.getByRole('button', { name: /None mask/i }),
        screen.getByRole('button', { name: /Cloth mask/i }),
        screen.getByRole('button', { name: /Surgical mask/i }),
        screen.getByRole('button', { name: /N95\/FFP2 mask/i }),
      ];

      for (const btn of maskButtons) {
        expect(btn).toHaveAttribute('aria-pressed');
        expect(btn).toHaveAttribute('aria-label');
      }
    });

    it('ProfileModal persona cards use accessible role="radio" with aria-checked inside radiogroup', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={testProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-label', 'Primary AI Assistant Persona');

      const radioOptions = within(radiogroup).getAllByRole('radio');
      expect(radioOptions.length).toBe(4);

      radioOptions.forEach(opt => {
        expect(opt).toHaveAttribute('aria-checked');
        expect(opt.textContent?.trim().length).toBeGreaterThan(5);
      });
    });
  });

  describe('3. Modal ARIA Semantics and Keyboard Focus Management', () => {
    it('ProfileModal has role="dialog", aria-modal="true", and aria-labelledby', () => {
      render(
        <ProfileModal
          isOpen={true}
          onClose={vi.fn()}
          profile={testProfile}
          onSaveProfile={vi.fn()}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toBeInTheDocument();
    });

    it('ApiKeyModal has role="dialog", aria-modal="true", and aria-labelledby', () => {
      render(<ApiKeyModal isOpen={true} onClose={vi.fn()} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toBeInTheDocument();
    });

    it('CommunityTab incident report modal has role="dialog", aria-modal="true", and aria-labelledby', () => {
      render(<CommunityTab location={testLocation} profile={testProfile} />);

      const openBtn = screen.getByRole('button', { name: /Report Local Smoke or Incident/i });
      fireEvent.click(openBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      const titleId = dialog.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toBeInTheDocument();
    });

    it('All modals dismiss on Escape key press without submitting forms', () => {
      const closeProfile = vi.fn();
      const saveProfile = vi.fn();
      render(
        <ProfileModal
          isOpen={true}
          onClose={closeProfile}
          profile={testProfile}
          onSaveProfile={saveProfile}
        />
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(closeProfile).toHaveBeenCalledTimes(1);
      expect(saveProfile).not.toHaveBeenCalled();

      const closeApiKey = vi.fn();
      render(<ApiKeyModal isOpen={true} onClose={closeApiKey} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(closeApiKey).toHaveBeenCalledTimes(1);
    });

    it('Footer renders with accessible semantic structure and valid disclaimer', () => {
      render(<Footer />);
      expect(screen.getByText('AeroShield AI')).toBeInTheDocument();
      expect(screen.getByText(/Health & Medical Disclaimer:/i)).toBeInTheDocument();
    });
  });

  describe('4. Color Contrast Integrity (A11Y-01 and A11Y-07)', () => {
    it('verifies zero instances of low-contrast text-slate-500 or text-slate-600 across all component source files', () => {
      const componentSources = [
        { name: 'Navbar', src: navbarSrc },
        { name: 'InversionBanner', src: inversionBannerSrc },
        { name: 'EmergencyPlanTab', src: emergencyPlanSrc },
        { name: 'ProfileModal', src: profileModalSrc },
        { name: 'ApiKeyModal', src: apiKeyModalSrc },
        { name: 'IaqLabTab', src: iaqLabSrc },
        { name: 'RoutinesTab', src: routinesSrc },
        { name: 'ImpactTab', src: impactSrc },
        { name: 'CommunityTab', src: communitySrc },
        { name: 'Footer', src: footerSrc },
        { name: 'ChatTab', src: chatTabSrc },
      ];

      const offendingOccurrences: { file: string; match: string }[] = [];

      for (const comp of componentSources) {
        const lines = comp.src.split('\n');
        lines.forEach(line => {
          if (line.includes('text-slate-500') || line.includes('text-slate-600')) {
            offendingOccurrences.push({
              file: comp.name,
              match: line.trim(),
            });
          }
        });
      }

      // Must be 0 offending occurrences according to WCAG AA color contrast remediation (A11Y-07)
      expect(offendingOccurrences).toHaveLength(0);
    });

    it('verifies high-contrast dark text on bright AQI badges (A11Y-01)', () => {
      // Unhealthy for Sensitive Groups (orange badge):
      // Must use text-slate-950 on bg-orange-400 (>7:1 contrast)
      const sensitiveAqi = getAqiCategory(120);
      expect(sensitiveAqi.badgeClass).toContain('text-slate-950');
      expect(sensitiveAqi.badgeClass).not.toContain('text-white');

      // Moderate (amber badge):
      const moderateAqi = getAqiCategory(75);
      expect(moderateAqi.badgeClass).toContain('text-slate-950');

      // Good (emerald badge):
      const goodAqi = getAqiCategory(35);
      expect(goodAqi.badgeClass).toContain('text-slate-950');
    });

    it('verifies high-contrast light text on dark AQI badges', () => {
      const unhealthyAqi = getAqiCategory(180);
      expect(unhealthyAqi.badgeClass).toContain('text-white');

      const veryUnhealthyAqi = getAqiCategory(250);
      expect(veryUnhealthyAqi.badgeClass).toContain('text-white');

      const hazardousAqi = getAqiCategory(350);
      expect(hazardousAqi.badgeClass).toContain('text-white');

      const severeAqi = getAqiCategory(450);
      expect(severeAqi.badgeClass).toContain('text-fuchsia-100');
    });
  });

  describe('5. prefers-reduced-motion Compliance (A11Y-12)', () => {
    it('suppresses canvas confetti animations when prefers-reduced-motion is active', async () => {
      const confettiMock = vi.fn();
      const confettiModule = await import('canvas-confetti');
      confettiModule.default = confettiMock as unknown as typeof confettiModule.default;

      // Mock media query to report reduced motion active
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const routines = generateSmartRoutines(testLocation, testProfile);
      render(
        <RoutinesTab
          location={testLocation}
          profile={testProfile}
          routines={routines}
          onToggleRoutine={vi.fn()}
          onRegenerateRoutines={vi.fn()}
        />
      );

      const toggleBtn = screen.getAllByTitle(/Mark completed/i)[0];
      fireEvent.click(toggleBtn);

      expect(confettiMock).not.toHaveBeenCalled();
    });

    it('invokes canvas confetti animations when prefers-reduced-motion is false', async () => {
      const confettiMock = vi.fn();
      const confettiModule = await import('canvas-confetti');
      confettiModule.default = confettiMock as unknown as typeof confettiModule.default;

      // Mock media query to report reduced motion is FALSE
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const routines = generateSmartRoutines(testLocation, testProfile);
      render(
        <RoutinesTab
          location={testLocation}
          profile={testProfile}
          routines={routines}
          onToggleRoutine={vi.fn()}
          onRegenerateRoutines={vi.fn()}
        />
      );

      const toggleBtn = screen.getAllByTitle(/Mark completed/i)[0];
      fireEvent.click(toggleBtn);

      expect(confettiMock).toHaveBeenCalledTimes(1);
      expect(confettiMock).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 50,
          spread: 60,
        })
      );
    });
  });

  describe('6. Screen Reader Progress Semantics (A11Y-11)', () => {
    it('verifies comparison meters have valid role="progressbar" and numeric ranges', () => {
      render(
        <ImpactTab
          location={testLocation}
          profile={testProfile}
          routines={generateSmartRoutines(testLocation, testProfile)}
        />
      );

      const progressbars = screen.getAllByRole('progressbar');
      expect(progressbars.length).toBe(2);

      const [baselineBar, protectedBar] = progressbars;

      expect(Number(baselineBar.getAttribute('aria-valuenow'))).toBe(100);
      expect(Number(baselineBar.getAttribute('aria-valuemin'))).toBe(0);
      expect(Number(baselineBar.getAttribute('aria-valuemax'))).toBe(100);
      expect(baselineBar.getAttribute('aria-label')).toContain('Unprotected Exposure');

      const protectedVal = Number(protectedBar.getAttribute('aria-valuenow'));
      expect(protectedVal).toBeGreaterThan(0);
      expect(protectedVal).toBeLessThan(100);
      expect(protectedBar.getAttribute('aria-label')).toContain('Protected Particulate Load');
    });
  });
});

import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { InversionBanner } from '../components/InversionBanner';
import { EmergencyPlanTab } from '../components/EmergencyPlanTab';
import { ProfileModal } from '../components/ProfileModal';
import { ApiKeyModal } from '../components/ApiKeyModal';
import { IaqLabTab } from '../components/IaqLabTab';
import { RoutinesTab } from '../components/RoutinesTab';
import { ImpactTab } from '../components/ImpactTab';
import { CommunityTab } from '../components/CommunityTab';
import { LOCATIONS } from '../data/locations';
import { generateSmartRoutines } from '../services/geminiService';
import type { LocationData, UserProfile, DailyRoutineItem } from '../types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const mockLocation: LocationData = {
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
  inversionCeiling: 120,
  primaryPollutant: 'PM2.5',
  smogSeasonName: 'Post-Harvest Inversion Smog',
  hourlyForecast: [
    { hour: '06:00', aqi: 445, inversionFactor: 0.95, safeWindow: false },
    { hour: '08:00', aqi: 460, inversionFactor: 0.98, safeWindow: false },
    { hour: '12:00', aqi: 310, inversionFactor: 0.55, safeWindow: true },
    { hour: '14:00', aqi: 280, inversionFactor: 0.40, safeWindow: true },
    { hour: '20:00', aqi: 450, inversionFactor: 0.96, safeWindow: false },
  ],
  notes: 'Severe ground-level thermal inversion combines with calm surface winds.',
};

const mockProfile: UserProfile = {
  cityId: 'delhi',
  activePersona: 'family-guard',
  householdMembers: {
    total: 4,
    hasInfant: true,
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

describe('Navbar Component', () => {
  const onSelectLocation = vi.fn();
  const onOpenProfile = vi.fn();
  const onOpenApiKey = vi.fn();
  const setActiveTab = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders brand title, active AQI badge, and live AQI value', () => {
    render(
      <Navbar
        currentLocation={mockLocation}
        onSelectLocation={onSelectLocation}
        userProfile={mockProfile}
        onOpenProfile={onOpenProfile}
        onOpenApiKey={onOpenApiKey}
        activeTab="chat"
        setActiveTab={setActiveTab}
      />
    );

    expect(screen.getByText(/AeroShield/i)).toBeInTheDocument();
    expect(screen.getByText('412')).toBeInTheDocument();
    expect(screen.getByText('Severe / Emergency')).toBeInTheDocument();
  });

  it('switches cities via the location select dropdown', () => {
    render(
      <Navbar
        currentLocation={mockLocation}
        onSelectLocation={onSelectLocation}
        userProfile={mockProfile}
        onOpenProfile={onOpenProfile}
        onOpenApiKey={onOpenApiKey}
        activeTab="chat"
        setActiveTab={setActiveTab}
      />
    );

    const select = screen.getByLabelText('Select location');
    fireEvent.change(select, { target: { value: 'milan' } });

    expect(onSelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'milan' })
    );
  });

  it('triggers onOpenProfile and onOpenApiKey when header buttons are clicked', () => {
    render(
      <Navbar
        currentLocation={mockLocation}
        onSelectLocation={onSelectLocation}
        userProfile={mockProfile}
        onOpenProfile={onOpenProfile}
        onOpenApiKey={onOpenApiKey}
        activeTab="chat"
        setActiveTab={setActiveTab}
      />
    );

    const profileBtn = screen.getByTitle('Edit Family & Household Profile');
    fireEvent.click(profileBtn);
    expect(onOpenProfile).toHaveBeenCalledTimes(1);

    const apiKeyBtn = screen.getByTitle(/Configure Gemini API Key/i);
    fireEvent.click(apiKeyBtn);
    expect(onOpenApiKey).toHaveBeenCalledTimes(1);
  });

  it('switches navigation tabs when nav items are clicked', () => {
    render(
      <Navbar
        currentLocation={mockLocation}
        onSelectLocation={onSelectLocation}
        userProfile={mockProfile}
        onOpenProfile={onOpenProfile}
        onOpenApiKey={onOpenApiKey}
        activeTab="chat"
        setActiveTab={setActiveTab}
      />
    );

    const routinesTab = screen.getByText('Daily Routines');
    fireEvent.click(routinesTab);
    expect(setActiveTab).toHaveBeenCalledWith('routines');

    const iaqTab = screen.getByText('IAQ Hacks & DIY');
    fireEvent.click(iaqTab);
    expect(setActiveTab).toHaveBeenCalledWith('iaq-lab');
  });

  it('clicking brand logo redirects to chat tab', () => {
    render(
      <Navbar
        currentLocation={mockLocation}
        onSelectLocation={onSelectLocation}
        userProfile={mockProfile}
        onOpenProfile={onOpenProfile}
        onOpenApiKey={onOpenApiKey}
        activeTab="impact"
        setActiveTab={setActiveTab}
      />
    );

    const brand = screen.getByText(/AeroShield/i);
    fireEvent.click(brand);
    expect(setActiveTab).toHaveBeenCalledWith('chat');
  });
});

describe('InversionBanner Component', () => {
  it('displays active inversion risk, boundary ceiling, and safe window advisory', () => {
    render(<InversionBanner location={mockLocation} />);

    expect(screen.getByText(/Atmospheric Inversion Active/i)).toBeInTheDocument();
    expect(screen.getByText('120 meters')).toBeInTheDocument();
    expect(screen.getByText('12:30 PM – 2:30 PM')).toBeInTheDocument();
  });

  it('expands and collapses the educational physics & hourly curve section', () => {
    render(<InversionBanner location={mockLocation} />);

    const toggleButton = screen.getByRole('button', { name: /Inversion Physics & Hourly Curve/i });
    expect(screen.queryByText(/How Winter Inversions Work/i)).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/How Winter Inversions Work/i)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Smog Trapping & Safe Window Forecast/i)).toBeInTheDocument();

    // Check hourly forecast slots are rendered
    expect(screen.getByText('06:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();

    // Collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/How Winter Inversions Work/i)).not.toBeInTheDocument();
  });
});

describe('EmergencyPlanTab Component', () => {
  it('renders all 16 checklist items inside valid <label> tags and toggles them', () => {
    render(<EmergencyPlanTab location={mockLocation} profile={mockProfile} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(16);

    for (const checkbox of checkboxes) {
      // Must be wrapped by a label element
      const label = checkbox.closest('label');
      expect(label).not.toBeNull();
      expect(label?.tagName.toLowerCase()).toBe('label');

      // Verify toggle behavior
      const initialState = (checkbox as HTMLInputElement).checked;
      fireEvent.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(!initialState);
      fireEvent.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(initialState);
    }
  });

  it('shows vulnerability warning when profile includes infants, elderly, or asthmatics', () => {
    render(<EmergencyPlanTab location={mockLocation} profile={mockProfile} />);
    expect(screen.getByText(/This household includes vulnerable individuals/i)).toBeInTheDocument();
  });

  it('triggers window.print when print button is clicked', () => {
    const printSpy = vi.fn();
    window.print = printSpy;

    render(<EmergencyPlanTab location={mockLocation} profile={mockProfile} />);
    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF Plan/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
  });

  it('copies emergency protocol summary to clipboard when copy button is clicked', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(<EmergencyPlanTab location={mockLocation} profile={mockProfile} />);
    const copyBtn = screen.getByRole('button', { name: /Copy Protocol Summary/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledTimes(1);
    const summary = writeTextSpy.mock.calls[0][0];
    expect(summary).toContain('# Severe Winter Smog Family Emergency Plan');
    expect(summary).toContain(mockLocation.name);
    expect(summary).toContain(String(mockLocation.aqi));
    expect(summary).toContain('Medical & Pharmacological');
    expect(summary).toContain('Bedroom Safe Room');
    expect(summary).toContain('Transit & School Commute');
    expect(summary).toContain('Cooking & Combustion');

    // Visual & accessible status update
    expect(screen.getByRole('button', { name: /Copied Protocol!/i })).toBeInTheDocument();
  });
});

describe('ProfileModal Component', () => {
  const onClose = vi.fn();
  const onSaveProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog with aria-modal="true" and accessible title', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'profile-modal-title');
    expect(screen.getByText('Household & Lifestyle Profile')).toBeInTheDocument();
  });

  it('supports persona selection via button[role="radio"] with aria-checked', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons.length).toBe(4);

    // Initial persona is family-guard
    const familyGuardRadio = radioButtons[0];
    expect(familyGuardRadio).toHaveAttribute('aria-checked', 'true');

    // Select Pediatric & Vulnerable Care
    const pediatricRadio = radioButtons[1];
    fireEvent.click(pediatricRadio);
    expect(pediatricRadio).toHaveAttribute('aria-checked', 'true');
    expect(familyGuardRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('has programmatic htmlFor and id connections for all form inputs', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    const peopleInput = screen.getByLabelText('Total people:');
    expect(peopleInput).toHaveAttribute('id', 'profile-total-people');

    const dwellingSelect = screen.getByLabelText('Housing Structure');
    expect(dwellingSelect).toHaveAttribute('id', 'profile-dwelling-type');

    const purifierSelect = screen.getByLabelText('Air Purification');
    expect(purifierSelect).toHaveAttribute('id', 'profile-air-filtration');

    const heatingSelect = screen.getByLabelText('Heating Source');
    expect(heatingSelect).toHaveAttribute('id', 'profile-heating-type');

    const cookingSelect = screen.getByLabelText('Cooking Source');
    expect(cookingSelect).toHaveAttribute('id', 'profile-cooking-type');

    const transitSelect = screen.getByLabelText('Primary Transit Mode');
    expect(transitSelect).toHaveAttribute('id', 'profile-commute-mode');

    const distanceInput = screen.getByLabelText('Daily Transit Distance (km)');
    expect(distanceInput).toHaveAttribute('id', 'profile-commute-distance');
  });

  it('dismisses modal on Escape key press', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus using Tab and Shift+Tab within modal elements', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    expect(focusable.length).toBeGreaterThan(1);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Simulate Shift+Tab on first element
    first.focus();
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    // Simulate Tab on last element
    last.focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
  });

  it('submits updated profile and calls onSaveProfile', () => {
    render(
      <ProfileModal
        isOpen={true}
        onClose={onClose}
        profile={mockProfile}
        onSaveProfile={onSaveProfile}
      />
    );

    const distanceInput = screen.getByLabelText('Daily Transit Distance (km)');
    fireEvent.change(distanceInput, { target: { value: '35' } });

    const saveButton = screen.getByRole('button', { name: /Save Profile & Update AI/i });
    fireEvent.click(saveButton);

    expect(onSaveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        commute: expect.objectContaining({ dailyDistanceKm: 35 }),
      })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ApiKeyModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders masked password input with accessible label', () => {
    render(<ApiKeyModal isOpen={true} onClose={onClose} />);

    const passwordInput = screen.getByLabelText('Google Gemini API Key');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('id', 'gemini-api-key');
  });

  it('dismisses modal on Escape key press', () => {
    render(<ApiKeyModal isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays aria-live status alert when API test fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: 'Invalid API Key supplied' } }),
    });

    render(<ApiKeyModal isOpen={true} onClose={onClose} />);

    const passwordInput = screen.getByLabelText('Google Gemini API Key');
    fireEvent.change(passwordInput, { target: { value: 'invalid-key' } });

    const saveBtn = screen.getByRole('button', { name: /Save & Verify/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveTextContent('Invalid API Key supplied');
    });
  });

  it('displays aria-live status polite when API verification succeeds', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'OK' }] } }] }),
    });

    render(<ApiKeyModal isOpen={true} onClose={onClose} />);

    const passwordInput = screen.getByLabelText('Google Gemini API Key');
    fireEvent.change(passwordInput, { target: { value: 'valid-test-key' } });

    const saveBtn = screen.getByRole('button', { name: /Save & Verify/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent('Connection verified! Live Gemini AI is active.');
    });
  });
});

describe('IaqLabTab Component', () => {
  it('updates DIY Corsi-Rosenthal calculator CADR and ACH on user changes', () => {
    render(<IaqLabTab />);

    // Initial 20" Box Fan with 4 filters & medium speed
    expect(screen.getByText(/CADR Airflow/i)).toBeInTheDocument();
    expect(screen.getByText(/Air Changes \(ACH\)/i)).toBeInTheDocument();

    // Click 12" Box Fan
    const fan12Btn = screen.getByRole('button', { name: '12" Box Fan' });
    fireEvent.click(fan12Btn);
    expect(fan12Btn).toHaveClass('bg-emerald-500');

    // Click High speed
    const highBtn = screen.getByRole('button', { name: 'high' });
    fireEvent.click(highBtn);
    expect(highBtn).toHaveClass('bg-emerald-500');

    // Click MERV 14
    const merv14Btn = screen.getByRole('button', { name: 'MERV 14' });
    fireEvent.click(merv14Btn);
    expect(merv14Btn).toHaveClass('bg-emerald-500');
  });

  it('binds target room area slider to a valid programmatic label', () => {
    render(<IaqLabTab />);

    const slider = screen.getByLabelText(/Target Room Floor Area/i);
    expect(slider).toHaveAttribute('id', 'room-area-slider');
    expect(slider).toHaveAttribute('type', 'range');

    fireEvent.change(slider, { target: { value: '500' } });
    expect(screen.getByText(/500 sq ft/i)).toBeInTheDocument();
  });

  it('manages accordion button triggers with aria-expanded and aria-controls', () => {
    render(<IaqLabTab />);

    // Check CR Box accordion header
    const crHeader = screen.getByRole('button', { name: /The Corsi-Rosenthal Box Purifier/i });
    expect(crHeader).toHaveAttribute('aria-expanded', 'true');
    expect(crHeader).toHaveAttribute('aria-controls', 'hack-panel-cr-box-fan');

    // Collapse it
    fireEvent.click(crHeader);
    expect(crHeader).toHaveAttribute('aria-expanded', 'false');

    // Expand another hack (Solar Noon Flush)
    const flushHeader = screen.getByRole('button', { name: /Solar Noon "Micro-Flushing" Protocol/i });
    fireEvent.click(flushHeader);
    expect(flushHeader).toHaveAttribute('aria-expanded', 'true');
    expect(flushHeader).toHaveAttribute('aria-controls', 'hack-panel-solar-noon-flush');
  });

  it('filters hacks when category filter pills are clicked', () => {
    render(<IaqLabTab />);

    // Click Safe Ventilation filter
    const ventBtn = screen.getByRole('button', { name: 'Safe Ventilation' });
    fireEvent.click(ventBtn);

    expect(screen.getByText(/Solar Noon "Micro-Flushing" Protocol/i)).toBeInTheDocument();
    expect(screen.queryByText(/The Corsi-Rosenthal Box Purifier/i)).not.toBeInTheDocument();
  });

  it('triggers onAskAiAboutHack callback when customize button is clicked', () => {
    const onAskAi = vi.fn();
    render(<IaqLabTab onAskAiAboutHack={onAskAi} />);

    const customizeBtn = screen.getByRole('button', {
      name: /Customize this hack for my room with GenAI/i,
    });
    fireEvent.click(customizeBtn);

    expect(onAskAi).toHaveBeenCalledWith(
      expect.stringContaining('Corsi-Rosenthal')
    );
  });
});

describe('RoutinesTab Component', () => {
  const routines: DailyRoutineItem[] = generateSmartRoutines(mockLocation, mockProfile);
  const onToggleRoutine = vi.fn();
  const onRegenerateRoutines = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles routine completion and calls onToggleRoutine', () => {
    render(
      <RoutinesTab
        location={mockLocation}
        profile={mockProfile}
        routines={routines}
        onToggleRoutine={onToggleRoutine}
        onRegenerateRoutines={onRegenerateRoutines}
      />
    );

    const toggleButtons = screen.getAllByTitle(/Mark completed/i);
    expect(toggleButtons.length).toBeGreaterThan(0);

    fireEvent.click(toggleButtons[0]);
    expect(onToggleRoutine).toHaveBeenCalledWith(routines[0].id);
  });

  it('filters routines by category when category filter buttons are clicked', () => {
    render(
      <RoutinesTab
        location={mockLocation}
        profile={mockProfile}
        routines={routines}
        onToggleRoutine={onToggleRoutine}
        onRegenerateRoutines={onRegenerateRoutines}
      />
    );

    const commuteFilterBtn = screen.getByRole('button', { name: 'Commute & Travel' });
    fireEvent.click(commuteFilterBtn);

    expect(screen.getByText(/Protected School \/ Work Morning Commute/i)).toBeInTheDocument();
    expect(screen.queryByText(/Solar Noon Micro-Flushing Window/i)).not.toBeInTheDocument();
  });

  it('respects prefers-reduced-motion and suppresses confetti animations', async () => {
    const confettiMock = vi.fn();
    const confettiModule = await import('canvas-confetti');
    confettiModule.default = confettiMock as unknown as typeof confettiModule.default;

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

    render(
      <RoutinesTab
        location={mockLocation}
        profile={mockProfile}
        routines={routines}
        onToggleRoutine={onToggleRoutine}
        onRegenerateRoutines={onRegenerateRoutines}
      />
    );

    const toggleButtons = screen.getAllByTitle(/Mark completed/i);
    fireEvent.click(toggleButtons[0]);

    // Since prefers-reduced-motion is TRUE, confetti should NOT be invoked
    expect(confettiMock).not.toHaveBeenCalled();
  });
});

describe('ImpactTab Component', () => {
  const routines: DailyRoutineItem[] = generateSmartRoutines(mockLocation, mockProfile);

  it('renders progress bar elements with accessible ARIA semantics', () => {
    render(<ImpactTab location={mockLocation} profile={mockProfile} routines={routines} />);

    const progressbars = screen.getAllByRole('progressbar');
    expect(progressbars.length).toBe(2);

    for (const bar of progressbars) {
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
      expect(bar).toHaveAttribute('aria-valuenow');
      expect(bar).toHaveAttribute('aria-label');
    }
  });

  it('updates inhalation telemetry when transit, purifier, or mask settings change', () => {
    render(<ImpactTab location={mockLocation} profile={mockProfile} routines={routines} />);

    // Verify initial values
    expect(screen.getByText(/Alveolar PM2.5 Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/Cigarettes Avoided/i)).toBeInTheDocument();

    // Change purifier slider
    const purifierSlider = screen.getByLabelText(/Air Purifier \/ CR Box Operating Hours/i);
    fireEvent.change(purifierSlider, { target: { value: '24' } });
    expect(screen.getByText('24 hours / day')).toBeInTheDocument();

    // Select N95 mask
    const n95Btn = screen.getByRole('button', { name: /N95\/FFP2 mask – 95% efficiency/i });
    expect(n95Btn).toHaveAttribute('aria-pressed', 'true');

    // Select Surgical mask
    const surgBtn = screen.getByRole('button', { name: /Surgical mask – 45% efficiency/i });
    fireEvent.click(surgBtn);
    expect(surgBtn).toHaveAttribute('aria-pressed', 'true');
    expect(n95Btn).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('CommunityTab Component', () => {
  it('filters clean air havens by the active city location', () => {
    render(<CommunityTab location={mockLocation} profile={mockProfile} />);

    // Delhi location should display Delhi havens
    expect(screen.getByText('Delhi Central Civic & Cultural Library')).toBeInTheDocument();
    expect(screen.getByText('India Habitat Centre Clean-Air Atrium')).toBeInTheDocument();
    expect(screen.queryByText('Biblioteca Sormani Clean Air Commons')).not.toBeInTheDocument();
  });

  it('opens incident report modal and manages focus trap and Escape dismissal', () => {
    render(<CommunityTab location={mockLocation} profile={mockProfile} />);

    const reportBtn = screen.getByRole('button', { name: /Report Local Smoke or Incident/i });
    fireEvent.click(reportBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Inputs inside dialog have accessible labels
    expect(screen.getByLabelText('Incident Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Short Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Neighborhood / Sector')).toBeInTheDocument();

    // Escape closes modal
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('copies diplomatic notice to clipboard on click', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(<CommunityTab location={mockLocation} profile={mockProfile} />);

    const copyBtn = screen.getByRole('button', { name: /Copy to Clipboard/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledWith(
      expect.stringContaining('Respectful Community Health Notice')
    );
  });
});

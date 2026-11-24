import React, { useState } from 'react';
import { LOCATIONS } from './data/locations';
import { LocationData, UserProfile, DailyRoutineItem } from './types';
import { generateSmartRoutines } from './services/geminiService';
import { safeGetItem, safeSetItem, safeGetJson, safeSetJson } from './services/storageService';
import { Navbar } from './components/Navbar';
import { InversionBanner } from './components/InversionBanner';
import { ProfileModal } from './components/ProfileModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ChatTab } from './components/ChatTab';
import { RoutinesTab } from './components/RoutinesTab';
import { IaqLabTab } from './components/IaqLabTab';
import { ImpactTab } from './components/ImpactTab';
import { CommunityTab } from './components/CommunityTab';
import { EmergencyPlanTab } from './components/EmergencyPlanTab';
import { Footer } from './components/Footer';

const STORAGE_PROFILE_KEY = 'aeroshield_user_profile';
const STORAGE_ROUTINES_KEY = 'aeroshield_user_routines';
const STORAGE_LOCATION_KEY = 'aeroshield_location_id';

const DEFAULT_PROFILE: UserProfile = {
  cityId: 'delhi',
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
    mode: 'two-wheeler',
    dailyDistanceKm: 14,
  },
  activePersona: 'family-guard',
};

export function App() {
  // Load saved location safely
  const [currentLocation, setCurrentLocation] = useState<LocationData>(() => {
    const savedLocId = safeGetItem(STORAGE_LOCATION_KEY);
    const found = LOCATIONS.find(l => l.id === savedLocId);
    return found || LOCATIONS[0];
  });

  // Load saved profile with deep merge to prevent schema drift crashes
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = safeGetJson<Partial<UserProfile> | null>(STORAGE_PROFILE_KEY, null);
    if (!saved) return DEFAULT_PROFILE;
    return {
      ...DEFAULT_PROFILE,
      ...saved,
      householdMembers: {
        ...DEFAULT_PROFILE.householdMembers,
        ...(saved.householdMembers || {})
      },
      dwelling: {
        ...DEFAULT_PROFILE.dwelling,
        ...(saved.dwelling || {})
      },
      commute: {
        ...DEFAULT_PROFILE.commute,
        ...(saved.commute || {})
      }
    };
  });

  // Load or generate routines safely
  const [routines, setRoutines] = useState<DailyRoutineItem[]>(() => {
    const saved = safeGetJson<DailyRoutineItem[] | null>(STORAGE_ROUTINES_KEY, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return generateSmartRoutines(currentLocation, profile);
  });

  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState<boolean>(false);
  const [pendingChatInquiry, setPendingChatInquiry] = useState<string>('');

  // Sync profile changes to storage
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    safeSetJson(STORAGE_PROFILE_KEY, newProfile);
    // Regenerate routines to fit new profile
    const updated = generateSmartRoutines(currentLocation, newProfile);
    setRoutines(updated);
    safeSetJson(STORAGE_ROUTINES_KEY, updated);
  };

  // Sync location switch
  const handleSelectLocation = (newLoc: LocationData) => {
    setCurrentLocation(newLoc);
    safeSetItem(STORAGE_LOCATION_KEY, newLoc.id);
    const updated = generateSmartRoutines(newLoc, profile);
    setRoutines(updated);
    safeSetJson(STORAGE_ROUTINES_KEY, updated);
  };

  // Pure state updater for toggling routines, writing to storage outside
  const handleToggleRoutine = (id: string) => {
    const updated = routines.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setRoutines(updated);
    safeSetJson(STORAGE_ROUTINES_KEY, updated);
  };

  // Regenerate routines explicitly
  const handleRegenerateRoutines = () => {
    const updated = generateSmartRoutines(currentLocation, profile);
    setRoutines(updated);
    safeSetJson(STORAGE_ROUTINES_KEY, updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Skip to Main Content Link (A11Y-14) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        userProfile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Atmospheric Inversion Alert & Telemetry Banner */}
        <InversionBanner location={currentLocation} />

        {/* Dynamic Tab Views */}
        {activeTab === 'chat' && (
          <ChatTab
            location={currentLocation}
            profile={profile}
            onUpdateProfile={handleSaveProfile}
            onNavigateToTab={setActiveTab}
            initialInquiry={pendingChatInquiry}
            onClearInquiry={() => setPendingChatInquiry('')}
          />
        )}

        {activeTab === 'routines' && (
          <RoutinesTab
            location={currentLocation}
            profile={profile}
            routines={routines}
            onToggleRoutine={handleToggleRoutine}
            onRegenerateRoutines={handleRegenerateRoutines}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'iaq-lab' && (
          <IaqLabTab
            onAskAiAboutHack={(hackTitle) => {
              setPendingChatInquiry(`How do I build and customize the "${hackTitle}" specifically for my household (${profile.dwelling.type.replace(/-/g, ' ')}, ${profile.householdMembers.total} members) in ${currentLocation.name}?`);
              setActiveTab('chat');
            }}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactTab
            location={currentLocation}
            profile={profile}
            routines={routines}
          />
        )}

        {activeTab === 'community' && (
          <CommunityTab
            location={currentLocation}
            profile={profile}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyPlanTab
            location={currentLocation}
            profile={profile}
          />
        )}

      </main>

      {/* Profile Configuration Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
      />

      {/* Educational & Scientific Footer */}
      <Footer />

    </div>
  );
}

export default App;

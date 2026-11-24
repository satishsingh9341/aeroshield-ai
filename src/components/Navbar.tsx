import React from 'react';
import { 
  Wind, 
  MapPin, 
  Users, 
  Key, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  Wrench, 
  BarChart3, 
  Building2, 
  FileText 
} from 'lucide-react';
import { LocationData, UserProfile } from '../types';
import { LOCATIONS, getAqiCategory } from '../data/locations';
import { getStoredApiKey } from '../services/geminiService';

interface NavbarProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenApiKey: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onSelectLocation,
  userProfile,
  onOpenProfile,
  onOpenApiKey,
  activeTab,
  setActiveTab
}) => {
  const aqiInfo = getAqiCategory(currentLocation.aqi);
  const hasApiKey = Boolean(getStoredApiKey());

  const navTabs = [
    { id: 'chat', label: 'AeroGuide AI', icon: Sparkles },
    { id: 'routines', label: 'Daily Routines', icon: Calendar },
    { id: 'iaq-lab', label: 'IAQ Hacks & DIY', icon: Wrench },
    { id: 'impact', label: 'Impact Tracker', icon: BarChart3 },
    { id: 'community', label: 'Community Pods', icon: Building2 },
    { id: 'emergency', label: 'Emergency Card', icon: FileText },
  ];

  const personaLabels: Record<string, string> = {
    'family-guard': 'Family Guard',
    'pediatric-safety': 'Pediatric Care',
    'eco-commuter': 'Eco-Commuter',
    'community-leader': 'Community Leader',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AeroShield <span className="text-emerald-400 font-black">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GenAI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Winter Smog & Urban Clean Air Navigator
              </p>
            </div>
          </div>

          {/* Location Selector & Real-Time AQI Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location Dropdown */}
            <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 hover:border-slate-600 transition">
              <MapPin className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
              <select
                aria-label="Select location"
                value={currentLocation.id}
                onChange={(e) => {
                  const loc = LOCATIONS.find(l => l.id === e.target.value);
                  if (loc) onSelectLocation(loc);
                }}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer pr-1"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.flag} {loc.name} ({loc.country})
                  </option>
                ))}
              </select>
            </div>

            {/* AQI Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${aqiInfo.bgClass} shadow-sm`}>
              <div className="flex flex-col text-right sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 leading-none">
                  Live AQI
                </span>
                <span className="text-base sm:text-lg font-black leading-tight">
                  {currentLocation.aqi}
                </span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-md hidden md:inline-block ${aqiInfo.badgeClass}`}>
                {aqiInfo.label}
              </span>
            </div>

            {/* Inversion Indicator */}
            <div 
              title={`Inversion Risk: ${currentLocation.inversionRisk} (Cap at ${currentLocation.inversionCeiling}m)`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium cursor-help"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Inversion:</span>
              <span className={`font-semibold ${
                currentLocation.inversionRisk === 'Critical' ? 'text-fuchsia-400' :
                currentLocation.inversionRisk === 'Severe' ? 'text-rose-400' :
                currentLocation.inversionRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentLocation.inversionRisk} ({currentLocation.inversionCeiling}m)
              </span>
            </div>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition shadow-sm"
              title="Edit Family & Household Profile"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Profile</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full border border-slate-700">
                {personaLabels[userProfile.activePersona] || 'Family'}
              </span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKey}
              className={`p-2 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
                hasApiKey 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/60' 
                  : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={hasApiKey ? 'Gemini API Connected (Custom Key)' : 'Configure Gemini API Key (or use built-in intelligence)'}
            >
              <Key className="w-3.5 h-3.5" />
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

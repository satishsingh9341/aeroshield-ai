import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  Home, 
  Car, 
  Flame, 
  ShieldCheck, 
  HeartHandshake, 
  Baby, 
  Sparkles,
  Bike
} from 'lucide-react';
import { PersonaType, UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [form, setForm] = React.useState<UserProfile>(profile);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens or profile changes (CQ-08)
  useEffect(() => {
    if (isOpen) {
      setForm(profile);
    }
  }, [isOpen, profile]);

  // Focus trap and Escape key listener (A11Y-04 / A11Y-05)
  useEffect(() => {
    if (!isOpen) return;

    const previousFocusedElement = document.activeElement as HTMLElement | null;
    const modalElement = modalRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalElement) {
        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus on first interactive element or container
    const initialTimer = setTimeout(() => {
      const focusable = modalElement?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea'
      );
      focusable?.focus();
    }, 50);

    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const personas: { id: PersonaType; title: string; desc: string; icon: any }[] = [
    {
      id: 'family-guard',
      title: 'Family Health Guard',
      desc: 'Balanced everyday safety, sleep hygiene, and routine protection for all ages.',
      icon: ShieldCheck
    },
    {
      id: 'pediatric-safety',
      title: 'Pediatric & Vulnerable Care',
      desc: 'Specialized for toddlers, infants, elderly, and asthmatics susceptible to airway spasms.',
      icon: Baby
    },
    {
      id: 'eco-commuter',
      title: 'Eco-Commuter & Sustainable Citizen',
      desc: 'Maximizes clean transit swaps, carpools, and tracks personal carbon & NOx emissions.',
      icon: Bike
    },
    {
      id: 'community-leader',
      title: 'Community Action Leader',
      desc: 'Focuses on neighborhood clean air pods, sensor sharing, and stopping illegal waste fires.',
      icon: HeartHandshake
    }
  ];

  const handleSave = () => {
    onSaveProfile(form);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="profile-modal-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 id="profile-modal-title" className="text-base font-bold text-white">Household & Lifestyle Profile</h3>
              <p className="text-xs text-slate-400">Tailors AI routines, hacks, and direct impact calculations to your family</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-sm">
          
          {/* Persona Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Primary AI Assistant Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Primary AI Assistant Persona">
              {personas.map(p => {
                const Icon = p.icon;
                const isSelected = form.activePersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setForm({ ...form, activePersona: p.id })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="font-semibold text-xs text-slate-100">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Household Vulnerabilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Household Members & Vulnerabilities
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="profile-total-people" className="text-xs text-slate-400">Total people:</label>
                <input
                  id="profile-total-people"
                  type="number"
                  min="1"
                  max="15"
                  value={form.householdMembers.total}
                  onChange={e => setForm({
                    ...form,
                    householdMembers: { ...form.householdMembers, total: Math.max(1, parseInt(e.target.value) || 1) }
                  })}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-center font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'hasInfant', label: '👶 Infant / Toddler (<5)', desc: 'High breathing rate' },
                { key: 'hasElderly', label: '👵 Elderly (65+)', desc: 'Cardiovascular risk' },
                { key: 'hasRespiratoryCondition', label: '🫁 Asthma / COPD', desc: 'Airway hypersensitivity' },
                { key: 'hasPets', label: '🐕 Pets (Dogs/Cats)', desc: 'Floor particulate exposure' },
                { key: 'hasOutdoorWorkers', label: '👷 Outdoor Workers', desc: 'Prolonged ambient dose' },
              ].map(item => {
                const checked = (form.householdMembers as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition ${
                      checked
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => setForm({
                        ...form,
                        householdMembers: {
                          ...form.householdMembers,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-600"
                    />
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dwelling, Filtration & Heating */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dwelling, Filtration & Heating
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="profile-dwelling-type" className="text-xs text-slate-400 block mb-1">Housing Structure</label>
                <select
                  id="profile-dwelling-type"
                  value={form.dwelling.type}
                  onChange={e => setForm({
                    ...form,
                    dwelling: { ...form.dwelling, type: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="apartment-high">High-rise Apartment (Floor 5+)</option>
                  <option value="apartment-low">Ground / Low-rise Apartment</option>
                  <option value="independent-house">Independent House / Villa</option>
                  <option value="poorly-sealed">Drafty / Older Single-pane Dwelling</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile-air-filtration" className="text-xs text-slate-400 block mb-1">Air Purification</label>
                <select
                  id="profile-air-filtration"
                  value={form.dwelling.airFiltration}
                  onChange={e => setForm({
                    ...form,
                    dwelling: { ...form.dwelling, airFiltration: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">No Purifier (Need DIY / Hacks)</option>
                  <option value="single-hepa">1 Commercial HEPA Purifier</option>
                  <option value="multiple-hepa">Multiple Room HEPA Purifiers</option>
                  <option value="diy-cr-box">DIY Corsi-Rosenthal Box Fan Unit</option>
                  <option value="central-merv">Central HVAC with MERV 13+ Filter</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile-heating-type" className="text-xs text-slate-400 block mb-1">Heating Source</label>
                <select
                  id="profile-heating-type"
                  value={form.dwelling.heatingType}
                  onChange={e => setForm({
                    ...form,
                    dwelling: { ...form.dwelling, heatingType: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="heat-pump">Heat Pump (Cleanest)</option>
                  <option value="electric-radiator">Electric Radiator</option>
                  <option value="gas-heater">Gas Heater</option>
                  <option value="wood-stove">Wood Stove / Fireplace</option>
                  <option value="none">No Central Heating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cooking & Commute */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Cooking & Daily Commute
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="profile-cooking-type" className="text-xs text-slate-400 block mb-1">Cooking Source</label>
                <select
                  id="profile-cooking-type"
                  value={form.dwelling.cookingType}
                  onChange={e => setForm({
                    ...form,
                    dwelling: { ...form.dwelling, cookingType: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none"
                >
                  <option value="electric-induction">Electric Induction / Clean Electric</option>
                  <option value="lpg-gas">LPG Gas Burner</option>
                  <option value="biomass-wood">Biomass / Chulha / Solid Fuel</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile-commute-mode" className="text-xs text-slate-400 block mb-1">Primary Transit Mode</label>
                <select
                  id="profile-commute-mode"
                  value={form.commute.mode}
                  onChange={e => setForm({
                    ...form,
                    commute: { ...form.commute, mode: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none"
                >
                  <option value="solo-car">Solo Petrol/Diesel Car</option>
                  <option value="two-wheeler">Two-Wheeler / Motorcycle / Scooter</option>
                  <option value="carpool">Shared Carpool / Cab</option>
                  <option value="metro-train">Metro / Underground Electric Train</option>
                  <option value="bus">Public Bus</option>
                  <option value="active-walk-bike">Active (Walking / Cycling)</option>
                  <option value="wfh">Work from Home (Zero Commute)</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile-commute-distance" className="text-xs text-slate-400 block mb-1">Daily Transit Distance (km)</label>
                <input
                  id="profile-commute-distance"
                  type="number"
                  min="0"
                  max="120"
                  value={form.commute.dailyDistanceKm}
                  onChange={e => setForm({
                    ...form,
                    commute: { ...form.commute, dailyDistanceKm: Math.max(0, parseInt(e.target.value) || 0) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Sparkles className="w-4 h-4" /> Save Profile & Update AI
          </button>
        </div>

      </div>
    </div>
  );
};

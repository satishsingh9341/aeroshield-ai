import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Heart, 
  Leaf, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Flame, 
  Layers, 
  Sliders, 
  Info, 
  HelpCircle,
  Cigarette
} from 'lucide-react';
import { DailyRoutineItem, LocationData, UserProfile } from '../types';
import { calculateImpact } from '../services/impactCalculator';

interface ImpactTabProps {
  location: LocationData;
  profile: UserProfile;
  routines: DailyRoutineItem[];
}

export const ImpactTab: React.FC<ImpactTabProps> = ({ location, profile, routines }) => {
  // Live What-If Sliders State
  const [transitKm, setTransitKm] = useState<number>(profile.commute.dailyDistanceKm);
  const [purifierHours, setPurifierHours] = useState<number>(14);
  const [maskType, setMaskType] = useState<'none' | 'cloth' | 'surgical' | 'n95'>('n95');
  const [sealed, setSealed] = useState<boolean>(true);

  // ✅ Memoize so calculateImpact only runs when dependencies change, not on every render
  const impact = useMemo(
    () => calculateImpact(profile, location, routines, {
      purifierHours,
      maskGrade: maskType,
      transitSwapKm: transitKm,
      sealedWindows: sealed
    }),
    [profile, location, routines, purifierHours, maskType, transitKm, sealed]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Impact Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2 inline-block">
            Scientific Outcome Telemetry
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Direct Personal & Community Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every choice you make directly alters the micrograms of fine particulate deposited in your family’s deep lung alveoli and stops emissions at the source.
          </p>
        </div>
      </div>

      {/* Top 4 Impact Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lung PM2.5 Intake Saved */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Alveolar PM2.5 Saved</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{impact.lungDoseSavedUg.toLocaleString()}</span>
              <span className="text-xs font-medium text-emerald-400">µg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Prevented from crossing blood-air barrier today
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>🫁 {impact.healthRiskReductionPercent}% lower particulate intake</span>
          </div>
        </div>

        {/* Passive Cigarettes Averted */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Cigarettes Avoided</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Cigarette className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{impact.cigarettesAvoided}</span>
              <span className="text-xs font-medium text-amber-400">cigs/day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Per person passive smoke equivalent averted
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-amber-400 font-semibold">
            Based on Berkeley Earth formula (22 µg/m³ = 1 cig)
          </div>
        </div>

        {/* Carbon Dioxide Averted */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">CO2 Emissions Cut</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{impact.co2SavedKg}</span>
              <span className="text-xs font-medium text-teal-400">kg CO2</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              From transit swaps and energy-efficient habits
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-teal-400 font-semibold">
            Plus {impact.noxSavedGrams}g toxic NOx stopped
          </div>
        </div>

        {/* Economic / Medical ROI */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Est. Daily Savings</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>${impact.monetarySavingsUsd}</span>
              <span className="text-xs font-medium text-purple-400">/ day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fuel, maintenance, & avoided emergency clinic visits
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-purple-400 font-semibold">
            ~${impact.monetarySavingsUsd * 30} estimated monthly ROI
          </div>
        </div>

      </div>

      {/* SECTION 2: Interactive "What-If" Action Simulation Sandbox */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800">
          <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Interactive "What-If" Behavioral Impact Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Adjust your lifestyle levers below to see real-time updates to your lung dosage and emissions reduction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sliders Area */}
          <div className="space-y-5">
            
            {/* Transit Distance Swapped */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="slider-transit" className="text-xs font-bold uppercase text-slate-300">
                  Clean Transit / Carpool Distance Swapped
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {transitKm} km / day
                </span>
              </div>
              <input
                id="slider-transit"
                type="range"
                min="0"
                max="50"
                step="2"
                value={transitKm}
                onChange={e => setTransitKm(Number(e.target.value) || 0)}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Moving 15 km from solo SUV to electric Metro avoids ~2.5 kg CO2 and 6.3g NOx daily.
              </span>
            </div>

            {/* Daily Air Purifier Hours */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="slider-purifier" className="text-xs font-bold uppercase text-slate-300">
                  Air Purifier / CR Box Operating Hours
                </label>
                <span className="text-xs font-mono font-bold text-teal-300">
                  {purifierHours} hours / day
                </span>
              </div>
              <input
                id="slider-purifier"
                type="range"
                min="0"
                max="24"
                step="1"
                value={purifierHours}
                onChange={e => setPurifierHours(Number(e.target.value) || 0)}
                className="w-full accent-teal-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Running during sleep (8h) + evening (6h) protects lung alveoli during the strongest thermal inversion.
              </span>
            </div>

            {/* Mask Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Outdoor Mask Type (Transit & Errands)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none' as const, label: 'None', eff: '0%' },
                  { id: 'cloth' as const, label: 'Cloth', eff: '28%' },
                  { id: 'surgical' as const, label: 'Surgical', eff: '45%' },
                  { id: 'n95' as const, label: 'N95/FFP2', eff: '95%' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaskType(m.id)}
                    aria-pressed={maskType === m.id}
                    aria-label={`${m.label} mask – ${m.eff} efficiency`}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                      maskType === m.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div>{m.label}</div>
                    <div className="text-[10px] opacity-75 font-normal">({m.eff} eff)</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sealing Status Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Window & Door Weather-Sealing</div>
                <div className="text-[11px] text-slate-400">Wet towel draft stoppers & silicone window seals</div>
              </div>
              <button
                onClick={() => setSealed(!sealed)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  sealed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {sealed ? 'Sealed (Tight)' : 'Drafty (Leaking)'}
              </button>
            </div>

          </div>

          {/* Visualization Graph Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Your Lung Inhalation Risk Meter
              </span>
              <p className="text-xs text-slate-300 mb-4">
                Comparison of daily alveolar particulate intake under your current choices vs unprotected baseline:
              </p>

              {/* Visual Bars Comparison */}
              <div className="space-y-4">
                {/* Unprotected Baseline */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-rose-400">Unprotected Exposure (No Mask, No Purifier)</span>
                    <span className="text-rose-400 font-mono">100% Load (~{(location.pm25 * 0.55 * 16 * 0.65).toFixed(0)} µg)</span>
                  </div>
                  <div 
                    className="w-full bg-slate-800 h-3 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Unprotected Exposure Particulate Load (100%)"
                  >
                    <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full w-full" />
                  </div>
                </div>

                {/* With Current Choices */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-400">With Your AeroShield Active Protection</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {100 - impact.healthRiskReductionPercent}% Load (-{impact.healthRiskReductionPercent}%)
                    </span>
                  </div>
                  <div 
                    className="w-full bg-slate-800 h-3 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={Math.round(100 - impact.healthRiskReductionPercent)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Protected Particulate Load (${100 - impact.healthRiskReductionPercent}%)`}
                  >
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(6, 100 - impact.healthRiskReductionPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanatory Scientific Callout */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" /> Physiological Mechanism:
                </span>
                <p>
                  Particles under 2.5 micrometers bypass your nasal cilia and tracheobronchial mucus. They deposit in alveolar sacs where alveolar macrophages struggle to engulf soot particles, causing systemic cardiovascular inflammation.
                </p>
                <p className="text-emerald-300 font-medium">
                  By cutting intake by {impact.healthRiskReductionPercent}%, you drastically reduce elevated C-reactive protein (CRP) and bronchoconstriction episodes.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
              *Calculated with minute ventilation = 0.55 m³/h (resting) to 1.2 m³/h (transit) and alveolar deposition fraction 0.65.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

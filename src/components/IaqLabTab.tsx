import React, { useState } from 'react';
import { 
  Wrench, 
  Wind, 
  Sparkles, 
  Sliders, 
  DollarSign, 
  Volume2, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Flame, 
  ShieldAlert, 
  Home, 
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { INDOOR_HACKS } from '../data/hacks';
import { IndoorHack } from '../types';
import { calculateCrBoxSpecs } from '../services/impactCalculator';

interface IaqLabTabProps {
  onAskAiAboutHack?: (hackTitle: string) => void;
}

export const IaqLabTab: React.FC<IaqLabTabProps> = ({ onAskAiAboutHack }) => {
  // CR Box Simulator state
  const [fanSize, setFanSize] = useState<12 | 20>(20);
  const [merv, setMerv] = useState<11 | 13 | 14>(13);
  const [filterCount, setFilterCount] = useState<1 | 4 | 5>(4);
  const [fanSpeed, setFanSpeed] = useState<'low' | 'medium' | 'high'>('medium');
  const [roomArea, setRoomArea] = useState<number>(300); // sq ft
  const [ceilingHeight, setCeilingHeight] = useState<number>(9); // ft

  // Hacks filter & expanded state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedHackId, setExpandedHackId] = useState<string | null>('cr-box-fan');

  const crSpecs = calculateCrBoxSpecs({
    fanDiameterInches: fanSize,
    mervRating: merv,
    numFilters: filterCount,
    fanSpeed,
    roomAreaSqFt: roomArea,
    ceilingHeightFt: ceilingHeight
  });

  const categories = [
    { id: 'all', label: 'All Hacks' },
    { id: 'filtration', label: 'Air Purifiers & DIY' },
    { id: 'ventilation', label: 'Safe Ventilation' },
    { id: 'cooking-clean', label: 'Kitchen & Cooking' },
    { id: 'sealing', label: 'Draft Sealing' },
    { id: 'plants-humidity', label: 'Plants & Humidity' },
  ];

  const filteredHacks = selectedCategory === 'all'
    ? INDOOR_HACKS
    : INDOOR_HACKS.filter(h => h.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 mb-2 inline-block">
            Scientific IAQ Engineering
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Indoor Air Quality (IAQ) Lab & Hacks
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Indoor air during severe winter smog is often 2x to 5x more hazardous than necessary due to poor sealing, backdrafts, and bad humidifiers. Build high-CADR filtration for under $50 and apply peer-reviewed physics hacks.
          </p>
        </div>
      </div>

      {/* SECTION 1: Interactive Corsi-Rosenthal Box CADR Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Wind className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Corsi-Rosenthal Box Performance & CADR Calculator
                </h3>
                <p className="text-xs text-slate-400">
                  Model your DIY purifier's Clean Air Delivery Rate (CADR) and Air Changes Per Hour (ACH)
                </p>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
            {crSpecs.diyCost} DIY vs {crSpecs.equivalentCommercialCost} Commercial
          </span>
        </div>

        {/* Calculator Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Fan Size & Speed */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Fan Diameter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[20, 12].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFanSize(sz as 12 | 20)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        fanSize === sz
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {sz}" Box Fan
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Fan Operating Speed
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as const).map(spd => (
                    <button
                      key={spd}
                      onClick={() => setFanSpeed(spd)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                        fanSpeed === spd
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Count & MERV Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Filter Count Configuration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { cnt: 1, label: '1 Wedge' },
                    { cnt: 4, label: '4 Cube' },
                    { cnt: 5, label: '5 Cube' },
                  ].map(item => (
                    <button
                      key={item.cnt}
                      onClick={() => setFilterCount(item.cnt as 1 | 4 | 5)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        filterCount === item.cnt
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Filter Rating (MERV)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[11, 13, 14].map(val => (
                    <button
                      key={val}
                      onClick={() => setMerv(val as 11 | 13 | 14)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        merv === val
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      MERV {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Area Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="room-area-slider" className="text-xs font-bold uppercase text-slate-400">
                  Target Room Floor Area
                </label>
                <span className="text-xs font-mono font-bold text-white">
                  {roomArea} sq ft ({Math.round(roomArea * 0.0929)} m²)
                </span>
              </div>
              <input
                id="room-area-slider"
                type="range"
                min="100"
                max="800"
                step="25"
                value={roomArea}
                onChange={e => setRoomArea(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Results Visual Display */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Simulated Output Performance
              </span>

              {/* Big CADR & ACH Numbers */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">CADR Airflow</span>
                  <span className="text-2xl font-black text-emerald-400">{crSpecs.cadrCfm}</span>
                  <span className="text-[10px] text-slate-400">CFM (Cubic Ft/Min)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Air Changes (ACH)</span>
                  <span className="text-2xl font-black text-teal-300">{crSpecs.ach}x</span>
                  <span className="text-[10px] text-slate-400">per hour (target &ge; 4x)</span>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Noise Level
                  </span>
                  <span className="font-bold text-slate-200">~{crSpecs.noiseDb} dBA (Whisper/Library)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-slate-400" /> Monthly Energy (12h/day)
                  </span>
                  <span className="font-bold text-slate-200">${crSpecs.monthlyCostUsd} / month</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Clean Air Rating</span>
                  <span className="font-bold text-emerald-400">{crSpecs.ratingText}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
              💡 <strong>The Shroud Effect:</strong> Taping a 15-inch circular cardboard cutout over the fan corners boosts CADR by 30% by preventing backdraft vortices!
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Indoor Air Quality Hacks Library */}
      <div className="space-y-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hacks Accordion / Grid */}
        <div className="space-y-4">
          {filteredHacks.map((hack) => {
            const isExpanded = expandedHackId === hack.id;

            return (
              <div
                key={hack.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-teal-500/40 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  id={`hack-header-${hack.id}`}
                  aria-expanded={isExpanded}
                  aria-controls={`hack-panel-${hack.id}`}
                  onClick={() => setExpandedHackId(isExpanded ? null : hack.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-t-2xl"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400 border border-slate-700/80 shrink-0">
                      {hack.category === 'filtration' && <Wind className="w-5 h-5" />}
                      {hack.category === 'ventilation' && <Home className="w-5 h-5" />}
                      {hack.category === 'cooking-clean' && <Flame className="w-5 h-5" />}
                      {hack.category === 'plants-humidity' && <Droplets className="w-5 h-5" />}
                      {hack.category === 'sealing' && <ShieldAlert className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {hack.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            {hack.badge}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-semibold">•</span>
                        <span className="text-xs text-slate-400">Cost: <strong className="text-slate-200">{hack.cost}</strong></span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-emerald-400 font-bold">-{hack.pmReductionPercent}% PM2.5</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {hack.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="p-1 rounded-lg text-slate-400"
                      aria-hidden="true"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div 
                    id={`hack-panel-${hack.id}`}
                    role="region"
                    aria-labelledby={`hack-header-${hack.id}`}
                    className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm"
                  >
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {hack.summary}
                    </p>

                    {/* Step by Step */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Step-by-Step Execution:
                      </h5>
                      <ol className="space-y-2 list-decimal list-inside text-slate-200 leading-relaxed">
                        {hack.steps.map((st, i) => (
                          <li key={i} className="pl-1">
                            <span className="font-normal">{st}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Scientific Mechanism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          🔬 Aerosol Physics / Scientific Mechanism:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {hack.scientificMechanism}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          💡 Field Pro-Tip:
                        </span>
                        <p className="text-emerald-200 leading-relaxed">
                          {hack.proTip}
                        </p>
                      </div>
                    </div>

                    {/* Warning if any */}
                    {hack.warning && (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>Crucial Precaution:</strong> {hack.warning}</span>
                      </div>
                    )}

                    {/* Footer Action */}
                    {onAskAiAboutHack && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => onAskAiAboutHack(hack.title)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Customize this hack for my room with GenAI</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

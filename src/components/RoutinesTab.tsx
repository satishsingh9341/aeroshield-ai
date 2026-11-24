import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Sun, 
  ShieldCheck, 
  ArrowRight, 
  Bike, 
  Utensils, 
  Wind, 
  Bed, 
  Activity,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyRoutineItem, LocationData, UserProfile } from '../types';
import { generateSmartRoutines } from '../services/geminiService';

interface RoutinesTabProps {
  location: LocationData;
  profile: UserProfile;
  routines: DailyRoutineItem[];
  onToggleRoutine: (id: string) => void;
  onRegenerateRoutines: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const RoutinesTab: React.FC<RoutinesTabProps> = ({
  location,
  profile,
  routines,
  onToggleRoutine,
  onRegenerateRoutines,
  onNavigateToTab
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Single-pass reduce instead of 3 separate filter+reduce traversals
  const { completedCount, totalLungSaved, totalCo2Saved } = routines.reduce(
    (acc, r) => {
      if (r.completed) {
        acc.completedCount += 1;
        acc.totalLungSaved += r.lungDoseSavedUg;
        acc.totalCo2Saved  += r.co2SavedKg;
      }
      return acc;
    },
    { completedCount: 0, totalLungSaved: 0, totalCo2Saved: 0 }
  );

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleRoutine(id);
    if (!currentlyCompleted) {
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10b981', '#14b8a6', '#06b6d4', '#eab308']
          });
        } catch {
          // Silently ignore if canvas-confetti unavailable (e.g. headless env)
        }
      }
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onRegenerateRoutines();
    setIsGenerating(false);
  };

  const filteredRoutines = activeCategory === 'all' 
    ? routines 
    : routines.filter(r => r.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Routines' },
    { id: 'commute', label: 'Commute & Travel' },
    { id: 'ventilation', label: 'Inversion Flushing' },
    { id: 'exercise', label: 'Fitness & Health' },
    { id: 'cooking', label: 'Clean Cooking' },
    { id: 'rest', label: 'Sleep Sanctuary' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Inversion-Aware Scheduler
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-semibold">{location.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Daily Low-Emission Smog Routine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Synchronized with atmospheric thermal inversion dynamics. Keeps your family sheltered during peak ground trapping and safely schedules errands during solar noon convective mixing.
          </p>
        </div>

        {/* Progress Karma Card */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                role="img"
                aria-label={`${Math.round((completedCount / Math.max(1, routines.length)) * 100)}% routines completed`}
              >
                <circle cx="24" cy="24" r="20" className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="text-emerald-400 transition-all duration-500"
                  strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * (completedCount / Math.max(1, routines.length)))}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">
                {Math.round((completedCount / Math.max(1, routines.length)) * 100)}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Completed</span>
          </div>

          <div className="border-l border-slate-800 pl-4 space-y-1">
            <div className="text-[11px] text-slate-400">
              Lung Shielded: <strong className="text-emerald-400 font-bold">+{totalLungSaved} µg</strong>
            </div>
            <div className="text-[11px] text-slate-400">
              CO2 Averted: <strong className="text-teal-300 font-bold">+{totalCo2Saved.toFixed(1)} kg</strong>
            </div>
            <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" /> {completedCount * 25} Karma Points
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Category Filters & Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-200 transition shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Recalculating...' : 'Regenerate with GenAI'}</span>
        </button>
      </div>

      {/* Routines Timeline List */}
      <div className="space-y-3.5">
        {filteredRoutines.map((item) => {
          const isOptimal = item.windowSafety === 'Optimal Window';
          const isHazardous = item.windowSafety === 'Hazardous Inversion';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.completed
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-80'
                  : isOptimal
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                  : isHazardous
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                
                {/* Left: Checkbox & Main Info */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggle(item.id, item.completed)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
                    title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-slate-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {item.timeSlot}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isOptimal
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isHazardous
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.windowSafety}
                      </span>
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {item.recommendation}
                    </p>

                    {/* Sustainable Swap Box */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                        <Bike className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-0.5">
                          Eco-Swap & Health Impact:
                        </span>
                        <p className="text-xs text-slate-300">
                          {item.sustainableSwap}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Direct Impact Metrics */}
                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 text-right">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    +{item.lungDoseSavedUg} µg Alveolar
                  </div>
                  {item.co2SavedKg > 0 && (
                    <span className="text-[10px] font-semibold text-teal-400">
                      -{item.co2SavedKg} kg CO2
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

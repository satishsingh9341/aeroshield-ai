import React, { useState, useMemo } from 'react';
import { Layers, AlertTriangle, Sun, Info, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { LocationData } from '../types';

interface InversionBannerProps {
  location: LocationData;
}

export const InversionBanner: React.FC<InversionBannerProps> = ({ location }) => {
  const [expanded, setExpanded] = useState(false);

  const isSevere = location.inversionRisk === 'Critical' || location.inversionRisk === 'Severe';

  // Determine current hour to highlight active forecast slot
  const currentHour = new Date().getHours();
  const closestHourIndex = useMemo(() => {
    if (!location.hourlyForecast || location.hourlyForecast.length === 0) return -1;
    return location.hourlyForecast.reduce((prevIdx, curr, currIdx, arr) => {
      const currH = parseInt(curr.hour.split(':')[0], 10) || 0;
      const prevH = parseInt(arr[prevIdx].hour.split(':')[0], 10) || 0;
      return Math.abs(currH - currentHour) < Math.abs(prevH - currentHour) ? currIdx : prevIdx;
    }, 0);
  }, [location.hourlyForecast, currentHour]);

  return (
    <div className={`mb-6 rounded-2xl border transition-all overflow-hidden ${
      isSevere 
        ? 'bg-gradient-to-r from-rose-950/30 via-slate-900 to-amber-950/20 border-rose-500/30 shadow-lg shadow-rose-950/10' 
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Quick Summary Strip */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isSevere ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Atmospheric Inversion Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-medium">
                Boundary Ceiling: <strong className="text-white">{location.inversionCeiling} meters</strong>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                Safe Mixing Window: <strong className="text-emerald-400">12:30 PM – 2:30 PM</strong>
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Cold nocturnal air is trapped under a warm atmospheric layer, forming an invisible "smog lid" that concentrates diesel soot and wood smoke right at street level.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>{expanded ? 'Hide Inversion Physics' : 'Inversion Physics & Hourly Curve'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Educational & Hourly Forecast Section */}
      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/60 p-4 sm:p-6 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Physics Diagram */}
            <div className="lg:col-span-1 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <Sun className="w-4 h-4 text-amber-400" /> How Winter Inversions Work
                </h4>
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong>1. Ground Cooling:</strong> On clear, cold winter nights, the Earth’s surface rapidly radiates heat upward, cooling the air touching the soil.
                  </p>
                  <p>
                    <strong>2. The Thermal Cap:</strong> A layer of warmer, lighter air stays above this chilled ground pocket. Because cold air is denser than warm air, it cannot rise.
                  </p>
                  <p>
                    <strong>3. Extreme Particulate Trapping:</strong> All vehicular tailpipes, cooking stoves, and biomass fires get trapped in the lowest <strong>{location.inversionCeiling} meters</strong> until solar radiation warms the surface at midday.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Plan all outdoor activity for Solar Midday when vertical mixing dilutes PM2.5 by ~50%.</span>
              </div>
            </div>

            {/* 24-Hour Inversion Trapping Curve */}
            <div className="lg:col-span-2 rounded-xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hourly Smog Trapping & Safe Window Forecast ({location.name})
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    🟢 Safe Window
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Hourly Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {location.hourlyForecast.map((hourData, idx) => {
                  const isCurrentHour = idx === closestHourIndex;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition-all relative ${
                        isCurrentHour
                          ? 'ring-2 ring-emerald-400 border-emerald-400 bg-slate-900 shadow-lg shadow-emerald-500/20'
                          : hourData.safeWindow
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : hourData.inversionFactor > 0.85
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      {isCurrentHour && (
                        <span className="text-[8px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 animate-pulse">
                          Now
                        </span>
                      )}
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {hourData.hour}
                      </span>
                      <div className="my-1.5 flex flex-col items-center">
                        <span className="text-sm font-extrabold text-white">
                          {hourData.aqi}
                        </span>
                        <span className="text-[10px] text-slate-400">AQI</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        hourData.safeWindow
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {hourData.safeWindow ? 'Safe' : 'Caution'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>⚠️ Early Morning (06:00 - 09:00): Avoid jogging or school walks</span>
                <span className="text-emerald-400 font-semibold">☀️ Midday (12:00 - 14:30): Safest window for errands</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

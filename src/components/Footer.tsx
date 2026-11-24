import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Globe, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">AeroShield AI</span>
              <p className="text-[11px] text-slate-400">
                Empowering families and urban communities to navigate winter smog with scientific precision.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Ground Telemetry: US AQI & PM2.5 Standards
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Berkeley Earth Cigarette Inhalation Formula
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Corsi-Rosenthal Filtration Physics
            </span>
          </div>
        </div>

        {/* Scientific References & Disclaimers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-400 leading-relaxed">
          <div>
            <strong className="text-slate-300 block mb-1">Scientific Methodology:</strong>
            Alveolar particulate deposition equations are modeled using standard respiratory parameters: minute ventilation 0.55 m³/h (resting/sleep) to 1.2 m³/h (transit/exercise) with a 0.65 alveolar fraction. Cigarette equivalency is calculated per the Berkeley Earth benchmark (22 µg/m³ of PM2.5 over 24 hours approximates the particulate mass intake of 1 smoked cigarette).
          </div>
          <div>
            <strong className="text-slate-300 block mb-1">Health & Medical Disclaimer:</strong>
            AeroShield AI provides computational air quality recommendations, low-emission daily routines, and peer-reviewed indoor air quality hacks. It is not a substitute for professional medical advice, clinical diagnosis, or hospital treatment. Always consult qualified pulmonologists or emergency services in cases of acute respiratory distress or croup.
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} AeroShield AI — GenAI Urban Clean Air Companion. Free & Open Science for Communities.</span>
          <span className="text-slate-400 mt-1 sm:mt-0">Built with Google Gemini & Vite React</span>
        </div>

      </div>
    </footer>
  );
};

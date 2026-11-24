import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Share2, 
  Check, 
  Copy, 
  Plus, 
  ThumbsUp, 
  Wind,
  Flame,
  Bus,
  X
} from 'lucide-react';
import { CommunityAlert, LocationData, UserProfile } from '../types';
import { CLEAN_AIR_HAVENS, COMMUNITY_ALERTS } from '../data/community';

interface CommunityTabProps {
  location: LocationData;
  profile: UserProfile;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({ location, profile: _profile }) => {
  const [alerts, setAlerts] = useState<CommunityAlert[]>(COMMUNITY_ALERTS);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showDiplomaticNotice, setShowDiplomaticNotice] = useState(false);

  const [newReport, setNewReport] = useState({
    title: '',
    neighborhood: '',
    description: '',
    type: 'waste-fire' as CommunityAlert['type']
  });
  const [showReportModal, setShowReportModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Modal Focus Trap and Escape Key Handler
  useEffect(() => {
    if (!showReportModal) return;

    const previousFocusedElement = document.activeElement as HTMLElement | null;
    const modalElement = modalRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowReportModal(false);
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

    const initialTimer = setTimeout(() => {
      const input = modalElement?.querySelector<HTMLElement>('#report-incident-type');
      input?.focus();
    }, 50);

    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusedElement?.focus();
    };
  }, [showReportModal]);

  const handleUpvote = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title.trim()) return;

    const alertItem: CommunityAlert = {
      id: `usr-alt-${Date.now()}`,
      title: newReport.title,
      neighborhood: newReport.neighborhood || `${location.name} Ward`,
      type: newReport.type,
      severity: newReport.type === 'waste-fire' ? 'warning' : 'info',
      timestamp: 'Just now',
      description: newReport.description || 'Community reported incident.',
      actionRequested: 'Notifying local pod organizers.',
      upvotes: 1
    };

    setAlerts([alertItem, ...alerts]);
    setShowReportModal(false);
    setNewReport({ title: '', neighborhood: '', description: '', type: 'waste-fire' });
  };

  const diplomaticNoticeText = `📢 *Respectful Community Health Notice: Winter Smog & Thermal Inversion Alert*

Dear Neighbors and Community Members of ${location.name},

Our local air quality has entered severe territory today (**AQI ${location.aqi}**, PM2.5 **${location.pm25} µg/m³**). Due to a strong winter thermal inversion, cold air is trapped below **${location.inversionCeiling} meters**, acting like an invisible ceiling that prevents any smoke from rising or dispersing.

To protect our neighborhood's children, elders, and those with asthma:
1. 🚫 **Please strictly avoid burning leaves, dry garden waste, or rubbish**. Smoke stays trapped directly at street level outside our bedroom windows.
2. 🚗 **Please turn off idling car/scooter engines** while waiting outside apartment gates or school pick-up zones.
3. 🏫 **Let's pool school morning drop-offs** to reduce neighborhood vehicle congestion.

Thank you for helping keep our shared air breathable for everyone's family! 🙏🌿`;

  const copyNotice = () => {
    navigator.clipboard.writeText(diplomaticNoticeText);
    setCopiedNotice(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedNotice(false), 2000);
  };

  // Filter havens for current location, falling back to all if none specific
  const matchedHavens = CLEAN_AIR_HAVENS.filter(h => h.cityId === location.id);
  const displayedHavens = matchedHavens.length > 0 ? matchedHavens : CLEAN_AIR_HAVENS.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 mb-2 inline-block">
            Collective Community Defense
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Neighborhood Clean Air Pods & Havens
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Severe winter smog is a collective challenge. Share clean air shelters, organize school transit carpools, and coordinate diplomatic neighborhood burning prevention.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition self-start md:self-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Plus className="w-4 h-4" /> Report Local Smoke or Incident
        </button>
      </div>

      {/* Diplomatic Community Alert Generator Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              AI Diplomatic Neighborhood Alert Generator
            </h3>
            <p className="text-xs text-slate-400">
              Ready-to-copy polite, science-backed message for your neighborhood WhatsApp, RWA, or building group
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowDiplomaticNotice(!showDiplomaticNotice)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {showDiplomaticNotice ? 'Hide Preview' : 'Preview Message'}
          </button>
          <button
            type="button"
            onClick={copyNotice}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Preview of Diplomatic Notice */}
      {showDiplomaticNotice && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-inner">
          <div className="flex justify-between items-center mb-2 text-xs font-bold text-indigo-400">
            <span>Formatted for WhatsApp / Community Group:</span>
            <button type="button" onClick={copyNotice} className="text-emerald-400 hover:underline flex items-center gap-1">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
            {diplomaticNoticeText}
          </pre>
        </div>
      )}

      {/* SECTION: Clean Air Havens Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Public Clean Air Havens & Shelters
            </h3>
            <p className="text-xs text-slate-400">
              Free civic buildings with commercial MERV-14/HEPA filtration open to families escaping drafty apartments in {location.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedHavens.map(haven => (
            <div
              key={haven.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {haven.type}
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AQI {haven.indoorAqi} Clean Air
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {haven.name}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {haven.address}
                </p>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[11px] text-teal-400 font-medium">
                    🌪️ {haven.filtration}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    🕒 Open Hours: <strong className="text-slate-200">{haven.openHours}</strong>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {haven.amenities.map((am, i) => (
                    <span key={i} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Capacity: {haven.capacity}</span>
                <span className="text-emerald-400 font-semibold">Free Entry</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Community Alerts & Incidents Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Neighborhood Incidents & Coordination
        </h3>

        <div className="space-y-3">
          {alerts.map(item => {
            const isEmergency = item.severity === 'emergency';
            const isWarning = item.severity === 'warning';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEmergency
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      item.type === 'waste-fire' ? 'bg-rose-500/20 text-rose-400' :
                      item.type === 'inversion-peak' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                      item.type === 'carpool-offer' ? 'bg-teal-500/20 text-teal-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.type === 'waste-fire' && <Flame className="w-5 h-5" />}
                      {item.type === 'inversion-peak' && <Wind className="w-5 h-5" />}
                      {item.type === 'carpool-offer' && <Bus className="w-5 h-5" />}
                      {item.type === 'clean-air-haven' && <Building2 className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400 font-medium">{item.neighborhood}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                        {item.description}
                      </p>

                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <strong className="text-emerald-400">Recommended Action:</strong>
                        <span>{item.actionRequested}</span>
                      </div>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    type="button"
                    onClick={() => handleUpvote(item.id)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-bold transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    title="Confirm this report"
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>{item.upvotes}</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for reporting an incident */}
      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          ref={modalRef}
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 id="report-modal-title" className="text-base font-bold text-white">Report Neighborhood Smoke / Incident</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1 text-slate-400 hover:text-white transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Alert neighbors and clean air pod coordinators in your sector</p>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="report-incident-type" className="block text-slate-300 font-bold mb-1">Incident Type</label>
                <select
                  id="report-incident-type"
                  value={newReport.type}
                  onChange={e => setNewReport({ ...newReport, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="waste-fire">Open Leaf / Waste Burning</option>
                  <option value="inversion-peak">Severe Stagnant Smog Pocket</option>
                  <option value="carpool-offer">Commute / School Carpool Ride Offer</option>
                  <option value="clean-air-haven">Community Clean Air Haven Update</option>
                </select>
              </div>

              <div>
                <label htmlFor="report-title" className="block text-slate-300 font-bold mb-1">Short Title</label>
                <input
                  id="report-title"
                  type="text"
                  placeholder="e.g. Garden waste burning behind Market Gate 2"
                  value={newReport.title}
                  onChange={e => setNewReport({ ...newReport, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="report-neighborhood" className="block text-slate-300 font-bold mb-1">Neighborhood / Sector</label>
                <input
                  id="report-neighborhood"
                  type="text"
                  placeholder="e.g. Sector 18 / Greenwood Park"
                  value={newReport.neighborhood}
                  onChange={e => setNewReport({ ...newReport, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="report-description" className="block text-slate-300 font-bold mb-1">Details & Location</label>
                <textarea
                  id="report-description"
                  rows={3}
                  placeholder="Describe smoke density, wind direction, or seats available..."
                  value={newReport.description}
                  onChange={e => setNewReport({ ...newReport, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Publish Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

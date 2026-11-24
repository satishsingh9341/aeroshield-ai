import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Baby, 
  ShieldCheck, 
  Bike, 
  HeartHandshake, 
  Check, 
  Copy, 
  ArrowRight, 
  Wrench, 
  Volume2 
} from 'lucide-react';
import { ChatMessage, LocationData, PersonaType, UserProfile } from '../types';
import { queryAeroGuideAi } from '../services/geminiService';

interface ChatTabProps {
  location: LocationData;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToTab?: (tab: string) => void;
  initialInquiry?: string;
  onClearInquiry?: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  location,
  profile,
  onUpdateProfile,
  onNavigateToTab,
  initialInquiry,
  onClearInquiry
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am **AeroShield AI**, your GenAI urban air pollution and winter smog survival companion.\n\nCurrently in **${location.name}**, air quality is **${location.aqi} AQI (${location.level.toUpperCase()})** with fine particulate PM2.5 at **${location.pm25} µg/m³**. A strong winter thermal inversion is capping pollutants below **${location.inversionCeiling} meters**.\n\nHow can I help protect your household (${profile.householdMembers.total} members) today? You can ask about safe ventilation windows, building DIY Corsi-Rosenthal purifiers, pediatric cough relief, low-emission cooking, or sustainable commute swaps.`,
      timestamp: 'Just now',
      impactBadge: {
        metric: 'Household Protection Status',
        value: `${profile.householdMembers.total} Members Monitored`,
        color: 'emerald'
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const liveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Clean up timers, abort controller, and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      currentUtteranceRef.current = null;
      if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // Location update notification
  const prevLocationRef = useRef(location.id);
  useEffect(() => {
    if (prevLocationRef.current !== location.id) {
      prevLocationRef.current = location.id;
      setMessages(prev => [
        ...prev,
        {
          id: `loc-${Date.now()}`,
          sender: 'assistant',
          content: `📍 **Location updated to ${location.name}**\n\nCurrent AQI: **${location.aqi} (${location.level.toUpperCase()})**, PM2.5: **${location.pm25} µg/m³**, inversion ceiling: **${location.inversionCeiling}m**. All recommendations now reflect ${location.name} air quality.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [location.id, location.name, location.aqi, location.level, location.pm25, location.inversionCeiling]);

  // Handle incoming inquiry from IAQ Lab or other tabs
  useEffect(() => {
    if (initialInquiry && initialInquiry.trim()) {
      handleSend(initialInquiry.trim());
      onClearInquiry?.();
    }
  }, [initialInquiry]);

  const samplePrompts = useMemo(() => [
    {
      label: '🪟 Safe Window Flush',
      text: `AQI is ${location.aqi} outside. When is the safest solar window to open windows for a 10-minute CO2 flush?`
    },
    {
      label: '👶 Toddler Smog Cough',
      text: 'My toddler woke up coughing from the severe winter smog. What immediate indoor safe-room protocol should I follow?'
    },
    {
      label: '🛠️ $45 DIY Box Purifier',
      text: 'Guide me step-by-step on building a Corsi-Rosenthal DIY box fan purifier with MERV-13 filters and calculating its CADR.'
    },
    {
      label: '🍳 Low-Emission Cooking',
      text: 'Why does high-heat frying during smog season spike indoor PM2.5, and what are clean culinary swaps?'
    },
    {
      label: '🚲 Commute & Exercise Swap',
      text: `Suggest a low-emission commute and safe indoor workout swap for our ${profile.commute.dailyDistanceKm} km daily route.`
    }
  ], [location.aqi, profile.commute.dailyDistanceKm]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await queryAeroGuideAi(queryText, profile, location, abortRef.current.signal);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        impactBadge: response.impactBadge,
        actionableRoutines: response.actionableRoutines,
        hackReferenceId: response.hackReferenceId
      };

      setMessages(prev => [...prev, aiMsg]);
      setLiveAnnouncement('AeroShield AI has responded.');
      if (liveTimerRef.current) clearTimeout(liveTimerRef.current);
      liveTimerRef.current = setTimeout(() => setLiveAnnouncement(''), 2000);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text
        .replace(/#{1,6}\s?/g, '')
        .replace(/[*`_~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      currentUtteranceRef.current = utterance;
      utterance.onend = () => {
        currentUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        currentUtteranceRef.current = null;
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePersonaSwitch = (newPersona: PersonaType) => {
    onUpdateProfile({ ...profile, activePersona: newPersona });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-5xl mx-auto glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Screen reader live region for AI responses */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        {liveAnnouncement}
      </div>

      {/* Persona Selector Banner */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Active Persona:
        </span>
        <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="AI Assistant Persona">
          {[
            { id: 'family-guard', label: 'Family Guard', icon: ShieldCheck },
            { id: 'pediatric-safety', label: 'Pediatric Care', icon: Baby },
            { id: 'eco-commuter', label: 'Eco-Commuter', icon: Bike },
            { id: 'community-leader', label: 'Community Leader', icon: HeartHandshake },
          ].map(p => {
            const Icon = p.icon;
            const active = profile.activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePersonaSwitch(p.id as PersonaType)}
                aria-label={p.label}
                aria-pressed={active}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-3 h-3" aria-hidden="true" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar" role="log" aria-label="Chat messages">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isUser 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white'
              }`} aria-hidden="true">
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  
                  {/* Markdown rendering with safe URL protocol checking (SEC-05) */}
                  <div className={`chat-markdown ${isUser ? '' : 'space-y-1'}`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => {
                          const isSafe = href && /^(https?:|mailto:|\/)/i.test(href);
                          if (!isSafe) {
                            return <span className="text-slate-400 underline">{children}</span>;
                          }
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Impact Badge */}
                  {msg.impactBadge && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {msg.impactBadge.metric}:
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden="true" /> {msg.impactBadge.value}
                      </span>
                    </div>
                  )}

                  {/* Actionable Routines Pills */}
                  {msg.actionableRoutines && msg.actionableRoutines.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Generated Action Steps:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.actionableRoutines.map((routine, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onNavigateToTab?.('routines')}
                            aria-label={`Action: ${routine} – go to routines`}
                            className="text-[11px] font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                          >
                            <span>⚡ {routine}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-400" aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hack Reference Link */}
                  {msg.hackReferenceId && onNavigateToTab && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => onNavigateToTab('iaq-lab')}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline underline-offset-2"
                      >
                        <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> Open blueprint in IAQ Lab
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Meta & Action Tools */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <>
                      <span aria-hidden="true">•</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-slate-200 flex items-center gap-0.5"
                        aria-label={copiedId === msg.id ? 'Copied to clipboard' : 'Copy message to clipboard'}
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <span aria-hidden="true">•</span>
                      <button
                        type="button"
                        onClick={() => speakText(msg.content)}
                        className="hover:text-slate-200 flex items-center gap-0.5"
                        aria-label="Read message aloud"
                      >
                        <Volume2 className="w-3 h-3" aria-hidden="true" />
                        <span>Listen</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3.5" aria-live="polite" aria-label="AeroShield AI is thinking">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 animate-pulse" aria-hidden="true">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
              <span>Analyzing inversion thermodynamics, aerosol dosage, and family routines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Queries:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p.text)}
            aria-label={`Quick query: ${p.label}`}
            className="text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/80 whitespace-nowrap transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
          role="search"
          aria-label="Ask AeroShield AI"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask AeroShield AI about winter smog in ${location.name}, IAQ hacks, or family protection...`}
            aria-label="Your question for AeroShield AI"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>

    </div>
  );
};

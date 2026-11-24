import React, { useState, useEffect, useRef } from 'react';
import { X, Key, Sparkles, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, getStoredModel, setStoredModel } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state on modal open
  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setModel(getStoredModel());
      setStatus('idle');
      setErrorMessage('');
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  // Focus trap and Escape key listener
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

    const initialTimer = setTimeout(() => {
      const input = modalElement?.querySelector<HTMLElement>('#gemini-api-key');
      input?.focus();
    }, 50);

    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      setStoredApiKey('');
      setStoredModel(model);
      setStatus('idle');
      onClose();
      return;
    }

    setStatus('testing');
    setErrorMessage('');

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey.trim()
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with exactly: OK' }] }]
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${res.status}`);
      }

      setStoredApiKey(apiKey.trim());
      setStoredModel(model);
      setStatus('success');
      timerRef.current = setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to authenticate with Gemini API');
    }
  };

  const handleRemoveKey = () => {
    setStoredApiKey('');
    setApiKey('');
    setStatus('idle');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Key className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="api-key-modal-title" className="text-base font-bold text-white">Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Optional: Enable direct live Gemini calls</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
            <span className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Works Without an API Key!
            </span>
            AeroShield AI includes a comprehensive, high-resolution built-in aerosol intelligence engine with deep winter smog modeling. Adding your Google Gemini API key enables unbounded dynamic conversation.
          </div>

          <div>
            <label htmlFor="gemini-api-key" className="block font-bold text-slate-300 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              id="gemini-api-key"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Saved locally in your browser.</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                Get free key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div>
            <label htmlFor="gemini-model-select" className="block font-bold text-slate-300 mb-1.5">
              Select Gemini Model
            </label>
            <select
              id="gemini-model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, High Quality)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Scientific Reasoning)</option>
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
            </select>
          </div>

          {status === 'success' && (
            <div 
              role="status" 
              aria-live="polite" 
              className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Connection verified! Live Gemini AI is active.</span>
            </div>
          )}

          {status === 'error' && (
            <div 
              role="alert" 
              aria-live="assertive" 
              className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60">
          {apiKey ? (
            <button
              type="button"
              onClick={handleRemoveKey}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Clear Key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={status === 'testing'}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {status === 'testing' ? 'Verifying...' : 'Save & Verify'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

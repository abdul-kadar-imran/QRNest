
import React, { useState, useEffect, useCallback } from 'react';
import QRForm from './components/QRForm';
import QRPreview from './components/QRPreview';
import Customizer from './components/Customizer';
import History from './components/History';
import Footer from './components/Footer';
import { QRConfig, QRType } from './types';
import { DEFAULT_CONFIG } from './constants';
import { Sparkles, RefreshCcw, Moon, Sun, Github } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<QRConfig[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('qr_theme');
      // Default to dark mode unless explicitly set to light
      return savedTheme !== 'light';
    }
    return true;
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qr_theme', 'light');
    }
  }, [darkMode]);

  // Initial data load
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfigChange = (updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleTypeChange = (type: QRType) => {
    setConfig({ ...DEFAULT_CONFIG, type, id: crypto.randomUUID() });
  };

  const saveToHistory = useCallback((currentConfig: QRConfig) => {
    if (!currentConfig.value.trim()) return;

    setHistory(prev => {
      const filtered = prev.filter(item => item.value !== currentConfig.value);
      const newHistory = [{ ...currentConfig, timestamp: Date.now() }, ...filtered].slice(0, 5);
      localStorage.setItem('qr_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  useEffect(() => {
    if (!config.value) return;
    const timer = setTimeout(() => {
      saveToHistory(config);
    }, 1500);
    return () => clearTimeout(timer);
  }, [config.value, config, saveToHistory]);

  const resetGenerator = () => {
    setConfig({ ...DEFAULT_CONFIG, id: crypto.randomUUID() });
    showToast('Generator reset');
  };

  const copyToClipboard = async () => {
    const svg = document.querySelector('#current-qr-code svg') as SVGElement;
    if (!svg) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        canvas.width = svg.clientWidth || 1024;
        canvas.height = svg.clientHeight || 1024;
        if (ctx) {
          ctx.fillStyle = config.bgColor || 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              showToast('QR Code copied to clipboard!');
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      showToast('Failed to copy. Try downloading instead.', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      {toast && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] sm:w-auto pointer-events-none">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-3 border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success'
              ? 'bg-white/95 dark:bg-slate-900/95 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300'
              : 'bg-red-50/95 dark:bg-red-950/95 border-red-100 dark:border-red-900 text-red-600 dark:text-red-400'
            }`}>
            <Sparkles size={18} className="flex-shrink-0" />
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <span className="font-black text-lg sm:text-xl">N</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            QR<span className="text-indigo-600">Nest</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button
            onClick={resetGenerator}
            className="p-2.5 sm:p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center"
            title="Reset All"
          >
            <RefreshCcw size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content - Single Column Layout */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 flex-grow space-y-8">

        {/* Section 1: Input */}
        <section className="bg-white dark:bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">1</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Select Content</h2>
          </div>
          <QRForm
            type={config.type}
            onTypeChange={handleTypeChange}
            onValueChange={(val) => handleConfigChange({ value: val })}
            initialValue={config.value}
          />
        </section>

        {/* Section 2: Customization */}
        <section className="bg-white dark:bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">2</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Customize Design</h2>
          </div>
          <Customizer config={config} onChange={handleConfigChange} />
        </section>

        {/* Section 3: History */}
        <History
          items={history}
          onSelect={(item) => setConfig(item)}
          onClear={() => {
            setHistory([]);
            localStorage.removeItem('qr_history');
            showToast('History cleared');
          }}
        />

        {/* Section 4: Live Preview - LAST SECTION */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">3</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Final Preview</h2>
          </div>
          <QRPreview config={config} onCopy={copyToClipboard} />
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default App;

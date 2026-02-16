
import React from 'react';
import { Palette, Maximize, Image as ImageIcon, Layout, Type, ShieldCheck } from 'lucide-react';
import { QRConfig } from '../types';
import { ERROR_CORRECTION_LEVELS } from '../constants';

interface CustomizerProps {
  config: QRConfig;
  onChange: (updates: Partial<QRConfig>) => void;
}

const Customizer: React.FC<CustomizerProps> = ({ config, onChange }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4";
  const inputBgClasses = "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="space-y-8">
      {/* Colors */}
      <section>
        <label className={labelClasses}>
          <Palette size={18} className="text-indigo-500" />
          Colors
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block ml-1">Foreground</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="w-11 h-11 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
              />
              <input 
                type="text" 
                value={config.fgColor} 
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className={`flex-1 px-4 py-2.5 text-sm ${inputBgClasses} dark:text-white`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block ml-1">Background</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="w-11 h-11 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
              />
              <input 
                type="text" 
                value={config.bgColor} 
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className={`flex-1 px-4 py-2.5 text-sm ${inputBgClasses} dark:text-white`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Size and Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <section>
          <label className={labelClasses}>
            <Maximize size={18} className="text-indigo-500" />
            Size ({config.size}px)
          </label>
          <input
            type="range"
            min="150"
            max="400"
            step="10"
            value={config.size}
            onChange={(e) => onChange({ size: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </section>
        <section>
          <label className={labelClasses}>
            <Layout size={18} className="text-indigo-500" />
            Error Correction
          </label>
          <select
            value={config.level}
            onChange={(e) => onChange({ level: e.target.value as any })}
            className={`w-full px-4 py-3 ${inputBgClasses} text-sm dark:text-white`}
          >
            {ERROR_CORRECTION_LEVELS.map(lvl => (
              <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
            ))}
          </select>
        </section>
      </div>

      {/* Extras */}
      <section className="space-y-6">
        <div>
          <label className={labelClasses}>
            <ImageIcon size={18} className="text-indigo-500" />
            Center Logo
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-indigo-400 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/20">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {config.logoUrl ? 'Change Image' : 'Upload PNG/JPG'}
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
            {config.logoUrl && (
              <button 
                onClick={() => onChange({ logoUrl: undefined })}
                className="px-6 py-3 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl hover:bg-red-100 transition-all uppercase tracking-widest"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            <Type size={18} className="text-indigo-500" />
            Frame Text
          </label>
          <input
            type="text"
            placeholder="Scan Me!"
            value={config.frameText || ''}
            onChange={(e) => onChange({ frameText: e.target.value })}
            className={`w-full px-4 py-3 ${inputBgClasses} text-sm dark:text-white placeholder-slate-400`}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <input
            type="checkbox"
            id="includeMargin"
            checked={config.includeMargin}
            onChange={(e) => onChange({ includeMargin: e.target.checked })}
            className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="includeMargin" className="text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            Include Outer Padding
          </label>
        </div>
      </section>
    </div>
  );
};

export default Customizer;

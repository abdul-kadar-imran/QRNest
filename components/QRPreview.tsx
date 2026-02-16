
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Info } from 'lucide-react';
import { QRConfig } from '../types';
import { downloadQRCode } from '../utils/qrHelpers';

interface QRPreviewProps {
  config: QRConfig;
  onCopy: () => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({ config, onCopy }) => {
  const hasValue = config.value.trim().length > 0;
  const qrId = 'current-qr-code';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Live Preview</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Ready to scan & download</p>
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center max-w-[320px] mx-auto">
        <div 
          id={qrId} 
          className={`relative p-4 sm:p-6 bg-white rounded-2xl transition-all duration-500 shadow-lg ${hasValue ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
          style={{ backgroundColor: config.bgColor }}
        >
          {hasValue ? (
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={config.value}
                size={Math.min(256, config.size)}
                fgColor={config.fgColor}
                bgColor={config.bgColor}
                level={config.level}
                includeMargin={config.includeMargin}
                imageSettings={config.logoUrl ? {
                  src: config.logoUrl,
                  x: undefined,
                  y: undefined,
                  height: Math.min(256, config.size) * 0.22,
                  width: Math.min(256, config.size) * 0.22,
                  excavate: true,
                } : undefined}
                className="w-full h-auto max-w-full"
              />
              {config.frameText && (
                <p 
                  className="mt-4 font-black uppercase tracking-[0.2em] text-center" 
                  style={{ color: config.fgColor, fontSize: `${Math.max(10, Math.min(18, config.size / 18))}px` }}
                >
                  {config.frameText}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl w-full aspect-square min-w-[200px] sm:min-w-[256px]">
              <div className="text-center px-6">
                <Info className="text-slate-200 dark:text-slate-600 mx-auto mb-2" size={32} />
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Waiting for data...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasValue && (
        <div className="w-full mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => downloadQRCode(qrId, 'png', `QRNest_${config.type}_${Date.now()}`)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              <Download size={18} />
              PNG
            </button>
            <button
              onClick={() => downloadQRCode(qrId, 'svg', `QRNest_${config.type}_${Date.now()}`)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              <Download size={18} />
              SVG
            </button>
          </div>
          
          <button
            onClick={onCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl text-sm font-bold hover:bg-indigo-100 transition-all active:scale-95"
          >
            <Copy size={18} />
            Copy Image
          </button>
        </div>
      )}
    </div>
  );
};

export default QRPreview;

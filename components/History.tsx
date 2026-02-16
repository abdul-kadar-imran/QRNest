
import React from 'react';
import { History as HistoryIcon, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { QRConfig } from '../types';

interface HistoryProps {
  items: QRConfig[];
  onSelect: (config: QRConfig) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-bold">
          <HistoryIcon size={20} className="text-indigo-500" />
          <span className="text-lg">Recent QR Codes</span>
        </div>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 transition-colors flex items-center gap-1.5 uppercase tracking-widest"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-all text-left shadow-sm active:scale-95"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-[9px] uppercase tracking-widest font-black text-indigo-600 dark:text-indigo-400">
                {item.type}
              </span>
              <Clock size={12} className="text-slate-300 dark:text-slate-600" />
            </div>
            
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate w-full mb-1">
              {item.value || 'Untitled'}
            </p>
            
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
              <ArrowUpRight size={14} className="text-indigo-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;

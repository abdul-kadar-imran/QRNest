
import React, { useState, useEffect } from 'react';
import { QRType, WiFiConfig, EmailConfig, WhatsAppConfig } from '../types';
import { QR_TYPE_OPTIONS } from '../constants';
import { formatQRValue } from '../utils/qrHelpers';

interface QRFormProps {
  type: QRType;
  onTypeChange: (type: QRType) => void;
  onValueChange: (value: string) => void;
  initialValue?: string;
}

const QRForm: React.FC<QRFormProps> = ({ type, onTypeChange, onValueChange, initialValue }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData({});
  }, [type]);

  const updateForm = (updates: any) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onValueChange(formatQRValue(type, newData));
  };

  const handleSimpleChange = (val: string) => {
    setFormData(val);
    onValueChange(formatQRValue(type, val));
  };

  const inputClasses = "w-full px-4 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none shadow-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base";
  const labelClasses = "text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block ml-1";

  const renderFields = () => {
    switch (type) {
      case 'url':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>Website URL</label>
            <input
              type="url"
              inputMode="url"
              placeholder="https://example.com"
              value={typeof formData === 'string' ? formData : ''}
              onChange={(e) => handleSimpleChange(e.target.value)}
              className={inputClasses}
            />
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>Plain Text</label>
            <textarea
              rows={4}
              placeholder="Enter your message here..."
              value={typeof formData === 'string' ? formData : ''}
              onChange={(e) => handleSimpleChange(e.target.value)}
              className={`${inputClasses} resize-none`}
            />
          </div>
        );
      case 'phone':
        return (
          <div className="space-y-2">
            <label className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="+1 (555) 000-0000"
              value={typeof formData === 'string' ? formData : ''}
              onChange={(e) => handleSimpleChange(e.target.value)}
              className={inputClasses}
            />
          </div>
        );
      case 'email':
        const email = formData as EmailConfig;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                inputMode="email"
                placeholder="hello@example.com"
                value={email.address || ''}
                onChange={(e) => updateForm({ address: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry"
                  value={email.subject || ''}
                  onChange={(e) => updateForm({ subject: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Body Message</label>
                <input
                  type="text"
                  placeholder="Hello..."
                  value={email.body || ''}
                  onChange={(e) => updateForm({ body: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        );
      case 'whatsapp':
        const wa = formData as WhatsAppConfig;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={labelClasses}>WhatsApp Number</label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="15550000000"
                value={wa.phone || ''}
                onChange={(e) => updateForm({ phone: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Pre-filled Message</label>
              <input
                type="text"
                placeholder="Hi! I saw your QR code..."
                value={wa.message || ''}
                onChange={(e) => updateForm({ message: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>
        );
      case 'wifi':
        const wifi = formData as WiFiConfig;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={labelClasses}>Network Name (SSID)</label>
              <input
                type="text"
                placeholder="My Home WiFi"
                value={wifi.ssid || ''}
                onChange={(e) => updateForm({ ssid: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={wifi.password || ''}
                  onChange={(e) => updateForm({ password: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Encryption</label>
                <select
                  value={wifi.encryption || 'WPA'}
                  onChange={(e) => updateForm({ encryption: e.target.value as any })}
                  className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em] bg-no-repeat`}
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {QR_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all active:scale-95 ${
              type === opt.value
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-500 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <div className={`${type === opt.value ? 'scale-110' : ''} transition-transform duration-300`}>
              {opt.icon}
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter sm:tracking-normal">{opt.label}</span>
          </button>
        ))}
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[100px]">
        {renderFields()}
      </div>
    </div>
  );
};

export default QRForm;

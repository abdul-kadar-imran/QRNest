
import React from 'react';
import { 
  Link, 
  Type, 
  Phone, 
  Mail, 
  MessageCircle, 
  Wifi, 
  Settings, 
  History, 
  Download, 
  Trash2, 
  Copy, 
  RefreshCw,
  Moon,
  Sun,
  Palette,
  Layout,
  Info
} from 'lucide-react';
import { QRType } from './types';

export const QR_TYPE_OPTIONS: { value: QRType; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'URL', icon: <Link size={18} /> },
  { value: 'text', label: 'Text', icon: <Type size={18} /> },
  { value: 'phone', label: 'Phone', icon: <Phone size={18} /> },
  { value: 'email', label: 'Email', icon: <Mail size={18} /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={18} /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi size={18} /> },
];

export const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
];

export const DEFAULT_CONFIG = {
  id: crypto.randomUUID(),
  type: 'url' as QRType,
  value: '',
  size: 256,
  fgColor: '#000000',
  bgColor: '#ffffff',
  level: 'M' as const,
  includeMargin: true,
  timestamp: Date.now(),
};

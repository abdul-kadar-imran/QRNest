
export type QRType = 'url' | 'text' | 'phone' | 'email' | 'whatsapp' | 'wifi';

export interface WiFiConfig {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailConfig {
  address: string;
  subject?: string;
  body?: string;
}

export interface WhatsAppConfig {
  phone: string;
  message?: string;
}

export interface QRConfig {
  id: string;
  type: QRType;
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  logoUrl?: string;
  frameText?: string;
  timestamp: number;
}

export interface AppState {
  config: QRConfig;
  history: QRConfig[];
  darkMode: boolean;
}

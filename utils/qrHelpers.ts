
import { QRType, WiFiConfig, EmailConfig, WhatsAppConfig } from '../types';

export const formatQRValue = (type: QRType, data: any): string => {
  if (!data) return '';
  
  switch (type) {
    case 'url':
      let url = data.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    
    case 'phone':
      return `tel:${data.trim()}`;
      
    case 'email':
      const email = data as EmailConfig;
      let mailto = `mailto:${email.address}`;
      const params = [];
      if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
      if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
      return params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
      
    case 'whatsapp':
      const wa = data as WhatsAppConfig;
      let waNumber = wa.phone ? wa.phone.replace(/\D/g, '') : '';
      let waUrl = `https://wa.me/${waNumber}`;
      if (wa.message) waUrl += `?text=${encodeURIComponent(wa.message)}`;
      return waUrl;
      
    case 'wifi':
      const wifi = data as WiFiConfig;
      return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password || ''};H:${wifi.hidden ? 'true' : 'false'};;`;
      
    case 'text':
    default:
      return typeof data === 'string' ? data.trim() : '';
  }
};

export const downloadQRCode = (id: string, format: 'png' | 'svg', filename: string) => {
  const container = document.getElementById(id);
  const svg = container?.querySelector('svg') as SVGElement;
  if (!svg) return;

  // Get true background color from element style
  const bgColor = container?.style.backgroundColor || 'white';

  if (format === 'svg') {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Use client dimensions or fallback
      const width = svg.clientWidth || 1024;
      const height = svg.clientHeight || 1024;
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${filename}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }
};

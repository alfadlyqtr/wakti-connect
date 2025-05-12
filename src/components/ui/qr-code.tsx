
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = 'L',
  bgColor = "#ffffff",
  fgColor = "#000000"
}) => {
  // Create a URL for the QR code API (using QRServer.com which is free to use)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&ecc=${level}&bgcolor=${bgColor.replace('#', '')}&color=${fgColor.replace('#', '')}`;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        src={qrCodeUrl} 
        alt={`QR code for ${value}`} 
        width={size} 
        height={size} 
        className="border border-gray-200 rounded"
      />
    </div>
  );
};

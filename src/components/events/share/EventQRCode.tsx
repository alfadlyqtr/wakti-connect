
import React, { useEffect, useState } from "react";
import { Event } from "@/types/event.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface EventQRCodeProps {
  event: Event;
  shareUrl: string;
  size?: number;
}

export const EventQRCode: React.FC<EventQRCodeProps> = ({
  event,
  shareUrl,
  size = 200
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  useEffect(() => {
    // Using Google Charts API to generate QR code
    const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(shareUrl)}&choe=UTF-8`;
    setQrCodeUrl(googleChartsUrl);
  }, [shareUrl, size]);
  
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 text-center">
        <p className="text-sm mb-3">Scan to view event</p>
        {qrCodeUrl && (
          <div className="flex flex-col items-center">
            <img 
              src={qrCodeUrl} 
              alt="Event QR Code" 
              className="mx-auto mb-4"
              width={size} 
              height={size}
            />
            <Button 
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventQRCode;

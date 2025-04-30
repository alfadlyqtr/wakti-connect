
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

interface InvitationShareOptionsProps {
  shareLink: string;
}

export const InvitationShareOptions: React.FC<InvitationShareOptionsProps> = ({ shareLink }) => {
  const fullShareLink = `${window.location.origin}/i/${shareLink}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullShareLink);
    toast.success("Link copied to clipboard!");
  };
  
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code")?.querySelector("canvas");
    if (!canvas) return;
    
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "invitation-qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success("QR code downloaded!");
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Share Link</h3>
        <div className="flex gap-2">
          <Input value={fullShareLink} readOnly />
          <Button onClick={handleCopyLink} type="button">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this link with your guests to invite them
        </p>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">QR Code</h3>
        <div className="flex justify-center p-4 bg-white rounded-lg" id="qr-code">
          <QRCode value={fullShareLink} size={200} />
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={downloadQRCode} type="button">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </div>
    </div>
  );
};

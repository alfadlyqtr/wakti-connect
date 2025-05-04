
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, QrCode, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { generateQRCode } from '@/utils/qrCodeUtils';

interface ShareLinkTabProps {
  eventId: string;
  slug: string;
}

const ShareLinkTab: React.FC<ShareLinkTabProps> = ({ eventId, slug }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Generate the URL in the correct format with the /i/ prefix for invitations
  // This ensures compatibility with the router
  const shareUrl = slug 
    ? `${window.location.origin}/i/${slug}` 
    : `${window.location.origin}/i/${eventId}`;
  
  console.log("Generated share URL:", shareUrl, "with slug:", slug, "and eventId:", eventId);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy failed",
        description: "Unable to copy the link to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const downloadQRCode = async () => {
    try {
      setIsDownloading(true);
      const eventTitle = slug || eventId;
      await generateQRCode(shareUrl, eventTitle);
      toast({
        title: "QR Code downloaded",
        description: "Your QR code has been downloaded",
      });
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      toast({
        title: "Download failed",
        description: "Unable to generate the QR code",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="share-link" className="text-base font-medium">Shareable Link</Label>
        <div className="flex space-x-2">
          <Input 
            id="share-link"
            value={shareUrl}
            readOnly 
            className="flex-1"
          />
          <Button 
            onClick={copyToClipboard} 
            variant="outline"
            className="flex-shrink-0 hover:bg-primary/10 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Share this link with anyone to view your event
        </p>
      </div>
      
      <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <QrCode size={160} className="mb-4" />
        <Button 
          variant="outline" 
          size="sm"
          onClick={downloadQRCode}
          disabled={isDownloading}
          className="hover:bg-primary/10 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download QR Code'}
        </Button>
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <h3 className="font-medium">Visibility Settings</h3>
        <div className="flex items-center space-x-2">
          <Switch id="public-event" />
          <Label htmlFor="public-event">Public Event</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, anyone with the link can view this event without logging in
        </p>
      </div>
    </div>
  );
};

export default ShareLinkTab;

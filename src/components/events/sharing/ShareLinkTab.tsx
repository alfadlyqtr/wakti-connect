
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, QrCode, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

interface ShareLinkTabProps {
  eventId: string;
  slug: string;
}

const ShareLinkTab: React.FC<ShareLinkTabProps> = ({ eventId, slug }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate the full shareable URL with correct /e/ prefix for events
  const shareUrl = slug 
    ? `${window.location.origin}/e/${slug}` 
    : `${window.location.origin}/e/${eventId}`;
  
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
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="share-link">Shareable Link</Label>
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
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
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
      
      <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
        <QrCode size={160} className="mb-4" />
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCode } from '@/components/ui/qr-code';
import { Copy, Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ShareLinksTabProps {
  eventUrl?: string;
  onSendEmail?: (email: string) => void;
}

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({ 
  eventUrl = window.location.href, // Default to current URL
  onSendEmail 
}) => {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('qrcode');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard",
    });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSendEmail && email.trim()) {
      onSendEmail(email.trim());
      setEmail('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this event',
          text: 'I wanted to share this event with you.',
          url: eventUrl,
        });
      } catch (error) {
        console.log('Sharing failed', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Share Your Event</h2>
        <p className="text-muted-foreground">Share this event with others via QR code, direct link, or email.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="link">Direct Link</TabsTrigger>
        </TabsList>
        
        <TabsContent value="qrcode" className="pt-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
            <QRCode value={eventUrl} size={200} />
            <p className="text-sm text-muted-foreground mt-4">
              Scan this QR code to view the event details.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="link" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={eventUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <Button onClick={handleShare} className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Share Event
            </Button>
            
            {onSendEmail && (
              <div className="pt-4 border-t">
                <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
                  <h3 className="text-sm font-medium">Share via Email</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareLinksTab;

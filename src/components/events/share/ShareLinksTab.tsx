
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Link as LinkIcon, Copy, Check, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface ShareLinksTabProps {
  eventId: string;
  shareableLink?: string;
  qrCodeUrl?: string;
  onSendEmail?: (email: string) => void;
}

// Mock function to generate QR code - in production this would call a real service
const generateQrCode = async (url: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would normally return a data URL or image URL from a QR code service
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
};

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({
  eventId,
  shareableLink,
  qrCodeUrl: initialQrCode,
  onSendEmail
}) => {
  const [activeTab, setActiveTab] = useState('qrcode');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  
  // Generate the shareable link (in a real app, this would be from your API)
  const link = shareableLink || `${window.location.origin}/events/${eventId}`;
  
  // Generate QR code when needed
  const handleGenerateQrCode = async () => {
    if (qrCodeUrl) return;
    
    try {
      setIsGenerating(true);
      const code = await generateQrCode(link);
      setQrCodeUrl(code);
    } catch (error) {
      toast({
        title: "Error generating QR code",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate QR code automatically when tab is selected
  useEffect(() => {
    if (activeTab === 'qrcode' && !qrCodeUrl && !isGenerating) {
      handleGenerateQrCode();
    }
  }, [activeTab, qrCodeUrl, isGenerating]);
  
  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      
      toast({
        title: "Link copied",
        description: "The event link has been copied to your clipboard"
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };
  
  // Send email
  const handleSendEmail = () => {
    if (!emailValue) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (onSendEmail) {
      onSendEmail(emailValue);
      setEmailValue('');
      
      toast({
        title: "Invitation sent",
        description: `Email invitation sent to ${emailValue}`
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="qrcode" className="flex items-center gap-1">
            <QrCode className="h-4 w-4" /> QR Code
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" /> Link
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="qrcode" className="py-4">
          <div className="flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <>
                <div className="p-4 bg-white rounded-md border mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="Event QR code" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Share this QR code with your attendees. They can scan it to view and respond to your event.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = 'event-qr-code.png';
                      link.click();
                    }}
                  >
                    Download QR Code
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-8 flex flex-col items-center">
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-center text-muted-foreground">Generating QR code...</p>
                  </>
                ) : (
                  <>
                    <QrCode className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">Failed to generate QR code</p>
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateQrCode}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="link" className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="shareableLink" className="text-sm font-medium">
                Shareable Link
              </Label>
              <div className="flex mt-1.5">
                <Input 
                  id="shareableLink"
                  value={link}
                  readOnly
                  className="rounded-r-none flex-1"
                />
                <Button
                  variant="secondary"
                  className="rounded-l-none px-3"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Share this link directly with your attendees. Anyone with this link can view and respond to your event.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                Share via WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`mailto:?subject=Event Invitation&body=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                Share via Email
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`sms:?body=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                Share via SMS
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailRecipient" className="text-sm font-medium">
                Recipient Email
              </Label>
              <div className="flex mt-1.5 gap-2">
                <Input 
                  id="emailRecipient"
                  type="email"
                  placeholder="email@example.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendEmail}
                >
                  Send Invitation
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Send a direct email invitation to someone who isn't in your contacts. They'll receive a link to view and respond to your event.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareLinksTab;

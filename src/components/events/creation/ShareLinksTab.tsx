
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Link as LinkIcon, Copy, Check, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface ShareLinksTabProps {
  onSendEmail?: (email: string) => void;
}

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({
  onSendEmail
}) => {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  
  // This is a mock link that would be replaced by a real one in production
  const link = `${window.location.origin}/events/invitation/mockid`;
  
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
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="link" className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" /> Link
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
        </TabsList>
        
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

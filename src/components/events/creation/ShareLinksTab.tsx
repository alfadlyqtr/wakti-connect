
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Link as LinkIcon, Copy, Check, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useTranslation } from "react-i18next";

interface ShareLinksTabProps {
  onSendEmail?: (email: string) => void;
}

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({
  onSendEmail
}) => {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const { t } = useTranslation();
  
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
            <LinkIcon className="h-4 w-4" /> {t('events.link')}
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" /> {t('common.email')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="shareableLink" className="text-sm font-medium">
                {t('events.shareableLink')}
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
              {t('events.shareDescription')}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                {t('events.shareWhatsApp')}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`mailto:?subject=Event Invitation&body=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                {t('events.shareEmail')}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.open(`sms:?body=${encodeURIComponent(`You're invited! ${link}`)}`, '_blank');
                }}
              >
                {t('events.shareSMS')}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailRecipient" className="text-sm font-medium">
                {t('events.recipientEmail')}
              </Label>
              <div className="flex mt-1.5 gap-2">
                <Input 
                  id="emailRecipient"
                  type="email"
                  placeholder={t('events.emailPlaceholder')}
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendEmail}
                >
                  {t('events.sendInvitation')}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('events.emailDescription')}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareLinksTab;


import React, { useState, useRef } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import { ShareTab, SHARE_TABS } from "@/types/form.types";
import { 
  CopyIcon, 
  MailIcon, 
  QrCodeIcon, 
  UsersIcon,
  CheckIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareTabProps {
  activeTab: ShareTab;
  setActiveTab: (tab: ShareTab) => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  handleSendEmail: (email: string) => void;
  eventTitle: string;
  customization: EventCustomization;
}

const ShareTabContent: React.FC<ShareTabProps> = ({
  activeTab,
  setActiveTab,
  recipients,
  addRecipient,
  removeRecipient,
  handleSendEmail,
  eventTitle,
  customization
}) => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const shareableLink = `https://wakti.qa/events/${encodeURIComponent(eventTitle.toLowerCase().replace(/\s+/g, '-'))}-${Date.now().toString(36)}`;

  const handleAddEmail = () => {
    if (!email.trim()) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    addRecipient({
      id: Date.now().toString(),
      name: email,
      email: email,
      type: 'email'
    });
    
    handleSendEmail(email);
    setEmail("");
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          setCopied(true);
          toast({
            title: "Link Copied",
            description: "Shareable link has been copied to clipboard"
          });
          setTimeout(() => setCopied(false), 3000);
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
          toast({
            title: "Copy Failed",
            description: "Could not copy the link. Please try again.",
            variant: "destructive"
          });
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        toast({
          title: "Link Copied",
          description: "Shareable link has been copied to clipboard"
        });
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy the link. Please try again.",
          variant: "destructive"
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    
    link.href = dataURL;
    link.download = `${eventTitle.toLowerCase().replace(/\s+/g, '-')}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setQrDownloaded(true);
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device"
    });
    setTimeout(() => setQrDownloaded(false), 3000);
  };

  return (
    <div className="px-2 sm:px-4 py-2 space-y-4">
      <Alert className="bg-primary/5 border-primary/20">
        <AlertDescription className="text-xs sm:text-sm flex justify-between items-center">
          <span>
            Share your event with others and track responses
          </span>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ShareTab)} className="space-y-4">
        <TabsList className="flex justify-between bg-muted/40 w-full">
          <TabsTrigger value={SHARE_TABS.RECIPIENTS} className="text-xs flex gap-1 items-center px-2 py-1.5 sm:px-3 sm:py-2">
            <MailIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "sr-only" : ""}>Email</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs flex gap-1 items-center px-2 py-1.5 sm:px-3 sm:py-2">
            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "sr-only" : ""}>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value={SHARE_TABS.LINKS} className="text-xs flex gap-1 items-center px-2 py-1.5 sm:px-3 sm:py-2">
            <CopyIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "sr-only" : ""}>Link</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="text-xs flex gap-1 items-center px-2 py-1.5 sm:px-3 sm:py-2">
            <QrCodeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "sr-only" : ""}>QR Code</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={SHARE_TABS.RECIPIENTS}>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  className="text-xs sm:text-sm"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddEmail}
                disabled={!email.trim()}
                size={isMobile ? "sm" : "default"}
              >
                Add
              </Button>
            </div>

            {recipients.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Recipients</Label>
                <div className="flex flex-wrap gap-1.5">
                  {recipients.map((recipient, index) => (
                    <Badge 
                      key={recipient.id} 
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-1.5 text-xs"
                    >
                      {recipient.email || recipient.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-3.5 w-3.5 ml-0.5 rounded-full"
                        onClick={() => removeRecipient(index)}
                      >
                        <span className="sr-only">Remove</span>
                        <span aria-hidden="true">×</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-3 text-center text-muted-foreground">
                <p className="text-xs sm:text-sm">No recipients added yet.</p>
                <p className="text-xs mt-1">Add email addresses to invite people to your event.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="min-h-[180px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-xs sm:text-sm">Your contacts will appear here.</p>
              <p className="text-xs mt-1">Add contacts in your account settings to invite them to events.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value={SHARE_TABS.LINKS}>
          <div className="space-y-3">
            <Label htmlFor="share-link" className="text-xs sm:text-sm">Shareable Link</Label>
            <div className="flex space-x-2">
              <Input 
                id="share-link"
                value={shareableLink} 
                readOnly 
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="text-xs sm:text-sm"
              />
              <Button 
                type="button" 
                variant={copied ? "default" : "outline"} 
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0 h-9 w-9"
              >
                {copied ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            
            <div className="pt-1">
              <Alert className="bg-muted/30 border-muted">
                <AlertDescription className="text-[10px] sm:text-xs text-muted-foreground">
                  Anyone with this link can view the event details. They will need to sign up or log in to WAKTI to respond to the invitation.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qr">
          <div className="space-y-3">
            <div className="py-2 flex justify-center" ref={qrCodeRef}>
              <QRCode 
                value={shareableLink}
                size={isMobile ? 140 : 180}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                fgColor={customization.font?.color || "#000000"}
                bgColor={"#ffffff"}
              />
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                variant={qrDownloaded ? "default" : "outline"}
                onClick={downloadQRCode}
                className="w-full sm:w-auto text-xs"
                size={isMobile ? "sm" : "default"}
              >
                {qrDownloaded ? (
                  <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <QrCodeIcon className="h-3.5 w-3.5 mr-1.5" />
                )}
                Download QR Code
              </Button>
            </div>
            
            <Alert className="bg-muted/30 border-muted">
              <AlertDescription className="text-[10px] sm:text-xs text-muted-foreground">
                Share this QR code with your contacts. When scanned, it will direct them to the event page where they can view details and respond.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareTabContent;

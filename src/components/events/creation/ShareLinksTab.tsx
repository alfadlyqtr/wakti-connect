
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QRCode } from "@/components/ui/qr-code";
import { Check, Copy, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareLinksTabProps {
  eventId?: string;
  shareLink?: string;
  onSendEmail: (email: string) => void;
}

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({
  eventId,
  shareLink = "https://wakti.app/events/share",
  onSendEmail,
}) => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareTab, setShareTab] = useState("link");
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copied",
      description: "The share link was copied to your clipboard",
    });
  };
  
  const handleSendEmail = () => {
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }
    
    onSendEmail(email);
    setEmail("");
    
    toast({
      title: "Email sent",
      description: `Invitation sent to ${email}`,
    });
  };
  
  return (
    <div>
      <Tabs value={shareTab} onValueChange={setShareTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="link">Share Link</TabsTrigger>
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Share via Link</h3>
            <p className="text-sm text-muted-foreground">
              Copy and share this link with others to view your event
            </p>
            
            <div className="flex items-center space-x-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="qrcode" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Share via QR Code</h3>
            <p className="text-sm text-muted-foreground">
              Scan this QR code to access the event
            </p>
            
            <div className="flex justify-center p-4">
              <QRCode value={shareLink} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Share via Email</h3>
            <p className="text-sm text-muted-foreground">
              Send an email invitation
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSendEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareLinksTab;

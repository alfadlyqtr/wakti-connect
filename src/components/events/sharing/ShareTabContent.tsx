
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationRecipient } from '@/types/invitation.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SHARE_TABS, ShareTab } from '@/types/form.types';
import { Check, Copy, Mail, Phone, Share, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import QRCode from 'react-qr-code';
import { toast } from '@/components/ui/use-toast';

export interface ShareTabContentProps {
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  shareTab: ShareTab;
  setShareTab: (tab: ShareTab) => void;
  eventTitle: string;
  onSendEmail: (email: string) => void;
}

const ShareTabContent: React.FC<ShareTabContentProps> = ({
  recipients,
  addRecipient,
  removeRecipient,
  shareTab,
  setShareTab,
  eventTitle,
  onSendEmail
}) => {
  const [email, setEmail] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const shareUrl = window.location.origin + '/events/sharing/' + Math.random().toString(36).substring(2, 8);
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    onSendEmail(email);
    
    // Clear the input
    setEmail('');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Sharing link has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={shareTab} onValueChange={(value) => setShareTab(value as ShareTab)} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value={SHARE_TABS.RECIPIENTS}>Recipients</TabsTrigger>
            <TabsTrigger value={SHARE_TABS.LINK}>Share Link</TabsTrigger>
            <TabsTrigger value={SHARE_TABS.QRCODE}>QR Code</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={SHARE_TABS.RECIPIENTS}>
          <Card>
            <CardHeader>
              <CardTitle>Add Recipients</CardTitle>
              <CardDescription>
                Invite people to your event "{eventTitle || 'Event'}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      className="pl-8"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit">Add</Button>
              </form>
              
              {recipients.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="divide-y">
                    {recipients.map((recipient, index) => (
                      <div key={recipient.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {recipient.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{recipient.name}</div>
                            <div className="text-sm text-muted-foreground">{recipient.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecipient(index)}
                          aria-label="Remove recipient"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="mx-auto h-8 w-8 mb-2" />
                  <p>No recipients added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value={SHARE_TABS.LINK}>
          <Card>
            <CardHeader>
              <CardTitle>Share via Link</CardTitle>
              <CardDescription>
                Share this link with anyone you want to invite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input value={shareUrl} readOnly className="font-mono" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value={SHARE_TABS.QRCODE}>
          <Card>
            <CardHeader>
              <CardTitle>Share via QR Code</CardTitle>
              <CardDescription>
                Scan this QR code to access the event details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="border p-4 rounded-lg bg-white">
                <QRCode
                  value={shareUrl}
                  size={200}
                  level="H"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Scanning this QR code will take you to the event page.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => handleCopyLink()}>
                Copy Event Link
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareTabContent;

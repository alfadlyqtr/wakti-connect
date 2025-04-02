
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2, Trash } from "lucide-react";
import { InvitationRecipient } from "@/types/invitation.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SHARE_TABS } from "@/types/form.types";

interface ShareTabContentProps {
  recipients?: InvitationRecipient[];
  addRecipient?: (recipient: InvitationRecipient) => void;
  removeRecipient?: (index: number) => void;
}

const ShareTabContent: React.FC<ShareTabContentProps> = ({
  recipients = [],
  addRecipient,
  removeRecipient
}) => {
  return (
    <div className="p-4">
      <Tabs defaultValue={SHARE_TABS.RECIPIENTS}>
        <TabsList className="w-full">
          <TabsTrigger value={SHARE_TABS.RECIPIENTS}>Recipients</TabsTrigger>
          <TabsTrigger value={SHARE_TABS.LINK}>Invite Link</TabsTrigger>
          <TabsTrigger value={SHARE_TABS.QRCODE}>QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value={SHARE_TABS.RECIPIENTS} className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="font-medium">Invite People</h3>
            {recipients.length > 0 ? (
              <div className="space-y-2">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={recipient.name} />
                        <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">{recipient.email}</p>
                      </div>
                    </div>
                    {removeRecipient && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeRecipient(index)} 
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recipients added yet.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value={SHARE_TABS.LINK} className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="font-medium">Share with Link</h3>
            <div className="flex space-x-2">
              <Input 
                value="https://wakti.app/event/invite/abc123" 
                readOnly 
                className="text-sm"
              />
              <Button size="sm" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Anyone with the link can view this event. Recipients will need to sign up to respond.</p>
          </div>
        </TabsContent>
        
        <TabsContent value={SHARE_TABS.QRCODE} className="space-y-4 mt-4">
          <div className="space-y-2">
            <h3 className="font-medium">QR Code</h3>
            <div className="bg-white p-4 flex justify-center">
              <div className="border border-muted p-2 w-48 h-48 flex items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">QR Code Placeholder</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareTabContent;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types/event.types";
import { WhatsAppShare } from "./WhatsAppShare";
import { EventQRCode } from "./EventQRCode";
import { Button } from "@/components/ui/button";
import { Copy, Link } from "lucide-react";
import { toast } from "sonner";

interface EventShareOptionsProps {
  event: Event;
}

const EventShareOptions: React.FC<EventShareOptionsProps> = ({ event }) => {
  // Use a placeholder URL until real sharing functionality is implemented
  const shareUrl = `https://wakti.app/events/${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Share Event</h3>
        
        <Tabs defaultValue="link">
          <TabsList className="mb-4">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="border rounded-md flex-1 p-2 bg-muted/30 text-sm truncate">
                {shareUrl}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Share this link with anyone you want to invite to this event.
            </div>
          </TabsContent>
          
          <TabsContent value="qrcode">
            <EventQRCode event={event} shareUrl={shareUrl} />
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Share this event via WhatsApp with your contacts.
              </p>
              <WhatsAppShare event={event} shareUrl={shareUrl} className="w-full" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EventShareOptions;

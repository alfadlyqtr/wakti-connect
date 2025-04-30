
import React from "react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event.types";
import { formatDate } from "@/utils/dateUtils";

interface WhatsAppShareProps {
  event: Event;
  shareUrl: string;
  className?: string;
}

export const WhatsAppShare: React.FC<WhatsAppShareProps> = ({
  event,
  shareUrl,
  className
}) => {
  const handleShare = () => {
    const message = `🎉 You're invited to: ${event.title}
📅 ${formatDate(event.start_time)}${event.is_all_day ? ' (All day)' : ''}
${event.location ? `📍 ${event.location}` : ''}
${event.description ? `\n${event.description}\n` : ''}
RSVP here: ${shareUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <Button 
      onClick={handleShare} 
      className={className}
      variant="outline"
      type="button"
    >
      Share via WhatsApp
    </Button>
  );
};

export default WhatsAppShare;

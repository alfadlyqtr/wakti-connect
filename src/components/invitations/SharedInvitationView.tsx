
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSharedInvitation } from "@/services/invitation/simple-invitations";
import { SimpleInvitation } from "@/types/invitation-simple.types";
import { formatDateTime } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const SharedInvitationView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [invitation, setInvitation] = useState<SimpleInvitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!shareId) return;
      
      try {
        setIsLoading(true);
        const data = await getSharedInvitation(shareId);
        setInvitation(data);
      } catch (error) {
        console.error("Error loading invitation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [shareId]);

  const handleAddToCalendar = () => {
    if (!invitation?.datetime) return;
    
    const title = encodeURIComponent(invitation.title);
    const details = encodeURIComponent(invitation.description || "");
    const location = encodeURIComponent(invitation.location || "");
    const dates = formatCalendarDate(invitation.datetime);
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleUrl, "_blank");
  };

  const formatCalendarDate = (dateStr: string) => {
    // Format date for Google Calendar
    const date = new Date(dateStr);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 1); // Default 1 hour event
    
    return `${formatGoogleCalendarDate(date)}/${formatGoogleCalendarDate(endDate)}`;
  };

  const formatGoogleCalendarDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: invitation?.title || "Invitation",
          text: invitation?.description || "Check out this invitation!",
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Invitation Not Found</h2>
        <p className="text-muted-foreground">
          This invitation may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  // Determine background style based on type
  const backgroundStyle = {
    backgroundColor: invitation.background_type === "solid" ? invitation.background_value : undefined,
    backgroundImage: 
      invitation.background_type === "gradient" ? invitation.background_value : 
      invitation.background_type === "image" ? `url(${invitation.background_value})` : 
      undefined,
  };

  // Determine text style
  const textStyle = {
    fontFamily: invitation.font_family,
    fontSize: invitation.font_size,
    color: invitation.text_color,
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-center"
      style={backgroundStyle}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{
          backgroundColor: invitation.background_type === "solid" ? undefined : "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="text-center space-y-6" style={textStyle}>
          <h1 className="text-3xl font-bold">{invitation.title}</h1>
          
          {invitation.datetime && (
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDateTime(invitation.datetime)}</span>
            </div>
          )}
          
          {invitation.description && (
            <p className="whitespace-pre-wrap">{invitation.description}</p>
          )}
          
          {invitation.location && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{invitation.location}</span>
              </div>
              
              {invitation.location_url && (
                <a 
                  href={invitation.location_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    Get Directions
                  </Button>
                </a>
              )}
            </div>
          )}
          
          <div className="flex justify-center gap-3 pt-4">
            {invitation.datetime && (
              <Button onClick={handleAddToCalendar} variant="secondary">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}
            
            <Button onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-8 text-xs opacity-60" style={textStyle}>
          Made with WAKTI
        </div>
      </div>
    </div>
  );
};

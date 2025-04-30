
import React from "react";
import { formatDateTime } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { SimpleInvitation } from "@/types/invitation-simple.types";

interface InvitationPreviewProps {
  invitation: Partial<SimpleInvitation>;
}

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ invitation }) => {
  const {
    title = "Invitation Title",
    description = "Enter a description for your invitation",
    datetime,
    location,
    location_url,
    background_type = "solid",
    background_value = "#ffffff",
    font_family = "Inter, sans-serif",
    font_size = "16px",
    text_color = "#000000",
  } = invitation;

  // Determine background style based on type
  const backgroundStyle = {
    backgroundColor: background_type === "solid" ? background_value : undefined,
    backgroundImage: 
      background_type === "gradient" ? background_value : 
      background_type === "image" ? `url(${background_value})` : 
      undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // Determine text style
  const textStyle = {
    fontFamily: font_family,
    fontSize: font_size,
    color: text_color,
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-full">
      <div className="text-center mb-2 text-sm text-muted-foreground">Preview</div>
      <div 
        className="rounded-lg overflow-hidden shadow-lg w-full aspect-[4/5]"
        style={backgroundStyle}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="text-center space-y-4" style={textStyle}>
            <h2 className="font-bold text-2xl">{title}</h2>
            
            {datetime && (
              <div className="font-medium">
                {formatDateTime(datetime)}
              </div>
            )}
            
            {description && (
              <p className="mt-4 whitespace-pre-wrap">{description}</p>
            )}
            
            {location && (
              <div className="mt-4 flex flex-col items-center">
                <p className="font-medium flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {location}
                </p>
                
                {location_url && (
                  <a 
                    href={location_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2"
                  >
                    <Button size="sm" variant="outline">
                      Get Directions
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div className="text-center text-xs opacity-50" style={textStyle}>
            Made with WAKTI
          </div>
        </div>
      </div>
    </div>
  );
};


import React from "react";
import { InvitationStyle } from "@/types/invitation.types";
import InvitationCard from "./InvitationCard";

interface InvitationPreviewProps {
  style: InvitationStyle;
  appointment: any;
  headerImage?: string;
  mapLocation?: string;
  layoutSize?: 'small' | 'medium' | 'large';
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  style,
  appointment,
  headerImage,
  mapLocation,
  layoutSize = 'medium'
}) => {
  // Sample appointment data for preview if not provided
  const previewAppointment = appointment || {
    id: 'preview-123',
    title: 'Sample Event',
    description: 'This is a preview of your invitation. Customize to see changes in real-time.',
    location: '123 Event Place, City',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    is_all_day: false
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview</h3>
      
      <div className="rounded-lg border bg-muted/30 p-6 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <InvitationCard
            appointment={previewAppointment}
            invitationId="preview"
            style={style}
            recipientName="Preview User"
            showRespond={true}
            headerImage={headerImage}
            mapLocation={mapLocation}
            layoutSize={layoutSize}
            onRespond={() => {}}
          />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        This is a preview. The actual invitation may appear slightly different depending on the recipient's device.
      </div>
    </div>
  );
};

export default InvitationPreview;

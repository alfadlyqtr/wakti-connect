
import React from 'react';
import { SimpleInvitationCustomization } from '@/types/invitation.types';
import InvitationCardPreview from './InvitationCardPreview';

interface InvitationPreviewProps {
  title?: string;
  description?: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  customization: SimpleInvitationCustomization;
  isEvent?: boolean;
}

export default function InvitationPreview({
  title,
  description,
  location,
  locationTitle,
  date,
  time,
  customization,
  isEvent = false
}: InvitationPreviewProps) {
  // Format date and time if both are provided
  const formattedDateTime = date && time 
    ? new Date(`${date}T${time}`).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : date 
      ? new Date(date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  return (
    <div className="w-full max-w-md mx-auto">
      <InvitationCardPreview
        customization={customization}
        title={title}
        description={description}
        location={location}
        date={formattedDateTime}
        hasLocation={!!location}
        isEvent={isEvent}
      />
    </div>
  );
}

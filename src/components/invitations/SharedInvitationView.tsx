
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedInvitation } from '@/services/invitation/simple-invitations';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InvitationPreview from './InvitationPreview';

export default function SharedInvitationView() {
  const { shareId } = useParams<{ shareId: string }>();
  
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['shared-invitation', shareId],
    queryFn: () => shareId ? getSharedInvitation(shareId) : Promise.resolve(null),
    enabled: !!shareId
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="p-8 w-full max-w-lg text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 w-full max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Invitation Not Found</h2>
          <p className="text-muted-foreground">
            The invitation you're looking for may have been removed or is no longer available.
          </p>
        </Card>
      </div>
    );
  }

  // Log the invitation data to help with debugging
  console.log("Rendering invitation:", invitation);
  console.log("Location:", invitation.location);
  console.log("Is event:", invitation.isEvent);
  console.log("Button configuration:", invitation.customization?.buttons);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <InvitationPreview
          title={invitation.title}
          description={invitation.description}
          location={invitation.location}
          locationTitle={invitation.locationTitle}
          date={invitation.date}
          time={invitation.time}
          customization={invitation.customization}
          isEvent={invitation.isEvent}
          showActions={true} 
        />
      </div>
    </div>
  );
}

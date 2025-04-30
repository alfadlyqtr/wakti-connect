
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedInvitation } from '@/services/invitation/simple-invitations';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg">
          <div className="text-center space-y-4" style={{ 
            color: invitation.text_color,
            fontFamily: invitation.font_family,
            fontSize: invitation.font_size
          }}>
            <h1 className="text-2xl font-bold">{invitation.title}</h1>
            {invitation.description && (
              <p>{invitation.description}</p>
            )}
            {invitation.datetime && (
              <p className="font-semibold">
                {new Date(invitation.datetime).toLocaleString()}
              </p>
            )}
            {invitation.location && (
              <div className="mt-4 p-4 bg-muted/20 rounded-md">
                <p className="font-medium">Location:</p>
                <p>{invitation.location}</p>
                {invitation.location_url && (
                  <a 
                    href={invitation.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block mt-2"
                  >
                    View on Map
                  </a>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

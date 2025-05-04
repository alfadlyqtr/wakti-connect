
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedInvitation } from '@/services/invitation/operations/invitation-retrieval';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InvitationPreview from './InvitationPreview';
import { Helmet } from 'react-helmet-async';

// Default image for OpenGraph previews
const DEFAULT_OG_IMAGE = 'https://wakti.qa/og-image.png';

export default function SharedInvitationView() {
  const { shareId } = useParams<{ shareId: string }>();
  
  console.log("SharedInvitationView: Attempting to fetch invitation with shareId:", shareId);
  
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['shared-invitation', shareId],
    queryFn: () => {
      if (!shareId) {
        console.error("No shareId provided in URL parameters");
        return Promise.resolve(null);
      }
      
      console.log("Fetching shared invitation with shareId:", shareId);
      return getSharedInvitation(shareId);
    },
    enabled: !!shareId,
    retry: 2
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching shared invitation:", error);
      toast({
        title: "Error",
        description: "Could not load the invitation",
        variant: "destructive"
      });
    } else if (invitation) {
      console.log("Successfully loaded invitation:", invitation.id, invitation.title);
    }
  }, [invitation, error]);

  // Generate preview metadata
  const getMetaTags = () => {
    if (!invitation) return null;
    
    const title = invitation.title || 'Invitation';
    const description = invitation.description || 'You have been invited';
    const imageUrl = DEFAULT_OG_IMAGE;
    const url = `https://wakti.qa/i/${shareId}`;
    
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <Card className="p-8 text-center shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">Loading invitation...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    console.log("SharedInvitationView: No invitation found for shareId:", shareId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <Card className="p-8 w-full max-w-lg mx-auto text-center shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Invitation Not Found</h2>
          <p className="text-muted-foreground">
            The invitation you're looking for may have been removed or is no longer available.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Share ID: {shareId || 'Not provided'}
          </p>
        </Card>
      </div>
    );
  }

  // Determine if this is an event by checking if it has a date
  const isEvent = invitation.isEvent || !!invitation.date;
  console.log("SharedInvitationView: Is this an event?", isEvent, "Event ID:", invitation.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      {getMetaTags()}
      <div className="max-w-2xl mx-auto">
        <div className="transform hover:scale-[1.01] transition-all duration-300">
          <InvitationPreview
            title={invitation.title}
            description={invitation.description}
            location={invitation.location}
            locationTitle={invitation.locationTitle}
            date={invitation.date}
            time={invitation.time}
            customization={invitation.customization}
            isEvent={isEvent}
            showActions={true}
            eventId={invitation.id} // Pass the event ID for response buttons
          />
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedInvitation } from '@/services/invitation/simple-invitations';
import EventCard from '@/components/events/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';

// Default image for OpenGraph previews
const DEFAULT_OG_IMAGE = 'https://wakti.qa/og-image.png';

const SharedEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['shared-invitation', id],
    queryFn: () => id ? getSharedInvitation(id) : Promise.resolve(null),
    enabled: !!id
  });

  // Generate preview metadata
  const getMetaTags = () => {
    if (!invitation) return null;
    
    const title = invitation.title || 'Event';
    const description = invitation.description || 'You are invited to this event';
    const imageUrl = DEFAULT_OG_IMAGE;
    const url = `https://wakti.qa/e/${id}`;
    
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
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="text-center py-12">
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">
              This event could not be found or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      {getMetaTags()}
      <h1 className="text-2xl font-bold mb-6 text-center">Shared Event</h1>
      <EventCard
        event={{
          id: invitation.id,
          title: invitation.title,
          description: invitation.description,
          location: invitation.location,
          location_title: invitation.locationTitle,
          start_time: invitation.date ? `${invitation.date}T${invitation.time || '00:00'}` : '',
          end_time: '',
          is_all_day: !invitation.time,
          status: 'published',
          user_id: invitation.userId,
          created_at: invitation.createdAt,
          updated_at: invitation.updatedAt || '',
          customization: invitation.customization,
          shareId: invitation.shareId || invitation.id // Use shareId if available, otherwise fall back to ID
        }}
      />
    </div>
  );
};

export default SharedEventPage;

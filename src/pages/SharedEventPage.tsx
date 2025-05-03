
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedInvitation } from '@/services/invitation/simple-invitations';
import EventCard from '@/components/events/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateString, formatTimeString } from '@/utils/dateTimeFormatter';
import { generateMapsUrl } from '@/utils/locationUtils';
import { useIsMobile } from '@/hooks/useIsMobile';

// Default image for OpenGraph previews
const DEFAULT_OG_IMAGE = 'https://wakti.qa/og-image.png';

const SharedEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  
  console.log("SharedEventPage: Attempting to fetch event with id:", id);
  
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

  // Format date for display
  const getFormattedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return formatDateString(dateStr);
  };

  // Format time for display
  const getFormattedTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return '';
    const fullDateStr = `${dateStr}T${timeStr}`;
    return formatTimeString(fullDateStr);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center py-12 animate-pulse">
            <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-4"></div>
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading shared event:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <Card className="border-destructive max-w-3xl mx-auto shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">
              This event could not be found or has been removed. (Error: {error.message || "Unknown error"})
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!invitation) {
    console.log("No invitation found for id:", id);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <Card className="border-destructive max-w-3xl mx-auto shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">
              This event could not be found or has been removed. Please check the URL and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("Rendering invitation:", invitation);
  
  // Use either customization background or default gradient
  const getBackgroundStyle = () => {
    if (invitation.customization?.background) {
      const { type, value } = invitation.customization.background;
      if (type === 'image' && value) {
        return {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      } else if (value) {
        return { backgroundColor: value };
      }
    }
    // Default gradient background
    return { 
      backgroundImage: 'linear-gradient(to right, #ee9ca7, #ffdde1)' 
    };
  };

  // Determine text color based on background
  const getTextColor = () => {
    if (invitation.customization?.font?.color) {
      return { color: invitation.customization.font.color };
    }
    
    // Default to white for better readability on gradient backgrounds
    return { color: '#ffffff' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      {getMetaTags()}
      
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden shadow-xl">
          {/* Event Header Section */}
          <div 
            className="p-6 md:p-10 text-white"
            style={getBackgroundStyle()}
          >
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={getTextColor()}>
                {invitation.title}
              </h1>
              
              {invitation.date && (
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 opacity-80" />
                    <span className="opacity-90">{getFormattedDate(invitation.date)}</span>
                  </div>
                  
                  {invitation.time && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 opacity-80" />
                      <span className="opacity-90">{getFormattedTime(invitation.date, invitation.time)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Event Details Section */}
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap">{invitation.description}</p>
            </div>
            
            {invitation.location && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                  <div>
                    {invitation.locationTitle && (
                      <h3 className="font-medium text-base">{invitation.locationTitle}</h3>
                    )}
                    <p className="text-muted-foreground">{invitation.location}</p>
                  </div>
                </div>
                
                <Button 
                  className="mt-2 bg-primary/90 hover:bg-primary text-white w-full sm:w-auto shadow-md"
                  onClick={() => window.open(generateMapsUrl(invitation.location), '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            )}
            
            {/* Calendar Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                className="bg-white/90 border-primary/30 hover:bg-white transition-all shadow-sm"
                onClick={() => {
                  // Add to Calendar functionality would go here
                  alert('Calendar functionality will be implemented soon');
                }}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Created with WAKTI</p>
        </div>
      </div>
    </div>
  );
};

export default SharedEventPage;

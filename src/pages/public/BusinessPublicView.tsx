
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingModalContent } from '@/components/business/landing/booking';
import { Loader2, Calendar, Clock } from 'lucide-react';

const BusinessPublicView: React.FC = () => {
  const { slug, businessId } = useParams<{ slug?: string; businessId?: string }>();
  const [business, setBusiness] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let id = businessId;

        // If we have a slug but no businessId, resolve the slug to an ID
        if (!id && slug) {
          const { data: slugData, error: slugError } = await supabase
            .from('profiles')
            .select('id')
            .eq('slug', slug)
            .single();

          if (slugError) throw new Error('Business not found');
          id = slugData.id;
        }

        if (!id) {
          throw new Error('No business identifier provided');
        }

        // Fetch business profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        // Fetch booking templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('booking_templates')
          .select(`
            *,
            service:service_id (
              name,
              description,
              price
            ),
            staff:staff_assigned_id (
              name
            )
          `)
          .eq('business_id', id)
          .eq('is_published', true);

        if (templatesError) throw templatesError;

        setBusiness(profileData);
        setTemplates(templatesData || []);
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message || 'Failed to load business information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [slug, businessId]);

  const handleBookNow = (template: any) => {
    setSelectedTemplate(template);
    setShowBookingModal(true);
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "The business you're looking for doesn't exist or isn't available."}</p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={business.avatar_url || ''} alt={business.business_name || business.display_name} />
              <AvatarFallback>{(business.business_name || business.display_name || 'B').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{business.business_name || business.display_name}</CardTitle>
              {business.occupation && <CardDescription>{business.occupation}</CardDescription>}
            </div>
          </div>
        </CardHeader>
        
        {business.description && (
          <CardContent>
            <p>{business.description}</p>
          </CardContent>
        )}
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Available Services</h2>
        
        {templates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">This business has no available services for booking at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription>{template.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatDuration(template.duration)}
                    </div>
                    
                    {template.price && (
                      <div className="text-lg font-semibold">
                        ${template.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardContent className="pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => handleBookNow(template)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Book your appointment"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && business && (
            <BookingModalContent
              template={selectedTemplate}
              businessId={business.id}
              onClose={() => setShowBookingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessPublicView;

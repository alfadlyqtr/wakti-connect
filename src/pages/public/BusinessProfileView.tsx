
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Phone, Mail, Instagram, Facebook, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { generateDirectionsUrl, isValidMapsUrl } from "@/utils/locationUtils";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { WhatsappIcon } from "lucide-react";
import BusinessHours from "@/components/business/landing/BusinessHours";
import { BusinessPageSection } from "@/types/business.types";

// Type for business profile data
interface BusinessProfile {
  id: string;
  business_name: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  business_email?: string;
  business_phone?: string;
  business_website?: string;
  business_address?: string;
}

// Type for business social links
interface BusinessSocialLink {
  id: string;
  platform: string;
  url: string;
}

// Type for booking template
interface BookingTemplate {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
  service: {
    name: string;
    description: string | null;
    price: number | null;
  } | null;
  staff: {
    name: string;
  } | null;
}

const BusinessProfileView = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<BusinessSocialLink[]>([]);
  const [bookingTemplates, setBookingTemplates] = useState<BookingTemplate[]>([]);
  const [businessHours, setBusinessHours] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BookingTemplate | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { formatCurrency } = useCurrencyFormat({ businessId });

  // Fetch business profile data
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setIsLoading(true);
        
        if (!businessId) {
          setError("Business not found");
          return;
        }

        // Fetch business profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', businessId)
          .single();
          
        if (profileError) {
          throw profileError;
        }

        if (!profileData) {
          setError("Business not found");
          return;
        }

        setProfile(profileData);

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessId);
          
        if (linksError) {
          throw linksError;
        }

        setSocialLinks(linksData || []);

        // Fetch booking templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('booking_templates')
          .select(`
            *,
            service:service_id (name, description, price),
            staff:staff_assigned_id (name)
          `)
          .eq('business_id', businessId)
          .eq('is_published', true);
          
        if (templatesError) {
          throw templatesError;
        }

        setBookingTemplates(templatesData || []);

        // Fetch business hours
        const { data: hoursData, error: hoursError } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', businessId)
          .single();
          
        if (!hoursError && hoursData) {
          setBusinessHours(hoursData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching business profile:", err);
        setError("Failed to load business information");
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [businessId]);

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
  };

  const handleBookNow = (template: BookingTemplate) => {
    setSelectedTemplate(template);
    setShowBookingModal(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
        <p className="text-muted-foreground">The business profile you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  // Find specific social links
  const instagramLink = socialLinks.find(link => link.platform === 'instagram')?.url;
  const facebookLink = socialLinks.find(link => link.platform === 'facebook')?.url;
  const whatsappLink = socialLinks.find(link => link.platform === 'whatsapp')?.url;
  
  // Create WhatsApp URL
  const getWhatsAppUrl = (phone: string) => {
    // Check if it's already a WhatsApp URL
    if (phone.startsWith('https://wa.me/') || phone.startsWith('https://api.whatsapp.com/')) {
      return phone;
    }
    
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  // Prepare business hours section
  const hoursSection: BusinessPageSection = {
    id: 'business-hours',
    page_id: businessId || '',
    section_type: 'hours',
    section_order: 1,
    section_content: businessHours?.hours ? {
      title: "Business Hours",
      hours: businessHours.hours,
      showCurrentDay: true
    } : undefined,
    is_visible: true
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="text-center mb-8">
        {profile.avatar_url && (
          <div className="mb-4 flex justify-center">
            <img 
              src={profile.avatar_url} 
              alt={profile.business_name || profile.display_name || ""} 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{profile.business_name || profile.display_name || profile.full_name}</h1>
      </div>
      
      {/* Contact Information */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {profile.business_phone && (
          <Button variant="outline" onClick={() => window.open(`tel:${profile.business_phone}`, '_blank')} className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        )}
        
        {profile.business_email && (
          <Button variant="outline" onClick={() => window.open(`mailto:${profile.business_email}`, '_blank')} className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        )}
        
        {whatsappLink && (
          <Button variant="outline" onClick={() => window.open(whatsappLink, '_blank')} className="flex items-center">
            <WhatsappIcon className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        )}
        
        {profile.business_address && (
          <Button 
            variant="outline" 
            onClick={() => window.open(isValidMapsUrl(profile.business_address || '') ? profile.business_address : generateDirectionsUrl(profile.business_address || ''), '_blank')} 
            className="flex items-center"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Directions
          </Button>
        )}
        
        {instagramLink && (
          <Button variant="outline" onClick={() => window.open(instagramLink, '_blank')} className="flex items-center">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
        )}
        
        {facebookLink && (
          <Button variant="outline" onClick={() => window.open(facebookLink, '_blank')} className="flex items-center">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
        )}
      </div>
      
      <Separator className="my-8" />
      
      {/* Business Hours */}
      {businessHours?.hours && businessHours.hours.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Business Hours</h2>
          <BusinessHours section={hoursSection} />
        </div>
      )}
      
      <Separator className="my-8" />
      
      {/* Booking Templates / Services */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Services</h2>
        
        {bookingTemplates.length === 0 ? (
          <p className="text-center text-muted-foreground">No services available for booking at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  
                  {template.description && (
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                  )}
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatDuration(template.duration)}
                    </div>
                    
                    {template.price !== null && (
                      <div className="font-semibold">
                        {formatCurrency(template.price)}
                      </div>
                    )}
                  </div>
                  
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
      
      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Book your appointment"}
            </DialogDescription>
          </DialogHeader>
          
          {/* Placeholder for booking form - will be implemented separately */}
          <div className="space-y-4">
            <p>Our booking system is currently being updated.</p>
            <p>Please contact us directly to schedule an appointment.</p>
            
            <div className="flex flex-wrap gap-3">
              {profile.business_phone && (
                <Button onClick={() => window.open(`tel:${profile.business_phone}`, '_blank')} className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Call to Book
                </Button>
              )}
              
              {profile.business_email && (
                <Button variant="outline" onClick={() => window.open(`mailto:${profile.business_email}`, '_blank')} className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessProfileView;

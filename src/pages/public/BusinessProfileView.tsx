import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, Info, Calendar, Clock, MapPin, Users } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import BusinessHours from "@/components/business/landing/BusinessHours";
import { generateDirectionsUrl } from "@/utils/locationUtils";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";

// Define BookingTemplateWithRelations type
interface BookingTemplateWithRelations {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
  is_published: boolean;
  business_id: string;
  service_id: string | null;
  staff_assigned_id: string | null;
  max_daily_bookings: number | null;
  default_starting_hour: number;
  default_ending_hour: number;
  created_at: string;
  updated_at: string;
  service?: {
    name: string;
    description: string | null;
  } | null;
  staff?: {
    name: string;
  } | null;
}

const BusinessProfileView = () => {
  const { slug, businessId } = useParams<{ slug?: string; businessId?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [bookingTemplates, setBookingTemplates] = useState<BookingTemplateWithRelations[]>([]);
  const { formatCurrency } = useCurrencyFormat();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('profiles').select('*');
        
        if (businessId) {
          query = query.eq('id', businessId);
        } else if (slug) {
          query = query.eq('slug', slug);
        } else {
          throw new Error("No business identifier provided");
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          console.error("Error fetching business profile:", error);
          setError("Could not find the business profile");
          return;
        }
        
        setProfile(data);
        
        // Fetch booking templates with all fields
        const { data: templatesData, error: templatesError } = await supabase
          .from('booking_templates')
          .select(`
            *,
            service:service_id (name, description),
            staff:staff_assigned_id (name)
          `)
          .eq('business_id', data.id)
          .eq('is_published', true);
          
        if (templatesError) {
          console.error("Error fetching booking templates:", templatesError);
        } else if (templatesData) {
          setBookingTemplates(templatesData as BookingTemplateWithRelations[]);
        }
        
      } catch (err) {
        console.error("Exception during profile fetch:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [slug, businessId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
        <p className="text-muted-foreground">Sorry, we couldn't find the business you're looking for.</p>
      </div>
    );
  }

  // Make sure business profile exists
  if (profile.account_type !== "business") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Not a Business Profile</h1>
        <p className="text-muted-foreground">This profile is not a business account.</p>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = profile.business_phone;
    const message = `Hello, I would like to inquire about your services.`;

    if (phoneNumber) {
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    } else {
      alert('WhatsApp number not available.');
    }
  };

  return (
    <div className="pb-12">
      {/* Hero section with business name */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {profile.business_name || "Business Profile"}
          </h1>
          {profile.business_type && (
            <p className="text-xl text-white/80 mt-2">{profile.business_type}</p>
          )}
        </div>
      </section>

      <SectionContainer className="mb-12">
        {/* Business Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  About Us
                </CardTitle>
                <CardDescription>
                  Business Details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.business_address && (
                  <div className="prose max-w-none">
                    <p>{profile.business_address}</p>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.business_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{profile.business_email}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.business_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profile.business_phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.business_website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={profile.business_website.startsWith('http') ? profile.business_website : `https://${profile.business_website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.business_website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.id ? (
                  <BusinessHours businessHours={[]} />
                ) : (
                  <p className="text-muted-foreground">Please contact us for our business hours</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
      
      {/* Services Section */}
      {bookingTemplates.length > 0 && (
        <SectionContainer>
          <SectionHeading
            title="Our Services"
            subtitle="Explore our services and book an appointment today"
            centered={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingTemplates.map((template) => (
              <Card key={template.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                  {template.service?.name && (
                    <CardDescription>{template.service.name}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{template.description || "No description available."}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{template.duration} Minutes</span>
                  </div>
                  {template.price !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatCurrency(template.price)}</span>
                    </div>
                  )}
                  {template.staff?.name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{template.staff.name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  {profile.business_address && (
                    <a
                      href={generateDirectionsUrl(`https://www.google.com/maps?q=${encodeURIComponent(profile.business_address)}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Get Directions
                    </a>
                  )}
                  <Button variant="primary">Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Contact Section */}
      <SectionContainer>
        <SectionHeading
          title="Contact Us"
          subtitle="Get in touch with us"
          centered={true}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.business_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <a
                    href={generateDirectionsUrl(`https://www.google.com/maps?q=${encodeURIComponent(profile.business_address)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.business_address}
                  </a>
                </div>
              )}
              {profile.business_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>{profile.business_phone}</span>
                </div>
              )}
              {profile.business_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <a href={`mailto:${profile.business_email}`} className="text-blue-600 hover:underline">
                    {profile.business_email}
                  </a>
                </div>
              )}
              {profile.business_website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <a
                    href={profile.business_website.startsWith('http') ? profile.business_website : `https://${profile.business_website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.business_website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleWhatsAppClick}>
                <FaWhatsapp className="mr-2" />
                Contact via WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </div>
  );
};

export default BusinessProfileView;

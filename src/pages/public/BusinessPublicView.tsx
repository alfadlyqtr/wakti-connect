
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, Info } from "lucide-react";
import BusinessBookingTemplatesSection from "@/components/business/landing/sections/BusinessBookingTemplatesSection";
import { Tables } from "@/integrations/supabase/types";

const BusinessPublicView = () => {
  const { slug, businessId } = useParams<{ slug?: string; businessId?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

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
                <p className="text-muted-foreground">Please contact us for our business hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
      
      {/* Services/Booking section */}
      <SectionContainer>
        <SectionHeading
          title="Our Services"
          subtitle="Book an appointment with us"
          centered={true}
        />
        
        <BusinessBookingTemplatesSection 
          content={{
            title: "Available Services",
            subtitle: "Book your appointment today",
            description: "Browse our services and book your appointment online"
          }}
          businessId={profile.id}
        />
      </SectionContainer>
    </div>
  );
};

export default BusinessPublicView;

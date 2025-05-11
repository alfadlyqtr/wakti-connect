
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { generateDirectionsUrl, isValidMapsUrl } from "@/utils/locationUtils";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import BusinessHours from "@/components/business/landing/BusinessHours";
import { BusinessPageSection } from "@/types/business.types";

interface BusinessProfile {
  id: string;
  full_name: string;
  business_name: string;
  display_name: string;
  avatar_url: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  slug: string | null;
}

interface BookingService {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  currency: string;
  is_active: boolean;
}

const BusinessProfileView = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BookingService[]>([]);
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const formatCurrency = useCurrencyFormat();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!businessId) return;

      setIsLoading(true);
      try {
        // Fetch business profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, full_name, business_name, display_name, avatar_url, description, phone, email, instagram_url, facebook_url, whatsapp_number, google_maps_url, slug"
          )
          .eq("id", businessId)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching business profile:", profileError);
          return;
        }

        setProfile(profileData);

        // Fetch business hours
        const { data: hoursData, error: hoursError } = await supabase
          .from("business_hours")
          .select("*")
          .eq("business_id", businessId)
          .order("day_of_week", { ascending: true });

        if (!hoursError && hoursData) {
          setBusinessHours(hoursData);
        }

        // Fetch booking services
        const { data: servicesData, error: servicesError } = await supabase
          .from("booking_services")
          .select("id, business_id, name, description, duration, price, currency, is_active")
          .eq("business_id", businessId)
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (!servicesError && servicesData) {
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-24 w-24 animate-pulse rounded-full bg-muted"></div>
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-muted"></div>
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold">Business not found</h2>
          <p className="mt-2 text-muted-foreground">
            The business profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const displayName = profile.business_name || profile.display_name || profile.full_name;
  const businessInitials = (displayName || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  const formatWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={profile.avatar_url || ""} alt={displayName} />
          <AvatarFallback className="text-xl font-medium">
            {businessInitials}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-3xl font-bold leading-tight">{displayName}</h1>
        {profile.description && (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {profile.description}
          </p>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Services Section */}
          {services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col space-y-2 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge variant="outline">
                        {service.duration} min
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-medium">
                        {formatCurrency(service.price, service.currency)}
                      </span>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Business Hours */}
          {businessHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <BusinessHours businessHours={businessHours} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.phone && (
                <a
                  href={`tel:${formatPhoneForLink(profile.phone)}`}
                  className="flex items-center text-foreground hover:text-primary"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{profile.phone}</span>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center text-foreground hover:text-primary"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{profile.email}</span>
                </a>
              )}

              {profile.whatsapp_number && (
                <a
                  href={formatWhatsAppLink(profile.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-foreground hover:text-green-600"
                >
                  <FaWhatsapp className="mr-2 h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              )}

              {profile.google_maps_url && isValidMapsUrl(profile.google_maps_url) && (
                <a
                  href={generateDirectionsUrl(profile.google_maps_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-foreground hover:text-red-600"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Get Directions</span>
                </a>
              )}

              <Separator />

              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-foreground hover:text-pink-600"
                >
                  <FaInstagram className="mr-2 h-4 w-4" />
                  <span>Instagram</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}

              {profile.facebook_url && (
                <a
                  href={profile.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-foreground hover:text-blue-600"
                >
                  <FaFacebook className="mr-2 h-4 w-4" />
                  <span>Facebook</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileView;

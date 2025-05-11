
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { BusinessSocialLink, SocialPlatform, BusinessHour } from '@/types/business.types';
import { Json } from '@/integrations/supabase/types';
import BusinessHours from '@/components/business/landing/BusinessHours';
import SocialIconsGroup from '@/components/business/landing/SocialIconsGroup';

interface BusinessProfileData {
  id: string;
  full_name: string;
  display_name?: string;
  business_name?: string;
  avatar_url?: string;
  business_website?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
}

const BusinessPublicView = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [businessData, setBusinessData] = useState<BusinessProfileData | null>(null);
  const [socialLinks, setSocialLinks] = useState<BusinessSocialLink[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);

        // Fetch business profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', businessId)
          .single();

        if (profileError) {
          throw new Error(`Error fetching profile: ${profileError.message}`);
        }

        setBusinessData(profileData);

        // Fetch business social links
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from('business_social_links')
          .select('*')
          .eq('business_id', businessId);

        if (socialLinksError) {
          console.error('Error fetching social links:', socialLinksError);
        } else {
          // Map raw social links to the correct type
          const typedSocialLinks: BusinessSocialLink[] = socialLinksData.map(link => ({
            ...link,
            platform: link.platform as SocialPlatform
          }));
          setSocialLinks(typedSocialLinks);
        }

        // Fetch business hours
        const { data: hoursData, error: hoursError } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', businessId);

        if (hoursError) {
          console.error('Error fetching business hours:', hoursError);
        } else if (hoursData && hoursData.length > 0) {
          // Parse hours JSON and map to BusinessHour[]
          try {
            if (Array.isArray(hoursData[0].hours)) {
              // Transform the JSON hours data to BusinessHour[] format
              const parsedHours: BusinessHour[] = hoursData[0].hours.map((hourData: any) => ({
                id: hourData.id || `hour-${Math.random().toString(36).substring(2, 9)}`,
                business_id: businessId,
                day_of_week: hourData.day_of_week,
                is_open: hourData.is_open,
                opening_time: hourData.opening_time,
                closing_time: hourData.closing_time
              }));
              
              setBusinessHours(parsedHours);
            }
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
          }
        }
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [businessId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-lg">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
          <p className="text-muted-foreground">
            {error || "We couldn't find the business profile you're looking for."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            {businessData.avatar_url && (
              <img
                src={businessData.avatar_url}
                alt={businessData.business_name || businessData.full_name}
                className="rounded-full w-20 h-20 object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {businessData.business_name || businessData.full_name}
              </h1>
              {businessData.display_name && (
                <p className="text-muted-foreground">{businessData.display_name}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {businessData.business_address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.business_address}</span>
            </div>
          )}
          {businessData.business_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.business_phone}</span>
            </div>
          )}
          {businessData.business_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.business_email}</span>
            </div>
          )}
          {businessData.business_website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={
                  businessData.business_website.startsWith('http')
                    ? businessData.business_website
                    : `https://${businessData.business_website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {businessData.business_website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links Section */}
      {socialLinks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect with Us</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialIconsGroup
              socialLinks={socialLinks}
              style="default"
              size="default"
              position="footer"
            />
          </CardContent>
        </Card>
      )}

      {/* Business Hours Section - only render if hours exist */}
      {businessHours.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <BusinessHours businessHours={businessHours} />
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mx-auto"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default BusinessPublicView;


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PublicBusinessProfile } from '@/services/profile/getPublicProfile';
import { Instagram, Facebook, MapPin, MessageSquare } from 'lucide-react';

interface SocialLinksProps {
  profile: PublicBusinessProfile;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ profile }) => {
  const hasLinks = 
    profile.business_whatsapp || 
    profile.business_whatsapp_business || 
    profile.business_instagram || 
    profile.business_facebook || 
    profile.business_google_maps;
  
  if (!hasLinks) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Social & Messaging</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(profile.business_whatsapp || profile.business_whatsapp_business) && (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-green-600" />
            <a 
              href={`https://wa.me/${(profile.business_whatsapp_business || profile.business_whatsapp || '').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              WhatsApp {profile.business_whatsapp_business ? '(Business)' : ''}
            </a>
          </div>
        )}
        
        {profile.business_instagram && (
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-600" />
            <a 
              href={`https://instagram.com/${profile.business_instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {profile.business_instagram}
            </a>
          </div>
        )}
        
        {profile.business_facebook && (
          <div className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-blue-600" />
            <a 
              href={profile.business_facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook Page
            </a>
          </div>
        )}
        
        {profile.business_google_maps && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-600" />
            <a 
              href={profile.business_google_maps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinks;

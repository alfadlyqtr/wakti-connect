
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PublicBusinessProfile } from '@/services/profile/getPublicProfile';
import { Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactSectionProps {
  profile: PublicBusinessProfile;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const hasContactInfo = profile.business_email || profile.business_phone || profile.business_website;
  
  if (!hasContactInfo) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.business_email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`mailto:${profile.business_email}`} 
              className="text-blue-600 hover:underline"
            >
              {profile.business_email}
            </a>
          </div>
        )}
        
        {profile.business_phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`tel:${profile.business_phone}`}
              className="text-blue-600 hover:underline"
            >
              {profile.business_phone}
            </a>
          </div>
        )}
        
        {profile.business_website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={profile.business_website.startsWith('http') 
                ? profile.business_website 
                : `https://${profile.business_website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {profile.business_website}
            </a>
          </div>
        )}
        
        {profile.business_email && (
          <Button className="w-full mt-2" variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSection;

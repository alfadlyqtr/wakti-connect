
import React from 'react';
import { Card } from '@/components/ui/card';
import { PublicBusinessProfile } from '@/services/profile/getPublicProfile';
import ProfileHeader from './ProfileHeader';
import ContactSection from './ContactSection';
import SocialLinks from './SocialLinks';
import BusinessHoursDisplay from './BusinessHoursDisplay';
import BookingTemplatesSection from './BookingTemplatesSection';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessProfileViewProps {
  profile: PublicBusinessProfile;
}

const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({ profile }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.business_name} - Business Profile`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      <div className="grid gap-6">
        <ProfileHeader profile={profile} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <ContactSection profile={profile} />
          <SocialLinks profile={profile} />
        </div>
        
        {profile.business_hours && (
          <BusinessHoursDisplay businessHours={profile.business_hours} />
        )}
        
        {profile.business_chatbot_enabled && profile.business_chatbot_code && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">TMW AI Chatbot</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-muted-foreground">
                This business offers an AI chatbot for assistance.
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: profile.business_chatbot_code }}
                className="mt-2"
              />
            </div>
          </Card>
        )}
        
        {profile.booking_templates && profile.booking_templates.length > 0 && (
          <BookingTemplatesSection templates={profile.booking_templates} businessId={profile.id} />
        )}
      </div>
    </div>
  );
};

export default BusinessProfileView;

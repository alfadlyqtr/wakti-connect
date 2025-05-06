
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Define a BusinessProfile type interface for usage within this component
interface BusinessProfile {
  id?: string;
  business_name: string;
  display_name?: string;
  avatar_url?: string;
  account_type?: string;
}

interface BusinessPageHeaderProps {
  business: Partial<BusinessProfile>;
  isPreviewMode?: boolean;
  isAuthenticated: boolean | null;
}

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode = false,
  isAuthenticated = null
}) => {
  const navigate = useNavigate();

  // Handle scrolling to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="flex flex-col items-center justify-between py-6 md:flex-row">
      <div className="flex items-center mb-4 md:mb-0">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src={business.avatar_url || ''} alt={business.display_name} />
          <AvatarFallback>{getInitials(business.display_name || business.business_name || '')}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{business.display_name || business.business_name}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {!isPreviewMode && (
          <>
            <Button variant="outline" onClick={scrollToContact}>
              Contact Us
            </Button>
            <Button 
              onClick={() => navigate(`/booking/${business.id}`)}
              disabled={!business.id}
            >
              Book Now
            </Button>
          </>
        )}
        {isPreviewMode && (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm">
            Preview Mode
          </div>
        )}
      </div>
    </header>
  );
};

export default BusinessPageHeader;

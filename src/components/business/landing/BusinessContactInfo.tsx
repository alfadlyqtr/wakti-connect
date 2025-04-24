
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGoogleMapsUrl } from "@/config/maps";

interface BusinessContactInfoProps {
  section: BusinessPageSection;
}

const BusinessContactInfo = ({ section }: BusinessContactInfoProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Contact Information",
    address = "",
    phone = "",
    email = "",
    website = "",
    coordinates = ""
  } = content;
  
  // Generate the Google Maps directions URL
  const getDirectionsUrl = () => {
    if (coordinates) {
      try {
        const coords = JSON.parse(coordinates);
        if (coords.lat && coords.lng) {
          return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
        }
      } catch (e) {
        console.error("Error parsing coordinates:", e);
      }
    }
    
    // Fallback to address
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };
  
  return (
    <div style={{
      backgroundColor: section.background_color,
      color: section.text_color,
      padding: section.padding === 'none' ? '0' : 
              section.padding === 'sm' ? '1rem' : 
              section.padding === 'md' ? '2rem' : 
              section.padding === 'lg' ? '3rem' : 
              section.padding === 'xl' ? '4rem' : '1rem',
      borderRadius: section.border_radius === 'none' ? '0' : 
                    section.border_radius === 'small' ? '0.25rem' : 
                    section.border_radius === 'medium' ? '0.5rem' : 
                    section.border_radius === 'large' ? '0.75rem' : 
                    section.border_radius === 'full' ? '9999px' : '0.5rem',
      backgroundImage: section.background_image_url ? `url(${section.background_image_url})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {address && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">{address}</p>
                  
                  {(address || coordinates) && (
                    <a 
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline mt-1"
                    >
                      <Navigation className="h-3 w-3 mr-1" /> Get Directions
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {phone && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">
                    <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                  </p>
                </div>
              </div>
            )}
            
            {email && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">
                    <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                  </p>
                </div>
              </div>
            )}
            
            {website && (
              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Website</h3>
                  <p className="text-muted-foreground">
                    <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {website}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContactInfo;

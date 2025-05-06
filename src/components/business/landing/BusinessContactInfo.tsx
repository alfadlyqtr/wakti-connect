
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, Navigation } from "lucide-react";
import BusinessContactForm from "./BusinessContactForm";

interface BusinessContactInfoProps {
  section: BusinessPageSection;
  businessId: string;
  pageId: string;
  submitContactForm: (data: { businessId: string; pageId: string; formData: any }) => Promise<any>;
  primaryColor?: string;
  textColor?: string;
}

const BusinessContactInfo = ({ 
  section, 
  businessId,
  pageId,
  submitContactForm,
  primaryColor,
  textColor
}: BusinessContactInfoProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Contact Us",
    description = "",
    address = "",
    phone = "",
    email = "",
    website = "",
    coordinates = "",
    showContactForm = true
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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${showContactForm ? 'lg:w-1/2' : 'w-full'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
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
          
          {showContactForm && (
            <div className="lg:w-1/2">
              <BusinessContactForm 
                businessId={businessId}
                pageId={pageId}
                submitContactForm={submitContactForm}
                primaryColor={primaryColor}
                textColor={textColor}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessContactInfo;

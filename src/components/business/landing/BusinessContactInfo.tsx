
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

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
    website = ""
  } = content;
  
  return (
    <div>
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

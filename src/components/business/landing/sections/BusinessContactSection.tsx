
import React from "react";

interface BusinessContactSectionProps {
  content: {
    section_title?: string;
    section_description?: string;
    contact_info_style?: string;
    bg_color?: string;
    text_color?: string;
  };
  businessName?: string;
  businessAddress?: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({
  content,
  businessName,
  businessAddress,
  businessPhoneNumber,
  businessEmail
}) => {
  const {
    section_title = "Contact Us",
    section_description = "Get in touch with us for any questions or inquiries.",
    contact_info_style = "simple",
    bg_color = "",
    text_color = ""
  } = content;

  const sectionStyle = {
    backgroundColor: bg_color || "transparent",
    color: text_color || "inherit"
  };

  return (
    <div style={sectionStyle} className="p-6 md:p-10 rounded-lg">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">{section_title}</h2>
        
        {section_description && (
          <p className="text-muted-foreground text-center mb-8">{section_description}</p>
        )}
        
        <div className="space-y-6">
          {businessName && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-medium">{businessName}</h3>
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businessAddress && (
              <div className="flex flex-col items-center text-center p-4">
                <span className="font-medium mb-1">Address</span>
                <span className="text-muted-foreground">{businessAddress}</span>
              </div>
            )}
            
            {businessPhoneNumber && (
              <div className="flex flex-col items-center text-center p-4">
                <span className="font-medium mb-1">Phone</span>
                <a href={`tel:${businessPhoneNumber}`} className="text-muted-foreground hover:text-primary">
                  {businessPhoneNumber}
                </a>
              </div>
            )}
            
            {businessEmail && (
              <div className="flex flex-col items-center text-center p-4">
                <span className="font-medium mb-1">Email</span>
                <a href={`mailto:${businessEmail}`} className="text-muted-foreground hover:text-primary">
                  {businessEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessContactSection;

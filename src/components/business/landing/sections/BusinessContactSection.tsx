
import React from "react";

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ content, businessId }) => {
  const { 
    title = "Contact Us",
    description = "Get in touch with us",
    email = "",
    phone = "",
    address = "",
    showContactForm = true,
    showMap = false,
    mapLocation = ""
  } = content;
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              {email && (
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">
                    <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                  </p>
                </div>
              )}
              
              {phone && (
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-muted-foreground">
                    <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                  </p>
                </div>
              )}
              
              {address && (
                <div>
                  <p className="font-medium">Address:</p>
                  <p className="text-muted-foreground">{address}</p>
                </div>
              )}
            </div>
          </div>
          
          {showContactForm ? (
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
              <p className="text-muted-foreground mb-4">
                You need to be subscribed to send a direct message.
              </p>
              {/* This would be where a contact form would go */}
              <button 
                className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 font-medium hover:bg-primary/90 transition-colors"
                onClick={() => {/* Subscribe logic would go here */}}
              >
                Subscribe to message
              </button>
            </div>
          ) : showMap && mapLocation ? (
            <div className="bg-card rounded-lg shadow-sm p-6 h-64">
              <h3 className="text-xl font-semibold mb-4">Our Location</h3>
              <div className="h-full bg-muted rounded flex items-center justify-center">
                <p className="text-muted-foreground">Map would be displayed here</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;

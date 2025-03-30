
import React from "react";
import { generateMapEmbedUrl } from "@/config/maps";

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ 
  content, 
  businessId
}) => {
  const { 
    title = "Contact Us",
    description = "Get in touch with us for any inquiries",
    email = "contact@example.com",
    phone = "+1 (555) 123-4567",
    address = "123 Business Street, City, State",
    showMap = true,
    mapUrl = "",
    contactButtonLabel = "Send Message"
  } = content;
  
  // Generate embed URL for Google Maps using the address
  const mapEmbedUrl = address ? generateMapEmbedUrl(address) : mapUrl;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Information */}
          <div className="md:w-1/2 space-y-6">
            <div className="space-y-2">
              {email && (
                <div className="flex items-center space-x-2">
                  <span className="text-primary">✉</span>
                  <a href={`mailto:${email}`} className="hover:text-primary hover:underline">{email}</a>
                </div>
              )}
              
              {phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-primary">☎</span>
                  <a href={`tel:${phone}`} className="hover:text-primary hover:underline">{phone}</a>
                </div>
              )}
              
              {address && (
                <div className="flex items-start space-x-2">
                  <span className="text-primary mt-1">📍</span>
                  <span>{address}</span>
                </div>
              )}
            </div>
            
            {showMap && address && (
              <div className="w-full aspect-video rounded-lg overflow-hidden border">
                <iframe
                  src={mapEmbedUrl}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Google Maps"
                ></iframe>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="bg-muted p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {contactButtonLabel}
                </button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  We'll get back to you as soon as possible
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;

import React, { useState, useEffect } from "react";
import { generateMapEmbedUrl, generateGoogleMapsUrl, getMapsApiKey } from "@/config/maps";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSubmitContactFormMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { sendMessage } from "@/services/messages";

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessId: string;
  pageId: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ 
  content, 
  businessId,
  pageId
}) => {
  const { toast } = useToast();
  const submitContactMutation = useSubmitContactFormMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  
  const { 
    title = "Contact Us",
    description = "Get in touch with us for any inquiries",
    email = "contact@example.com",
    phone = "+1 (555) 123-4567",
    address = "123 Business Street, City, State",
    showMap = true,
    mapUrl = "",
    enableContactForm = true,
    contactFormTitle = "Send us a message",
    contactButtonLabel = "Send Message",
    contactButtonColor = "#3B82F6",
    contactSuccessMessage = "Thank you for your message. We'll get back to you soon!",
    coordinates = "",
    formBackground = "#f5f5f5",
    formBorderRadius = "8px",
    formPadding = "20px",
    inputBorderColor = "#e2e2e2",
    inputBorderRadius = "4px",
    inputBackground = "#ffffff",
    inputTextColor = "#333333",
    labelColor = "#333333",
    layout = "sideBySide"
  } = content;

  useEffect(() => {
    const loadMapUrl = async () => {
      if (!address && !mapUrl && !coordinates) return;
      
      try {
        const apiKey = await getMapsApiKey();
        
        if (coordinates) {
          try {
            const coords = JSON.parse(coordinates);
            if (coords.lat && coords.lng) {
              setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coords.lat},${coords.lng}&zoom=15`);
              return;
            }
          } catch (e) {
            console.error("Error parsing coordinates:", e);
          }
        }
        
        if (address) {
          const encodedLocation = encodeURIComponent(address);
          setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}`);
          return;
        }
        
        if (mapUrl) {
          setMapEmbedUrl(mapUrl);
        }
      } catch (error) {
        console.error('Error generating map URL:', error);
      }
    };
    
    loadMapUrl();
  }, [address, mapUrl, coordinates]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in your name and phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitContactMutation.mutateAsync({
        businessId,
        pageId,
        formData: {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          message: formData.message || null
        }
      });
      
      try {
        const messageContent = `Contact from: ${formData.name} (${formData.phone})`;
        await sendMessage(businessId, messageContent);
      } catch (error) {
        console.log("Error sending message to business inbox:", error);
      }
      
      setShowSuccessMessage(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    
    return generateGoogleMapsUrl(address);
  };

  const renderSectionContent = () => {
    const contactInfo = (
      <div className="space-y-6">
        <div className="space-y-4">
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
          
          {(address || coordinates) && (
            <div className="mt-2">
              <a 
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <span className="mr-1">📍</span> Get Directions
              </a>
            </div>
          )}
        </div>
        
        {showMap && (address || coordinates || mapUrl) && (
          <div className="w-full aspect-video rounded-lg overflow-hidden border">
            {mapEmbedUrl && (
              <iframe
                src={mapEmbedUrl}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Google Maps"
              ></iframe>
            )}
          </div>
        )}
      </div>
    );
    
    const contactForm = enableContactForm && (
      <div 
        style={{ 
          backgroundColor: formBackground,
          borderRadius: formBorderRadius,
          padding: formPadding
        }}
        className="shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: labelColor }}>
          {contactFormTitle || "Send us a message"}
        </h3>
        
        {showSuccessMessage ? (
          <div className="p-4 bg-green-100 text-green-800 rounded-md">
            {contactSuccessMessage || "Thank you for your message. We'll get back to you soon!"}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: labelColor }}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ 
                  borderColor: inputBorderColor, 
                  borderRadius: inputBorderRadius,
                  backgroundColor: inputBackground,
                  color: inputTextColor || "#333333"
                }}
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: labelColor }}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ 
                  borderColor: inputBorderColor, 
                  borderRadius: inputBorderRadius,
                  backgroundColor: inputBackground,
                  color: inputTextColor || "#333333"
                }}
                placeholder="Your phone number"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: labelColor }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ 
                  borderColor: inputBorderColor, 
                  borderRadius: inputBorderRadius,
                  backgroundColor: inputBackground,
                  color: inputTextColor || "#333333"
                }}
                placeholder="Your email"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: labelColor }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                style={{ 
                  borderColor: inputBorderColor, 
                  borderRadius: inputBorderRadius,
                  backgroundColor: inputBackground,
                  color: inputTextColor || "#333333"
                }}
                placeholder="Your message"
              ></textarea>
            </div>
            
            <Button
              type="submit"
              className="w-full py-2 px-4 rounded-md hover:opacity-90 transition-colors"
              style={{ backgroundColor: contactButtonColor || '#3B82F6', color: '#ffffff' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : (contactButtonLabel || "Send Message")}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              We'll get back to you as soon as possible
            </p>
          </form>
        )}
      </div>
    );
    
    if (layout === "formTop") {
      return (
        <div className="space-y-8">
          {enableContactForm && contactForm}
          {contactInfo}
        </div>
      );
    } else if (layout === "formBottom") {
      return (
        <div className="space-y-8">
          {contactInfo}
          {enableContactForm && contactForm}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">{contactInfo}</div>
          {enableContactForm && <div className="md:w-1/2">{contactForm}</div>}
        </div>
      );
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-75">{description}</p>
        </div>
        
        {renderSectionContent()}
      </div>
    </section>
  );
};

export default BusinessContactSection;


import React, { useState } from "react";
import { generateMapEmbedUrl } from "@/config/maps";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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
    coordinates = ""
  } = content;
  
  // Generate embed URL for Google Maps using the address
  let mapEmbedUrl = address ? generateMapEmbedUrl(address) : mapUrl;
  
  // If we have coordinates, use those instead for more accuracy
  if (coordinates) {
    try {
      const coords = JSON.parse(coordinates);
      if (coords.lat && coords.lng) {
        mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC2jZm5YJNa0zIYTydPB6qGXjLLrQiW_GI&q=${coords.lat},${coords.lng}&zoom=15`;
      }
    } catch (e) {
      console.error("Error parsing coordinates:", e);
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all the fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit the contact form data to Supabase
      const { error } = await supabase.from('business_contact_submissions').insert({
        business_id: businessId,
        page_id: pageId,
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setShowSuccessMessage(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      // Hide success message after 5 seconds
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
    <section className="py-12 md:py-16" style={{
      backgroundColor: content.background_color,
      color: content.text_color,
      padding: content.padding === 'none' ? '0' : 
              content.padding === 'sm' ? '1rem' : 
              content.padding === 'md' ? '2rem' : 
              content.padding === 'lg' ? '3rem' : 
              content.padding === 'xl' ? '4rem' : '2rem',
      borderRadius: content.border_radius === 'none' ? '0' : 
                    content.border_radius === 'small' ? '0.25rem' : 
                    content.border_radius === 'medium' ? '0.5rem' : 
                    content.border_radius === 'large' ? '0.75rem' : 
                    content.border_radius === 'full' ? '9999px' : '0.5rem',
      backgroundImage: content.background_image_url ? `url(${content.background_image_url})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
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
            
            {showMap && (address || coordinates) && (
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
          {enableContactForm && (
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{contactFormTitle || "Send us a message"}</h3>
                
                {showSuccessMessage ? (
                  <div className="p-4 bg-green-100 text-green-800 rounded-md">
                    {contactSuccessMessage || "Thank you for your message. We'll get back to you soon!"}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Your message"
                        required
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;

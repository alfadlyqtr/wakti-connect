import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { generateMapEmbedUrl, generateDirectionsUrl } from "@/config/maps";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ 
  content,
  businessId  
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const {
    title = "Contact Us",
    phone = "",
    email: contactEmail = "",
    address = "",
    showMap = true,
    showContactForm = true,
    showLocationPin = true
  } = content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send message to business
      const { error } = await supabase.from("messages").insert({
        sender_id: null, // Guest user
        recipient_id: businessId,
        content: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      });
      
      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully."
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGetDirections = () => {
    if (!address) return;
    
    // If we have user location, use it for directions
    if (userLocation) {
      const directionsUrl = generateDirectionsUrl(address, userLocation.lat, userLocation.lng);
      window.open(directionsUrl, '_blank');
    } else {
      // Otherwise just open Google Maps with the destination
      const directionsUrl = generateDirectionsUrl(address);
      window.open(directionsUrl, '_blank');
    }
  };
  
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Found",
            description: "Your current location has been detected."
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your current location."
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser."
      });
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Contact Information */}
          <div className="space-y-6">
            {phone && (
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a href={`tel:${phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            
            {contactEmail && (
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </div>
            )}
            
            {address && (
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">{address}</p>
                  <div className="flex mt-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGetDirections}
                    >
                      Get Directions
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleGetCurrentLocation}
                    >
                      Use My Location
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Map */}
          {showMap && address && (
            <div className="mt-8">
              <iframe
                title="Business Location"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: '0.5rem' }}
                src={generateMapEmbedUrl(address)}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        
        {/* Contact Form */}
        {showContactForm && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessContactSection;

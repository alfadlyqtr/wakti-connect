
import React, { useState } from "react";
import { generateMapEmbedUrl, generateGoogleMapsUrl } from "@/config/maps";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { sendMessage } from "@/services/messages";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Navigation } from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ 
  content, 
  businessId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Check if user is authenticated
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };
    
    checkAuth();
  }, []);

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
  
  // Form definition
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  // Generate embed URL for Google Maps using the address
  const mapEmbedUrl = address ? generateMapEmbedUrl(address) : mapUrl;
  
  // Generate directions URL for Google Maps
  const directionsUrl = address ? generateGoogleMapsUrl(address) : "";

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Create a Google Maps URL with directions from current location to business
        if (address) {
          const encodedAddress = encodeURIComponent(address);
          const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&origin=${latitude},${longitude}`;
          window.open(directionUrl, '_blank');
        }
        
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setGettingLocation(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to send a message",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format message for inbox
      const messageContent = `Contact Form: ${data.name} (${data.email}): ${data.message}`;
      
      // Send message to business inbox
      await sendMessage(businessId, messageContent);
      
      // Reset form
      form.reset();
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the business",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            </div>
            
            {/* Location Actions */}
            {address && (
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open(directionsUrl, '_blank')}
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                >
                  <Navigation className="h-4 w-4" />
                  {gettingLocation ? 'Getting Location...' : 'Navigate from Here'}
                </Button>
              </div>
            )}
            
            {/* Map */}
            {showMap && address && (
              <div className="w-full aspect-video rounded-lg overflow-hidden border shadow-sm mt-4">
                <iframe
                  src={mapEmbedUrl}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Google Maps"
                  aria-label={`Location of ${title}`}
                ></iframe>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="bg-muted/20 p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : contactButtonLabel}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      You need to be signed in to send a message
                    </p>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;

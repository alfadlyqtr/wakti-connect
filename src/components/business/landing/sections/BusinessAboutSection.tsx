
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Send, Loader2 } from "lucide-react";
import { BusinessSocialLink } from "@/types/business.types";
import SocialIconsGroup from "../SocialIconsGroup";

interface BusinessAboutSectionProps {
  content: Record<string, any>;
  businessId?: string;
  pageId?: string;
  primaryColor?: string;
  submitContactForm?: (data: any) => Promise<any>;
  socialLinks?: BusinessSocialLink[];
}

const BusinessAboutSection: React.FC<BusinessAboutSectionProps> = ({ 
  content,
  businessId,
  pageId,
  primaryColor,
  submitContactForm,
  socialLinks
}) => {
  const { 
    title = "About Us",
    description = "Learn more about our business and what we do.",
    content: aboutContent = "",
    image,
    showMessageForm = false,
    messageFormTitle = "Send us a message",
    messageInputPlaceholder = "Type your message here..."
  } = content;

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !message) {
      toast({
        title: "Missing information",
        description: "Please provide your name, phone number and a message.",
        variant: "destructive"
      });
      return;
    }

    if (!businessId || !pageId || !submitContactForm) {
      console.error("Cannot submit form: missing required props");
      toast({
        title: "Cannot send message",
        description: "There was a configuration error. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await submitContactForm({
        businessId,
        pageId,
        formData: {
          name,
          phone,
          message,
          email: null
        }
      });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We'll get back to you soon."
      });
      
      // Clear form
      setName("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Message submission error:", error);
      toast({
        title: "Message failed",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create button style if primaryColor is provided
  const buttonStyle = primaryColor ? {
    backgroundColor: primaryColor,
    borderColor: primaryColor
  } : {};

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {image && (
            <div className="md:w-1/2">
              <img 
                src={image} 
                alt="About us" 
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
            </div>
          )}
          
          <div className={image ? "md:w-1/2" : "w-full"}>
            <div className="prose max-w-none dark:prose-invert">
              {aboutContent ? (
                <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
              ) : (
                <p className="text-muted-foreground">
                  Information about the business will be displayed here.
                </p>
              )}
            </div>

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
                <SocialIconsGroup 
                  socialLinks={socialLinks}
                  style="colored"
                  size="default"
                  position="footer"
                  className="justify-start"
                />
              </div>
            )}
            
            {showMessageForm && submitContactForm && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">{messageFormTitle}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input 
                      placeholder="Your phone number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder={messageInputPlaceholder} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={buttonStyle}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessAboutSection;


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateIcon } from "lucide-react";
import { SectionType } from "@/types/business.types";
import { cn } from "@/lib/utils";

interface SectionTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sectionType: SectionType;
  onSelect: (templateContent: Record<string, any>) => void;
}

const SectionTemplateDialog: React.FC<SectionTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  sectionType,
  onSelect,
}) => {
  // Predefined templates for different section types
  const templates: Record<SectionType, Record<string, Record<string, any>>> = {
    header: {
      "professional": {
        title: "Welcome to Our Business",
        subtitle: "Your Trusted Partner in Excellence",
        description: "We provide premium services designed to exceed your expectations.",
        button_text: "Learn More",
        button_link: "#about",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "modern": {
        title: "Innovate. Create. Deliver.",
        subtitle: "Transforming Ideas into Reality",
        description: "Join us on a journey to revolutionize your industry with cutting-edge solutions.",
        button_text: "Get Started",
        button_link: "#services",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "bold": {
        title: "STAND OUT.",
        subtitle: "MAKE AN IMPACT",
        description: "Bold strategies for businesses that refuse to be average.",
        button_text: "Work With Us",
        button_link: "#contact",
        background_color: "#212529",
        text_color: "#ffffff"
      },
      "minimalist": {
        title: "Simply Better",
        subtitle: "Elegant Solutions",
        description: "Less complexity. More results.",
        button_text: "Explore",
        button_link: "#gallery",
        background_color: "#ffffff",
        text_color: "#000000"
      }
    },
    about: {
      "story": {
        title: "Our Story",
        content: "Founded in 2010, we began with a vision to transform how businesses approach their challenges. Over the years, we've grown from a small team of passionate individuals to an industry leader serving clients worldwide.",
        image_position: "right",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "mission": {
        title: "Our Mission & Values",
        content: "We're driven by a commitment to excellence, integrity, and innovation. Our mission is to provide exceptional value to our clients through personalized service and forward-thinking solutions.",
        image_position: "left",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "team": {
        title: "Meet Our Team",
        content: "Behind every successful project is our dedicated team of experts. With diverse backgrounds and specialties, we bring a wealth of knowledge and experience to every challenge.",
        image_position: "bottom",
        background_color: "#f1f5f9",
        text_color: "#334155"
      },
      "approach": {
        title: "Our Approach",
        content: "We believe in a collaborative process that puts your needs at the center. By understanding your goals and challenges, we develop tailored solutions that deliver measurable results.",
        image_position: "top",
        background_color: "#ffffff",
        text_color: "#1e293b"
      }
    },
    contact: {
      "simple": {
        title: "Contact Us",
        description: "Get in touch with us for any inquiries",
        email: "contact@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business Street, City, State",
        showMap: true,
        contactFormTitle: "Send us a message",
        contactButtonLabel: "Send Message",
        contactButtonColor: "#3B82F6",
        formBackground: "#f5f5f5",
        formBorderRadius: "8px",
        layout: "sideBySide"
      },
      "modern": {
        title: "Get In Touch",
        description: "We'd love to hear from you! Reach out using the form below.",
        email: "hello@yourbusiness.com",
        phone: "+1 (123) 456-7890",
        address: "1234 Modern Ave, Suite 100, City, Country",
        showMap: true,
        contactFormTitle: "Send your message",
        contactButtonLabel: "Submit",
        contactButtonColor: "#6366F1",
        formBackground: "#ffffff",
        formBorderRadius: "12px",
        inputBorderRadius: "8px",
        inputBorderColor: "#e5e7eb",
        inputBackground: "#f9fafb",
        labelColor: "#4B5563",
        layout: "sideBySide"
      },
      "minimal": {
        title: "Contact",
        description: "We're here to help",
        email: "support@company.com",
        phone: "+1 (800) 123-4567",
        address: "100 Business Park, Floor 2, City",
        showMap: false,
        contactFormTitle: "Message Us",
        contactButtonLabel: "Send",
        contactButtonColor: "#000000",
        formBackground: "#ffffff",
        formBorderRadius: "0px",
        inputBorderRadius: "0px",
        inputBorderColor: "#000000",
        inputBackground: "#ffffff",
        labelColor: "#000000",
        layout: "formTop"
      },
      "colorful": {
        title: "Say Hello!",
        description: "We love hearing from our customers",
        email: "hello@brand.co",
        phone: "+1 (555) 987-6543",
        address: "500 Creative Avenue, City, State",
        showMap: true,
        contactFormTitle: "Drop Us a Line",
        contactButtonLabel: "Send it!",
        contactButtonColor: "#8B5CF6",
        formBackground: "#F5F3FF",
        formBorderRadius: "16px",
        inputBorderRadius: "8px",
        inputBorderColor: "#C4B5FD",
        inputBackground: "#ffffff",
        labelColor: "#6D28D9",
        layout: "formBottom"
      }
    },
    gallery: {
      "grid": {
        title: "Our Gallery",
        description: "Explore our portfolio of work",
        layout: "grid",
        columns: "3",
        gap: "medium",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "masonry": {
        title: "Project Showcase",
        description: "A collection of our finest work",
        layout: "masonry",
        columns: "4",
        gap: "small",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "carousel": {
        title: "Featured Works",
        description: "Swipe through our highlighted projects",
        layout: "carousel",
        show_dots: true,
        show_arrows: true,
        background_color: "#ffffff",
        text_color: "#000000"
      },
      "minimal": {
        title: "Portfolio",
        description: "Clean presentation of our work",
        layout: "grid",
        columns: "2",
        gap: "large",
        background_color: "#f1f1f1",
        text_color: "#333333"
      }
    },
    hours: {
      "standard": {
        title: "Business Hours",
        description: "When you can find us",
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed",
        layout: "standard",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "compact": {
        title: "When We're Open",
        description: "Drop by during these hours",
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "9:00 AM - 6:00 PM",
        thursday: "9:00 AM - 6:00 PM",
        friday: "9:00 AM - 6:00 PM",
        saturday: "11:00 AM - 4:00 PM",
        sunday: "Closed",
        layout: "compact",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "modern": {
        title: "Hours of Operation",
        description: "We look forward to serving you",
        monday: "8:00 AM - 8:00 PM",
        tuesday: "8:00 AM - 8:00 PM",
        wednesday: "8:00 AM - 8:00 PM",
        thursday: "8:00 AM - 8:00 PM",
        friday: "8:00 AM - 10:00 PM",
        saturday: "9:00 AM - 10:00 PM",
        sunday: "10:00 AM - 6:00 PM",
        layout: "modern",
        background_color: "#f1f5f9",
        text_color: "#334155"
      },
      "minimal": {
        title: "Hours",
        description: "",
        monday: "9-5",
        tuesday: "9-5",
        wednesday: "9-5",
        thursday: "9-5",
        friday: "9-5",
        saturday: "Closed",
        sunday: "Closed",
        layout: "minimal",
        background_color: "#ffffff",
        text_color: "#000000"
      }
    },
    testimonials: {
      "cards": {
        title: "Client Testimonials",
        description: "What our clients say about us",
        layout: "cards",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "quotes": {
        title: "Voices of Satisfaction",
        description: "Read what clients have experienced working with us",
        layout: "quotes",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "carousel": {
        title: "Customer Reviews",
        description: "Swipe through feedback from our valued clients",
        layout: "carousel",
        background_color: "#f1f5f9",
        text_color: "#334155"
      },
      "minimalist": {
        title: "Testimonials",
        description: "Client experiences",
        layout: "minimal",
        background_color: "#ffffff",
        text_color: "#000000"
      }
    },
    booking: {
      "standard": {
        title: "Book Our Services",
        description: "Schedule an appointment with us",
        button_text: "Book Now",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "featured": {
        title: "Premium Services",
        description: "Book our most popular services",
        button_text: "Reserve Now",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "simple": {
        title: "Book an Appointment",
        description: "Fast and easy booking",
        button_text: "Schedule",
        background_color: "#f1f5f9",
        text_color: "#334155"
      },
      "highlight": {
        title: "Special Offers",
        description: "Limited time availability - book now",
        button_text: "Claim Offer",
        background_color: "#fff7ed",
        text_color: "#7c2d12"
      }
    },
    instagram: {
      "standard": {
        title: "Follow Us on Instagram",
        description: "Stay updated with our latest posts",
        username: "@yourbusiness",
        post_count: "6",
        background_color: "#ffffff",
        text_color: "#333333"
      },
      "minimal": {
        title: "Instagram",
        description: "Our visual stories",
        username: "@yourbrand",
        post_count: "9",
        background_color: "#f8f9fa",
        text_color: "#212529"
      },
      "gallery": {
        title: "Instagram Gallery",
        description: "A glimpse into our world",
        username: "@company",
        post_count: "8",
        background_color: "#f1f5f9",
        text_color: "#334155"
      },
      "highlight": {
        title: "Featured on Instagram",
        description: "Our most popular posts",
        username: "@business",
        post_count: "4",
        background_color: "#fdf2f8",
        text_color: "#831843"
      }
    }
  };

  // Get templates for the current section type
  const sectionTemplates = templates[sectionType] || {};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
          <DialogDescription>
            Choose a template for your {sectionType} section. You can customize it further after applying.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {Object.entries(sectionTemplates).map(([id, template]) => (
            <div 
              key={id}
              className={cn(
                "border rounded-lg p-4 hover:border-primary cursor-pointer transition-all",
                "flex flex-col"
              )}
              onClick={() => {
                onSelect(template);
                onOpenChange(false);
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TemplateIcon className="h-5 w-5 text-primary" />
                <h3 className="font-medium capitalize">{id}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 flex-1">
                {template.description || template.content || template.subtitle || "Customizable template"}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.background_color && (
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: template.background_color }}
                    title="Background color"
                  ></div>
                )}
                
                {template.text_color && (
                  <div 
                    className="w-6 h-6 rounded-full border flex items-center justify-center"
                    style={{ backgroundColor: template.text_color, color: inverseColor(template.text_color) }}
                    title="Text color"
                  >
                    T
                  </div>
                )}
                
                {template.layout && (
                  <span className="text-xs bg-muted px-1 py-0.5 rounded">
                    {template.layout}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to generate a contrasting color for readability
function inverseColor(hex: string): string {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  
  // Convert to RGB
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 125 ? '#000000' : '#ffffff';
}

export default SectionTemplateDialog;

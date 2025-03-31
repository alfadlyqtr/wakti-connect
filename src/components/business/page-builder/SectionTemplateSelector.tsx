
import React from "react";
import { SectionType } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SectionTemplateOption {
  id: string;
  name: string;
  description: string;
  content: any;
}

interface SectionTemplateSelectorProps {
  sectionType: SectionType;
  onSelect: (content: any) => void;
}

const SectionTemplateSelector: React.FC<SectionTemplateSelectorProps> = ({ 
  sectionType, 
  onSelect 
}) => {
  // Define templates based on section type
  const getTemplates = (): SectionTemplateOption[] => {
    switch (sectionType) {
      case 'header':
        return [
          {
            id: 'simple',
            name: 'Simple Header',
            description: 'A clean, minimal header with title and subtitle',
            content: {
              title: 'Business Name',
              subtitle: 'Your tagline here',
              showButton: true,
              buttonText: 'Book Now'
            }
          },
          {
            id: 'detailed',
            name: 'Detailed Header',
            description: 'Header with title, subtitle and description',
            content: {
              title: 'Business Name',
              subtitle: 'Professional Services',
              description: 'We provide top-quality services to meet all your needs.',
              showButton: true,
              buttonText: 'Get Started'
            }
          }
        ];
        
      case 'about':
        return [
          {
            id: 'story',
            name: 'Our Story',
            description: 'Share your business journey',
            content: {
              title: 'Our Story',
              content: '<p>Founded in [year], our business has grown from a small idea to a trusted brand.</p>'
            }
          },
          {
            id: 'team',
            name: 'About Our Team',
            description: 'Introduce your team members',
            content: {
              title: 'Meet Our Team',
              content: '<p>Our experienced team is dedicated to providing excellent service.</p>'
            }
          }
        ];
        
      case 'contact':
        return [
          {
            id: 'basic',
            name: 'Basic Contact',
            description: 'Simple contact information',
            content: {
              title: 'Contact Us',
              description: 'We would love to hear from you!',
              email: 'contact@example.com',
              phone: '+1 (123) 456-7890',
              enableContactForm: true,
              contactFormTitle: 'Send us a message',
              contactButtonLabel: 'Send Message',
              contactButtonColor: '#3B82F6'
            }
          },
          {
            id: 'full',
            name: 'Full Contact Details',
            description: 'Complete contact information with address and map',
            content: {
              title: 'Get In Touch',
              description: 'We\'re here to answer any questions you might have.',
              email: 'contact@example.com',
              phone: '+1 (123) 456-7890',
              address: '123 Business Street, City, Country',
              showMap: true,
              enableContactForm: true,
              contactFormTitle: 'Send us a message',
              contactButtonLabel: 'Send Message',
              contactButtonColor: '#3B82F6',
              contactSuccessMessage: 'Thank you for your message. We\'ll get back to you soon!'
            }
          }
        ];
        
      case 'hours':
        return [
          {
            id: 'standard',
            name: 'Standard Hours',
            description: 'Monday-Friday business hours',
            content: {
              title: 'Business Hours',
              hours: {
                monday: { open: "09:00", close: "17:00", closed: false },
                tuesday: { open: "09:00", close: "17:00", closed: false },
                wednesday: { open: "09:00", close: "17:00", closed: false },
                thursday: { open: "09:00", close: "17:00", closed: false },
                friday: { open: "09:00", close: "17:00", closed: false },
                saturday: { open: "10:00", close: "15:00", closed: false },
                sunday: { open: "10:00", close: "15:00", closed: true }
              }
            }
          },
          {
            id: 'extended',
            name: 'Extended Hours',
            description: 'Extended evening and weekend hours',
            content: {
              title: 'Our Working Hours',
              hours: {
                monday: { open: "08:00", close: "20:00", closed: false },
                tuesday: { open: "08:00", close: "20:00", closed: false },
                wednesday: { open: "08:00", close: "20:00", closed: false },
                thursday: { open: "08:00", close: "20:00", closed: false },
                friday: { open: "08:00", close: "22:00", closed: false },
                saturday: { open: "09:00", close: "22:00", closed: false },
                sunday: { open: "10:00", close: "18:00", closed: false }
              }
            }
          }
        ];
        
      case 'gallery':
        return [
          {
            id: 'basic-gallery',
            name: 'Simple Gallery',
            description: 'A basic gallery layout',
            content: {
              title: 'Our Gallery',
              description: 'Check out our work',
              images: []
            }
          },
          {
            id: 'portfolio',
            name: 'Portfolio Gallery',
            description: 'Gallery with image captions',
            content: {
              title: 'Portfolio',
              description: 'Showcasing our best work',
              showCaptions: true,
              images: []
            }
          }
        ];
        
      case 'testimonials':
        return [
          {
            id: 'basic-testimonials',
            name: 'Simple Testimonials',
            description: 'Basic testimonials layout',
            content: {
              title: 'Customer Testimonials',
              description: 'What our clients say about us',
              testimonials: [
                {
                  name: 'John Smith',
                  position: 'Customer',
                  text: 'Great service and excellent quality work!',
                  rating: 5
                },
                {
                  name: 'Jane Doe',
                  position: 'Client',
                  text: 'Very professional and timely service.',
                  rating: 5
                }
              ]
            }
          },
          {
            id: 'detailed-testimonials',
            name: 'Detailed Testimonials',
            description: 'Testimonials with avatar and ratings',
            content: {
              title: 'What Our Clients Say',
              description: 'Real feedback from real customers',
              showAvatars: true,
              showRatings: true,
              testimonials: [
                {
                  name: 'John Smith',
                  position: 'Customer',
                  text: 'Great service and excellent quality work!',
                  rating: 5
                },
                {
                  name: 'Jane Doe',
                  position: 'Client',
                  text: 'Very professional and timely service.',
                  rating: 5
                },
                {
                  name: 'Michael Johnson',
                  position: 'Customer',
                  text: 'Exceeded my expectations. Will definitely use again!',
                  rating: 5
                }
              ]
            }
          }
        ];
        
      case 'booking':
        return [
          {
            id: 'basic-booking',
            name: 'Simple Booking Section',
            description: 'Basic booking section',
            content: {
              title: 'Book Our Services',
              description: 'Select from our available services',
              buttonText: 'Book Now'
            }
          },
          {
            id: 'featured-booking',
            name: 'Featured Bookings',
            description: 'Highlight specific services',
            content: {
              title: 'Book Our Popular Services',
              description: 'Choose from our most requested services',
              showFeaturedOnly: true,
              buttonText: 'Book Appointment'
            }
          }
        ];
        
      case 'instagram':
        return [
          {
            id: 'basic-instagram',
            name: 'Instagram Feed',
            description: 'Basic Instagram feed',
            content: {
              title: 'Follow Us on Instagram',
              description: 'Check out our latest posts',
              username: 'yourusername',
              postsCount: 6
            }
          },
          {
            id: 'featured-instagram',
            name: 'Featured Instagram Posts',
            description: 'Show highlighted Instagram posts',
            content: {
              title: 'Our Instagram Highlights',
              description: 'Our most popular content on Instagram',
              username: 'yourusername',
              postsCount: 9,
              showCaptions: true
            }
          }
        ];
        
      default:
        return [];
    }
  };
  
  const templates = getTemplates();
  
  if (templates.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No templates available for this section type.
      </p>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Select a Template:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(template => (
          <Card 
            key={template.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(template.content)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.content);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionTemplateSelector;

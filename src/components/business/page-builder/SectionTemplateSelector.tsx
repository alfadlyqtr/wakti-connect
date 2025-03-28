
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
              phone: '+1 (123) 456-7890',
              email: 'contact@example.com'
            }
          },
          {
            id: 'full',
            name: 'Full Contact Details',
            description: 'Complete contact information with address',
            content: {
              title: 'Get In Touch',
              phone: '+1 (123) 456-7890',
              email: 'contact@example.com',
              address: '123 Business Street, City, Country',
              website: 'www.example.com'
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
        
      // Remove the 'services' case as it's no longer a valid SectionType
        
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

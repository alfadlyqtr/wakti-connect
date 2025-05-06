
import React from "react";
import { SectionType } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface SectionEditorProps {
  section: SectionType;
  updateSection: (section: SectionType) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  updateSection
}) => {
  const handleChange = (key: string, value: any) => {
    updateSection({
      ...section,
      [key]: value
    });
  };

  const handleContentChange = (key: string, value: any) => {
    updateSection({
      ...section,
      content: {
        ...section.content,
        [key]: value
      }
    });
  };

  const handleLayoutChange = (layout: string) => {
    updateSection({
      ...section,
      activeLayout: layout
    });
  };

  // Render form fields based on section type
  const renderSectionFields = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="section-title">Section Title</Label>
          <Input
            id="section-title"
            value={section.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="section-subtitle">Section Subtitle</Label>
          <Input
            id="section-subtitle"
            value={section.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="mt-1"
          />
        </div>

        {section.type === 'header' && (
          <div>
            <Label htmlFor="header-image">Header Image</Label>
            <div className="mt-1 flex items-center gap-2">
              <Button variant="outline" className="w-full">
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              {section.image && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleChange('image', '')}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        )}

        {section.type === 'about' && (
          <div>
            <Label htmlFor="about-description">Description</Label>
            <Textarea
              id="about-description"
              value={section.content.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        )}

        {section.type === 'testimonials' && (
          <>
            <div>
              <Label>Testimonials</Label>
              {(section.content.testimonials || []).map((testimonial: any, index: number) => (
                <div key={index} className="mt-2 p-2 border rounded-md">
                  <Input
                    placeholder="Name"
                    value={testimonial.name}
                    onChange={(e) => {
                      const updatedTestimonials = [...(section.content.testimonials || [])];
                      updatedTestimonials[index] = {
                        ...testimonial,
                        name: e.target.value
                      };
                      handleContentChange('testimonials', updatedTestimonials);
                    }}
                    className="mb-2"
                  />
                  <Input
                    placeholder="Role"
                    value={testimonial.role}
                    onChange={(e) => {
                      const updatedTestimonials = [...(section.content.testimonials || [])];
                      updatedTestimonials[index] = {
                        ...testimonial,
                        role: e.target.value
                      };
                      handleContentChange('testimonials', updatedTestimonials);
                    }}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Testimonial text"
                    value={testimonial.text}
                    onChange={(e) => {
                      const updatedTestimonials = [...(section.content.testimonials || [])];
                      updatedTestimonials[index] = {
                        ...testimonial,
                        text: e.target.value
                      };
                      handleContentChange('testimonials', updatedTestimonials);
                    }}
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  const testimonials = [...(section.content.testimonials || [])];
                  testimonials.push({
                    name: "New Testimonial",
                    role: "Customer",
                    text: "Great service!"
                  });
                  handleContentChange('testimonials', testimonials);
                }}
              >
                Add Testimonial
              </Button>
            </div>
          </>
        )}

        <div className="mt-4">
          <Label>Layout Style</Label>
          <RadioGroup 
            value={section.activeLayout} 
            onValueChange={handleLayoutChange}
            className="grid grid-cols-2 gap-2 mt-2"
          >
            {section.layouts.map((layout) => (
              <div key={layout} className="flex items-center space-x-2 border rounded-md p-2">
                <RadioGroupItem value={layout} id={`layout-${layout}`} />
                <Label htmlFor={`layout-${layout}`} className="capitalize">{layout}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderSectionFields()}
    </div>
  );
};

export default SectionEditor;

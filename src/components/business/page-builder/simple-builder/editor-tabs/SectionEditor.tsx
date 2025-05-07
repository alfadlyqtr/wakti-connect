
import React from "react";
import { SectionType } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SectionEditorProps {
  section: SectionType;
  updateSection: (section: SectionType) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  updateSection
}) => {
  const [uploading, setUploading] = React.useState(false);
  
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      const file = files[0];
      
      // Validate file size (5MB max)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        throw new Error("File size must be less than 5MB");
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${businessId}/${section.type}/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);
      
      // Update section with the new image
      handleChange('image', publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been updated"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setUploading(false);
      // Clear input value so the same file can be selected again
      e.target.value = '';
    }
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

        {(section.type === 'header' || section.type === 'about') && (
          <div>
            <Label htmlFor="section-image">Section Image</Label>
            <div className="mt-1">
              {section.image ? (
                <div className="relative mb-2">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="max-h-40 rounded border" 
                  />
                  <Button
                    variant="destructive" 
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleChange('image', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
              
              <div className="mt-1 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  type="button"
                  disabled={uploading}
                  onClick={() => document.getElementById('section-image-upload')?.click()}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                
                <input 
                  id="section-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        )}

        {section.type === 'about' && (
          <div>
            <Label htmlFor="about-description">Description</Label>
            <Textarea
              id="about-description"
              value={section.content?.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        )}

        {section.type === 'testimonials' && (
          <>
            <div>
              <Label>Testimonials</Label>
              {(section.content?.testimonials || []).map((testimonial: any, index: number) => (
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
                  const testimonials = [...(section.content?.testimonials || [])];
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

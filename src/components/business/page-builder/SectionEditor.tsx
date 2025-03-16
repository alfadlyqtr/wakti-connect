
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SectionEditorProps {
  section: BusinessPageSection;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const queryClient = useQueryClient();
  const [contentData, setContentData] = React.useState(section.section_content || {});
  
  // Update local state from fetched data
  React.useEffect(() => {
    setContentData(section.section_content || {});
  }, [section]);
  
  const updateSection = useMutation({
    mutationFn: async (updates: any) => {
      const { data, error } = await supabase
        .from('business_page_sections')
        .update({
          section_content: updates
        } as any)
        .eq('id', section.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Section updated",
        description: "Your changes have been saved"
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update section",
        description: error.message
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSection = () => {
    updateSection.mutate(contentData);
  };
  
  const renderEditorFields = () => {
    switch (section.section_type) {
      case 'header':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Header Title</Label>
              <Input
                id="title"
                name="title"
                value={contentData.title || ""}
                onChange={handleInputChange}
                placeholder="Welcome to our business"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={contentData.subtitle || ""}
                onChange={handleInputChange}
                placeholder="Book our services online"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={contentData.description || ""}
                onChange={handleInputChange}
                placeholder="Welcome to our business page"
                rows={3}
              />
            </div>
          </>
        );
        
      case 'contact':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                name="title"
                value={contentData.title || ""}
                onChange={handleInputChange}
                placeholder="Contact Information"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={contentData.address || ""}
                onChange={handleInputChange}
                placeholder="123 Business Street, City, Country"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={contentData.phone || ""}
                onChange={handleInputChange}
                placeholder="+123 456 7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={contentData.email || ""}
                onChange={handleInputChange}
                placeholder="contact@yourbusiness.com"
                type="email"
              />
            </div>
          </>
        );
        
      case 'hours':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                name="title"
                value={contentData.title || ""}
                onChange={handleInputChange}
                placeholder="Business Hours"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Configure your business hours in the detailed editor.
            </p>
          </>
        );
        
      case 'about':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                name="title"
                value={contentData.title || ""}
                onChange={handleInputChange}
                placeholder="About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">About Content</Label>
              <Textarea
                id="content"
                name="content"
                value={contentData.content || ""}
                onChange={handleInputChange}
                placeholder="Tell your story and describe your business..."
                rows={5}
              />
            </div>
          </>
        );
        
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={contentData.title || ""}
              onChange={handleInputChange}
              placeholder="Section Title"
            />
            <p className="text-sm text-muted-foreground mt-4">
              Additional settings for this section type are available in the detailed editor.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {renderEditorFields()}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSection}
          disabled={updateSection.isPending}
        >
          {updateSection.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Section
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SectionEditor;

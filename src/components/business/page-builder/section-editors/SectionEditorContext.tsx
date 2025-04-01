
import React, { createContext, useContext, useState } from "react";
import { useUpdateSectionMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { toast } from "@/components/ui/use-toast";
import { BusinessPageSection } from "@/types/business.types";

interface SectionEditorContextType {
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSubmit: () => Promise<void>;
  handleColorChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleListChange: (name: string, list: any[]) => void;
  handleNestedUpdate: (name: string, value: any) => void;
  handleStyleChange: (name: string, value: string) => void;
  contentData: Record<string, any>;
  resetChanges: () => void;
  section: BusinessPageSection;
  moveUp?: () => void;
  moveDown?: () => void;
  duplicate?: () => void;
  toggleVisibility?: () => void;
  deleteSection?: () => void;
  setContentData: (data: Record<string, any>) => void;
  setIsDirty: (value: boolean) => void;
  isNewSection: () => boolean;
  handleSaveSection: () => Promise<void>;
  applyTemplateContent: (templateContent: Record<string, any>) => void;
}

export const SectionEditorContext = createContext<SectionEditorContextType | undefined>(undefined);

export const useSectionEditor = () => {
  const context = useContext(SectionEditorContext);
  if (context === undefined) {
    throw new Error("useSectionEditor must be used within a SectionEditorProvider");
  }
  return context;
};

interface SectionEditorProviderProps {
  children: (context: SectionEditorContextType) => React.ReactNode;
  section: BusinessPageSection;
}

export const SectionEditorProvider: React.FC<SectionEditorProviderProps> = ({ 
  children, 
  section
}) => {
  // State to track form values - ensure we initialize with an empty object if section_content is null
  const [contentData, setContentData] = useState<Record<string, any>>(section.section_content || {});
  const updateSectionMutation = useUpdateSectionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset changes
  const resetChanges = () => {
    setContentData(section.section_content || {});
    setIsDirty(false);
  };
  
  // Check if section is new (empty content)
  const isNewSection = () => {
    return !section.section_content || Object.keys(section.section_content).length === 0;
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  
  // Handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setContentData(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
  };
  
  // Handle color picker changes
  const handleColorChange = (name: string, value: string) => {
    setContentData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  
  // Handle style changes
  const handleStyleChange = (name: string, value: string) => {
    setContentData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setContentData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };
  
  // Handle list changes
  const handleListChange = (name: string, list: any[]) => {
    setContentData(prev => ({ ...prev, [name]: list }));
    setIsDirty(true);
  };
  
  // Handle nested updates
  const handleNestedUpdate = (name: string, value: any) => {
    setContentData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Apply template content
  const applyTemplateContent = (templateContent: Record<string, any>) => {
    console.log('Applying template content:', templateContent);
    
    // Ensure templateContent is not null/undefined
    if (!templateContent) {
      console.error('Template content is null or undefined');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot apply empty template",
      });
      return;
    }
    
    // Define which fields should be applied directly to the section
    const sectionLevelStyleProperties = [
      'background_color',
      'text_color',
      'padding',
      'border_radius',
      'background_image_url'
    ];
    
    // Extract section level styling properties
    const sectionLevelStyles: Record<string, any> = {};
    
    // Separate section level properties
    Object.keys(templateContent).forEach(key => {
      if (sectionLevelStyleProperties.includes(key)) {
        sectionLevelStyles[key] = templateContent[key];
      }
    });
    
    // Update content data with all template content
    setContentData(prevData => ({...prevData, ...templateContent}));
    setIsDirty(true);
    
    console.log('Section level styles to apply:', sectionLevelStyles);
    
    // Apply section level styles directly to the section
    if (Object.keys(sectionLevelStyles).length > 0) {
      updateSectionMutation.mutateAsync({ 
        sectionId: section.id, 
        data: sectionLevelStyles
      }).then(() => {
        // After successful update, notify user
        toast({
          title: "Template Applied",
          description: "Section styling has been updated successfully",
        });
      }).catch(error => {
        console.error('Error applying section styles:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to apply section styling",
        });
      });
    }
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!isDirty) {
      toast({
        title: "No Changes to Save",
        description: "No changes were made to the section.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure contentData is a valid object before saving
      const validContentData = contentData || {};
      
      await updateSectionMutation.mutateAsync({ 
        sectionId: section.id, 
        data: { 
          section_content: validContentData 
        } 
      });
      
      toast({
        title: "Section Updated",
        description: "Your changes have been saved.",
      });
      setIsDirty(false);
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update section. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alias for handleSubmit to make the API more intuitive
  const handleSaveSection = handleSubmit;
  
  const value: SectionEditorContextType = {
    contentData,
    isSubmitting,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
    handleColorChange,
    handleSelectChange,
    handleListChange,
    handleNestedUpdate,
    handleStyleChange,
    resetChanges,
    section,
    setContentData,
    setIsDirty,
    isNewSection,
    handleSaveSection,
    applyTemplateContent
  };
  
  return (
    <SectionEditorContext.Provider value={value}>
      {children(value)}
    </SectionEditorContext.Provider>
  );
};

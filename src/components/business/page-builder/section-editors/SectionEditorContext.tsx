
import React, { createContext, useContext, useState } from "react";
import { useUpdateSectionMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { toast } from "@/components/ui/use-toast";

interface SectionEditorContextType {
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSubmit: () => Promise<void>;
  handleColorChange: (name: string, value: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleListChange: (name: string, list: any[]) => void;
  handleNestedUpdate: (name: string, value: any) => void;
  contentData: Record<string, any>;
  resetChanges: () => void;
}

const SectionEditorContext = createContext<SectionEditorContextType | undefined>(undefined);

export const useSectionEditor = () => {
  const context = useContext(SectionEditorContext);
  if (context === undefined) {
    throw new Error("useSectionEditor must be used within a SectionEditorProvider");
  }
  return context;
};

interface SectionEditorProviderProps {
  children: React.ReactNode;
  sectionId: string;
  initialContent: Record<string, any>;
}

export const SectionEditorProvider: React.FC<SectionEditorProviderProps> = ({ 
  children, 
  sectionId,
  initialContent = {}
}) => {
  // State to track form values
  const [contentData, setContentData] = useState<Record<string, any>>(initialContent);
  const updateSectionMutation = useUpdateSectionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isDirty = JSON.stringify(contentData) !== JSON.stringify(initialContent);
  
  // Reset changes
  const resetChanges = () => {
    setContentData(initialContent);
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setContentData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle color picker changes
  const handleColorChange = (name: string, value: string) => {
    setContentData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setContentData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle list changes
  const handleListChange = (name: string, list: any[]) => {
    setContentData(prev => ({ ...prev, [name]: list }));
  };
  
  // Handle nested updates
  const handleNestedUpdate = (name: string, value: any) => {
    setContentData(prev => ({ ...prev, [name]: value }));
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
      await updateSectionMutation.mutateAsync({ 
        sectionId, 
        data: { 
          section_content: contentData 
        } 
      });
      
      toast({
        title: "Section Updated",
        description: "Your changes have been saved.",
      });
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
  
  const value = {
    contentData,
    isSubmitting,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
    handleColorChange,
    handleSelectChange,
    handleListChange,
    handleNestedUpdate,
    resetChanges
  };
  
  return (
    <SectionEditorContext.Provider value={value}>
      {children}
    </SectionEditorContext.Provider>
  );
};

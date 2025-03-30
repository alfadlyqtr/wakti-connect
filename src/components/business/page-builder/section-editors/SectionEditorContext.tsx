
import React, { createContext, useState, useEffect } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

interface SectionEditorContextProps {
  section: BusinessPageSection;
  contentData: Record<string, any>;
  setContentData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStyleChange: (name: string, value: string) => void;
  handleSaveSection: () => void;
  updateSection: ReturnType<typeof useBusinessPage>['updateSection'];
  isNewSection: () => boolean;
}

export const SectionEditorContext = createContext<SectionEditorContextProps | undefined>(undefined);

export const SectionEditorProvider: React.FC<{
  children: React.ReactNode;
  section: BusinessPageSection;
}> = ({ children, section }) => {
  const { updateSection } = useBusinessPage();
  const [contentData, setContentData] = useState(section.section_content || {});
  const [isDirty, setIsDirty] = useState(false);
  
  // Update local state from fetched data
  useEffect(() => {
    setContentData(section.section_content || {});
    setIsDirty(false);
  }, [section]);
  
  // Debounced auto-save function
  const debouncedSave = useDebouncedCallback((content: any, sectionUpdates?: Partial<BusinessPageSection>) => {
    updateSection.mutate({
      sectionId: section.id,
      content,
      sectionUpdates
    });
    setIsDirty(false);
  }, 2000);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newContentData = {
      ...contentData,
      [name]: value
    };
    
    setContentData(newContentData);
    setIsDirty(true);
    
    // Auto-save after typing stops
    debouncedSave(newContentData);
  };
  
  // Handle section-specific styling changes
  const handleStyleChange = (name: string, value: string) => {
    const newContentData = {
      ...contentData,
      [name]: value
    };
    
    setContentData(newContentData);
    setIsDirty(true);
    
    // For style changes, we update both content and the section's styling fields
    const sectionUpdates: Partial<BusinessPageSection> = {
      [name as keyof BusinessPageSection]: value
    };
    
    // Auto-save after typing stops
    debouncedSave(newContentData, sectionUpdates);
  };
  
  const handleSaveSection = () => {
    // For manual save, we also want to update the section-specific styling fields
    const sectionUpdates: Partial<BusinessPageSection> = {};
    
    // Extract styling properties from content to also update on section
    ['background_color', 'text_color', 'padding', 'border_radius', 'background_image_url'].forEach(prop => {
      if (contentData[prop] !== undefined) {
        sectionUpdates[prop as keyof BusinessPageSection] = contentData[prop];
      }
    });
    
    updateSection.mutate({
      sectionId: section.id,
      content: contentData,
      sectionUpdates
    });
    setIsDirty(false);
  };
  
  // Check if the content is empty or has minimal data
  const isNewSection = () => {
    const keys = Object.keys(contentData).filter(key => key !== 'title');
    return keys.length === 0 || (keys.length === 1 && !contentData[keys[0]]);
  };
  
  return (
    <SectionEditorContext.Provider
      value={{
        section,
        contentData,
        setContentData,
        isDirty,
        setIsDirty,
        handleInputChange,
        handleStyleChange,
        handleSaveSection,
        updateSection,
        isNewSection
      }}
    >
      {children}
    </SectionEditorContext.Provider>
  );
};

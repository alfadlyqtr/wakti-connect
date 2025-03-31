
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
    // Make sure we have all styling properties in contentData
    const mergedContent = {
      ...section.section_content || {},
      // Include section styling from the section object if not in contentData
      background_color: section.background_color,
      text_color: section.text_color,
      padding: section.padding,
      border_radius: section.border_radius,
      background_image_url: section.background_image_url,
      // Include additional styling options
      shadow_effect: section.section_content?.shadow_effect || 'none',
      border_style: section.section_content?.border_style || 'none',
      border_width: section.section_content?.border_width || '1px',
      border_color: section.section_content?.border_color || '#000000',
      section_style: section.section_content?.section_style || 'default'
    };
    
    setContentData(mergedContent);
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
    // Update contentData with the style property
    const newContentData = {
      ...contentData,
      [name]: value
    };
    
    setContentData(newContentData);
    setIsDirty(true);
    
    // For style changes, we update both content and the section's styling fields
    // Create a properly typed object for section updates
    const sectionUpdates: Partial<BusinessPageSection> = {};
    
    // Only add the property if it's a valid key of BusinessPageSection
    if (name === 'background_color') {
      sectionUpdates.background_color = value;
    } else if (name === 'text_color') {
      sectionUpdates.text_color = value;
    } else if (name === 'padding') {
      sectionUpdates.padding = value;
    } else if (name === 'border_radius') {
      sectionUpdates.border_radius = value;
    } else if (name === 'background_image_url') {
      sectionUpdates.background_image_url = value;
    }
    
    // Auto-save after typing stops
    debouncedSave(newContentData, sectionUpdates);
  };
  
  const handleSaveSection = () => {
    // For manual save, we also want to update the section-specific styling fields
    const sectionUpdates: Partial<BusinessPageSection> = {
      background_color: contentData.background_color,
      text_color: contentData.text_color,
      padding: contentData.padding,
      border_radius: contentData.border_radius,
      background_image_url: contentData.background_image_url
    };
    
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

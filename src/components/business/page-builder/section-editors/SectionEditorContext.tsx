
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
  handleSaveSection: () => void;
  updateSection: any;
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
  
  // Use debounced save function
  const debouncedSave = useDebouncedCallback((content: any) => {
    updateSection.mutate({
      sectionId: section.id,
      content
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
  
  const handleSaveSection = () => {
    updateSection.mutate({
      sectionId: section.id,
      content: contentData
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
        handleSaveSection,
        updateSection,
        isNewSection
      }}
    >
      {children}
    </SectionEditorContext.Provider>
  );
};

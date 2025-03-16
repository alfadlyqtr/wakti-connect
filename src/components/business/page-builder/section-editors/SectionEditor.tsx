
import React, { useEffect, useState } from "react";
import { BusinessPageSection, SectionType } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Save, Loader2, LayoutTemplate } from "lucide-react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import HeaderEditor from "./HeaderEditor";
import ContactEditor from "./ContactEditor";
import HoursEditor from "./HoursEditor";
import AboutEditor from "./AboutEditor";
import DefaultEditor from "./DefaultEditor";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import SectionTemplateSelector from "../SectionTemplateSelector";

interface SectionEditorProps {
  section: BusinessPageSection;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const { updateSection } = useBusinessPage();
  const [contentData, setContentData] = useState(section.section_content || {});
  const [isDirty, setIsDirty] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // Update local state from fetched data
  useEffect(() => {
    setContentData(section.section_content || {});
    setIsDirty(false);
  }, [section]);
  
  // Debounced auto-save function
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
  
  const handleTemplateSelect = (templateContent: any) => {
    setContentData(templateContent);
    setIsDirty(true);
    updateSection.mutate({
      sectionId: section.id,
      content: templateContent
    });
    setTemplateDialogOpen(false);
  };
  
  const renderEditorFields = () => {
    switch (section.section_type) {
      case 'header':
        return <HeaderEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'contact':
        return <ContactEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'hours':
        return <HoursEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'about':
        return <AboutEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      default:
        return <DefaultEditor contentData={contentData} handleInputChange={handleInputChange} />;
    }
  };
  
  // Check if the content is empty or has minimal data
  const isNewSection = () => {
    const keys = Object.keys(contentData).filter(key => key !== 'title');
    return keys.length === 0 || (keys.length === 1 && !contentData[keys[0]]);
  };
  
  return (
    <div className="space-y-4">
      {isNewSection() && (
        <div className="bg-muted/50 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">New Section</h4>
              <p className="text-xs text-muted-foreground">
                Get started quickly by choosing a template
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTemplateDialogOpen(true)}
            >
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </div>
        </div>
      )}
      
      {renderEditorFields()}
      
      <div className="flex justify-between items-center">
        {isDirty && (
          <p className="text-xs text-muted-foreground">
            Auto-saving changes...
          </p>
        )}
        
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setTemplateDialogOpen(true)}
            title="Choose a template"
          >
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Templates
          </Button>
          
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
      
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Template</DialogTitle>
          </DialogHeader>
          <SectionTemplateSelector 
            sectionType={section.section_type as SectionType}
            onSelect={handleTemplateSelect}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionEditor;

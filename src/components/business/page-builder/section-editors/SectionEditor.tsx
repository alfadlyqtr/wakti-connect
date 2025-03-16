
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";
import HeaderEditor from "./HeaderEditor";
import ContactEditor from "./ContactEditor";
import HoursEditor from "./HoursEditor";
import AboutEditor from "./AboutEditor";
import DefaultEditor from "./DefaultEditor";

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
      const { data, error } = await fromTable('business_page_sections')
        .update({
          section_content: updates
        }, { id: section.id })
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

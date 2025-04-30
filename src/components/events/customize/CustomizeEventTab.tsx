
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventCustomization } from "@/types/event.types";
import { useCustomization } from "./context";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EventCardPreview from "./preview/EventCardPreview";
import CustomizationTabs from "./CustomizationTabs";

export interface CustomizeEventTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  handleNextTab?: () => void;
  handleSaveDraft?: () => void;
  location?: string;
  locationTitle?: string;
  title?: string;
  description?: string;
  selectedDate?: Date;
}

const CustomizeEventTab: React.FC<CustomizeEventTabProps> = ({
  customization,
  onCustomizationChange,
  handleNextTab,
  handleSaveDraft,
  location,
  locationTitle,
  title,
  description,
  selectedDate,
}) => {
  const [activeTab, setActiveTab] = useState("background");
  const [isSaving, setIsSaving] = useState(false);
  
  // Handler for saving draft with proper feedback
  const onSaveDraft = async () => {
    try {
      setIsSaving(true);
      console.log("[CustomizeEventTab] Saving draft with customization");
      
      if (handleSaveDraft) {
        toast({
          title: "Saving draft...",
          description: "Your event customization is being saved"
        });
        
        await Promise.resolve(handleSaveDraft());
        
        toast({
          title: "Draft saved",
          description: "Your event has been saved as a draft",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your draft",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customization panel */}
        <div className="space-y-6">
          <Card className="p-4">
            <CustomizationTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              title={title}
              description={description}
            />
          </Card>
        </div>
        
        {/* Preview panel */}
        <div className="order-first md:order-last">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Event Preview</h3>
            <EventCardPreview 
              location={location} 
              locationTitle={locationTitle}
              title={title} 
              description={description}
              date={selectedDate}
            />
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {handleSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="px-4"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        )}
        
        {handleNextTab && (
          <Button 
            type="button" 
            onClick={handleNextTab}
            className="px-6"
          >
            Next: Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomizeEventTab;

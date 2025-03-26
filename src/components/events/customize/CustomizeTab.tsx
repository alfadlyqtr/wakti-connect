
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import CreateFromScratchForm from "./CreateFromScratchForm";
import TemplateSelector from "@/components/invitations/TemplateSelector";
import { Button } from "@/components/ui/button";
import LivePreview from "./LivePreview";
import { getTemplateById } from "@/data/eventTemplates";
import { format } from "date-fns";

interface CustomizeTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  title: string;
  description?: string;
  location?: string;
  selectedDate?: Date;
  startTime?: string;
  endTime?: string;
}

const CustomizeTab: React.FC<CustomizeTabProps> = ({
  customization,
  onCustomizationChange,
  title,
  description,
  location,
  selectedDate,
  startTime,
  endTime
}) => {
  const [designMode, setDesignMode] = useState<'template' | 'scratch'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    const template = getTemplateById(templateId);
    if (template) {
      onCustomizationChange(template.customization);
    }
  };
  
  // Format the date and time for display
  const getFormattedDateTime = () => {
    if (!selectedDate) return "";
    
    const dateStr = format(selectedDate, "EEEE, MMMM d, yyyy");
    
    if (!startTime || !endTime) return dateStr;
    
    return `${dateStr} · ${startTime} - ${endTime}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Tabs 
            defaultValue={designMode} 
            onValueChange={(value) => setDesignMode(value as 'template' | 'scratch')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="template" className="px-3 py-2 text-center">Choose Template</TabsTrigger>
              <TabsTrigger value="scratch" className="px-3 py-2 text-center">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template">
              <TemplateSelector
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={handleTemplateSelected}
              />
            </TabsContent>
            
            <TabsContent value="scratch">
              <CreateFromScratchForm 
                customization={customization}
                onCustomizationChange={onCustomizationChange}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-md flex flex-col justify-center">
          <LivePreview 
            customization={customization}
            title={title || "Event Title"}
            description={description}
            location={location}
            dateTime={getFormattedDateTime()}
            viewMode={previewMode}
            onViewModeChange={setPreviewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizeTab;

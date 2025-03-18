import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCustomization } from "@/types/event.types";
import CreateFromScratchForm from "./CreateFromScratchForm";
import TemplateSelector from "@/components/invitations/TemplateSelector";
import { Button } from "@/components/ui/button";
import { useInvitationBuilder } from "@/hooks/useInvitationBuilder";
import AnimationSelector from "./AnimationSelector";

interface CustomizeTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
}

const CustomizeTab: React.FC<CustomizeTabProps> = ({
  customization,
  onCustomizationChange
}) => {
  const [designMode, setDesignMode] = useState<'template' | 'scratch'>('scratch');
  
  const { 
    templates, 
    isLoadingTemplates, 
    selectedTemplateId, 
    selectTemplate
  } = useInvitationBuilder();

  // Default customization settings if needed
  const defaultCustomization: EventCustomization = {
    background: {
      type: 'color',
      value: '#ffffff'
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    },
    headerStyle: 'simple',
    animation: 'fade',
  };

  const handleTemplateSelected = (templateId: string) => {
    selectTemplate(templateId);
    
    // In a real implementation, you would load the template's customization settings
    // For now, we'll just set some demo values when a template is selected
    onCustomizationChange({
      ...defaultCustomization,
      // Template-specific settings would be added here
    });
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={designMode} 
        onValueChange={(value) => setDesignMode(value as 'template' | 'scratch')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scratch">Create from Scratch</TabsTrigger>
          <TabsTrigger value="template">Choose Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scratch">
          <CreateFromScratchForm 
            customization={customization || defaultCustomization}
            onCustomizationChange={onCustomizationChange}
          />
        </TabsContent>
        
        <TabsContent value="template">
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleTemplateSelected}
            isLoading={isLoadingTemplates}
          />
          
          {selectedTemplateId && (
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => setDesignMode('scratch')}
                variant="outline"
              >
                Customize This Template
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomizeTab;

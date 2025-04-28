
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { EventCustomization } from '@/types/event.types';
import { eventTemplates } from '@/data/eventTemplates';

interface TemplateSelectorProps {
  onSelect: (template: EventCustomization) => void;
  currentCustomization?: EventCustomization;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, currentCustomization }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = eventTemplates.find(t => t.id === templateId);
    if (template) {
      onSelect(template.customization);
    }
  };

  const getBackgroundPreviewStyle = (customization: EventCustomization) => {
    if (!customization?.background) {
      return {};
    }

    const { type, value } = customization.background;
    
    if (type === 'image') {
      return { 
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    return { backgroundColor: value || '#ffffff' };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose a Template</h3>
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {eventTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const previewStyle = getBackgroundPreviewStyle(template.customization);
            
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all overflow-hidden ${
                  isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <CardContent className="p-0">
                  <div 
                    className="h-24 relative"
                    style={previewStyle}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={() => {
            if (selectedTemplateId) {
              const template = eventTemplates.find(t => t.id === selectedTemplateId);
              if (template) {
                onSelect(template.customization);
              }
            }
          }}
          disabled={!selectedTemplateId}
        >
          Apply Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;

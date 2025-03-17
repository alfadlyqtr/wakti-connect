
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { InvitationTemplate } from "@/types/invitation.types";

interface TemplateSelectorProps {
  templates: InvitationTemplate[] | undefined;
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  isLoading: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Choose a Template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose a Template</h3>
      
      <RadioGroup
        value={selectedTemplateId || undefined}
        onValueChange={onSelectTemplate}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {templates?.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="sr-only"
            />
            <Label
              htmlFor={`template-${template.id}`}
              className="cursor-pointer"
            >
              <Card 
                className={`overflow-hidden transition-all hover:shadow-md ${
                  selectedTemplateId === template.id 
                    ? 'ring-2 ring-primary' 
                    : 'ring-1 ring-border'
                }`}
              >
                <div 
                  className="h-28 bg-cover bg-center"
                  style={{ 
                    backgroundColor: 
                      template.defaultStyles.background.type === 'solid' 
                        ? template.defaultStyles.background.value 
                        : undefined,
                    background: 
                      template.defaultStyles.background.type === 'gradient' 
                        ? template.defaultStyles.background.value 
                        : undefined,
                    backgroundImage: 
                      template.previewImage 
                        ? `url(${template.previewImage})` 
                        : undefined
                  }}
                />
                <CardContent className="p-3">
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {template.defaultStyles.fontFamily}, {template.defaultStyles.fontSize}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TemplateSelector;

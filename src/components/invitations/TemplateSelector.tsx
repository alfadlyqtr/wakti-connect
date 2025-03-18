
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTemplates, EventTemplate } from "@/data/eventTemplates";

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  isLoading?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Get templates from the utility function
  const eventTemplates = getTemplates();
  
  // Filter templates based on the active tab
  const filteredTemplates = activeTab === "all" 
    ? eventTemplates 
    : eventTemplates.filter(template => template.type === activeTab);
  
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
      <h3 className="text-lg font-medium">Choose an Event Template</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="wedding">Wedding</TabsTrigger>
          <TabsTrigger value="birthday">Birthday</TabsTrigger>
          <TabsTrigger value="graduation">Graduation</TabsTrigger>
          <TabsTrigger value="party">Party</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          <RadioGroup
            value={selectedTemplateId || undefined}
            onValueChange={onSelectTemplate}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
              />
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TemplateCardProps {
  template: EventTemplate;
  isSelected: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected }) => {
  const { id, name, description, customization } = template;
  
  // Preview background style
  const getBackgroundStyle = () => {
    const { background } = customization;
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    } else if (background.type === 'gradient') {
      return { backgroundImage: background.value };
    } else if (background.type === 'image' && background.value) {
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      };
    }
    
    return {};
  };
  
  return (
    <div className="relative">
      <RadioGroupItem
        value={id}
        id={`template-${id}`}
        className="sr-only"
      />
      <Label
        htmlFor={`template-${id}`}
        className="cursor-pointer"
      >
        <Card 
          className={`overflow-hidden transition-all hover:shadow-md ${
            isSelected 
              ? 'ring-2 ring-primary' 
              : 'ring-1 ring-border'
          }`}
        >
          <div 
            className="h-36 bg-cover bg-center flex items-center justify-center"
            style={getBackgroundStyle()}
          >
            {template.customization.headerImage ? (
              <img 
                src={template.customization.headerImage} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="text-lg font-bold p-2 text-center"
                style={{ color: customization.font.color }}
              >
                {name}
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {description}
            </div>
          </CardContent>
        </Card>
      </Label>
    </div>
  );
};

export default TemplateSelector;

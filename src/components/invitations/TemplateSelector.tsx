
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { getAllTemplates, getFreeTemplates, getPremiumTemplates } from '@/data/eventTemplates';
import { EventTemplate } from '@/data/eventTemplates';
import { EventCustomization, BackgroundType } from '@/types/event.types';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplateId, onSelectTemplate }) => {
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  
  useEffect(() => {
    let filteredTemplates: EventTemplate[];
    
    switch (filter) {
      case 'free':
        filteredTemplates = getFreeTemplates();
        break;
      case 'premium':
        filteredTemplates = getPremiumTemplates();
        break;
      default:
        filteredTemplates = getAllTemplates();
    }
    
    setTemplates(filteredTemplates);
  }, [filter]);
  
  const getBackgroundStyle = (customization: EventCustomization) => {
    if (!customization.background) return {};
    
    if (customization.background.type === 'solid') {
      return { backgroundColor: customization.background.value || '#ffffff' };
    } else if (customization.background.type === 'gradient') {
      return { backgroundImage: customization.background.value || 'linear-gradient(to right, #f7f7f7, #e3e3e3)' };
    } else if (customization.background.type === 'image') {
      return { backgroundImage: `url(${customization.background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    
    return { backgroundColor: '#ffffff' };
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as 'all' | 'free' | 'premium')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={cn(
                "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                selectedTemplateId === template.id && "ring-2 ring-primary"
              )}
              onClick={() => onSelectTemplate(template.id)}
            >
              {template.isPremium && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Premium
                </div>
              )}
              
              <div 
                className="h-32 relative flex items-center justify-center"
                style={getBackgroundStyle(template.customization)}
              >
                {template.customization.headerImage && (
                  <div className="absolute inset-0 opacity-50">
                    <img src={template.customization.headerImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative z-10 p-4 text-center">
                  <h4 style={{ 
                    color: template.customization.font.color,
                    fontFamily: template.customization.font.family
                  }}>{template.name}</h4>
                </div>
              </div>
              
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
              </CardContent>
              
              <CardFooter className="p-2 flex justify-between">
                <p className="text-xs text-muted-foreground">
                  {template.isPremium ? 'Premium' : 'Free'}
                </p>
                
                {selectedTemplateId === template.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateSelector;

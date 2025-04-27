
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Search, Wand2, Download, Map, FileQuestion, ChevronRight } from 'lucide-react';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { cn } from '@/lib/utils';
import { AIAssistantToolsCardProps } from '@/components/ai/personality-switcher/types';

// Map icon strings to actual components
const iconComponents: Record<string, React.ElementType> = {
  FileText,
  Image,
  Search,
  Wand2,
  Download,
  Map,
  FileQuestion
};

export const AIAssistantToolsCard: React.FC<AIAssistantToolsCardProps> = ({ 
  canAccess = true,
  onUseDocumentContent,
  selectedRole
}) => {
  const { currentPersonality } = useAIPersonality();
  
  const quickTools = currentPersonality?.quickTools || [];
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Tools</CardTitle>
        <CardDescription>
          Enhance your AI interactions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {quickTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {quickTools.map((tool) => {
                const IconComponent = iconComponents[tool.icon] || FileQuestion;
                
                return (
                  <Button
                    key={tool.name}
                    variant="outline"
                    className="h-auto py-3 justify-start text-left"
                    disabled={!canAccess}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{tool.name}</div>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No tools available for this mode
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

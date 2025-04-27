
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Wand2, Image, FileText, Download, Map, FileQuestion } from 'lucide-react';
import { useAIPersonality } from '../personality-switcher/AIPersonalityContext';
import { cn } from '@/lib/utils';

// Define the QuickTool type
interface QuickTool {
  name: string;
  description: string;
  icon: string;
  action?: () => void;
}

// Default quick tools when personality doesn't have specific ones
const defaultQuickTools: QuickTool[] = [
  {
    name: 'Document Analysis',
    description: 'Upload and analyze documents',
    icon: 'FileText'
  },
  {
    name: 'Image Analysis',
    description: 'Get insights from images',
    icon: 'Image'
  },
  {
    name: 'Knowledge Base',
    description: 'Search your knowledge base',
    icon: 'Search'
  },
  {
    name: 'Generate Image',
    description: 'Create images with AI',
    icon: 'Wand2'
  }
];

const iconComponents: Record<string, React.ElementType> = {
  FileText,
  Image,
  Search,
  Wand2,
  Download,
  Map,
  FileQuestion
};

export interface QuickToolsCardProps {
  onSelectTool?: (tool: string) => void;
}

const QuickToolsCard: React.FC<QuickToolsCardProps> = ({ onSelectTool }) => {
  const { currentPersonality } = useAIPersonality();
  const [expanded, setExpanded] = useState(false);
  
  // Use personality-specific tools or default tools
  const quickTools: QuickTool[] = 
    currentPersonality?.quickTools || 
    defaultQuickTools;
  
  const visibleTools = expanded ? quickTools : quickTools.slice(0, 4);
  
  const handleToolClick = (tool: QuickTool) => {
    if (tool.action) {
      tool.action();
    } else if (onSelectTool) {
      onSelectTool(tool.name);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Tools</CardTitle>
        <CardDescription>
          Enhance your AI interactions with these tools
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 mt-2">
          {visibleTools.map((tool) => {
            const IconComponent = 
              iconComponents[tool.icon] || iconComponents.FileQuestion;
              
            return (
              <Button
                key={tool.name}
                variant="outline"
                className="h-auto py-4 justify-start flex-col items-start text-left"
                onClick={() => handleToolClick(tool)}
              >
                <div className="flex items-center w-full">
                  <IconComponent className={cn(
                    "h-5 w-5 mr-2",
                    currentPersonality?.iconColor || "text-primary"
                  )} />
                  <span className="font-medium">{tool.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
                </div>
                <p className="text-xs mt-1 text-muted-foreground font-normal w-full">
                  {tool.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
      
      {quickTools.length > 4 && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuickToolsCard;

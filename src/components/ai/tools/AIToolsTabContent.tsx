
import React from 'react';
import { ImageGenerationToolCard } from './ImageGenerationToolCard';
import { VoiceInteractionToolCard } from './VoiceInteractionToolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Image, FileText, Code, GitBranch } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';

interface AIToolsTabContentProps {
  onPromptSubmit?: (prompt: string) => void;
  onUseDocumentContent?: (content: string) => void;
  selectedRole?: AIAssistantRole;
  canAccess?: boolean;
}

export const AIToolsTabContent: React.FC<AIToolsTabContentProps> = ({ 
  onPromptSubmit, 
  onUseDocumentContent,
  selectedRole,
  canAccess = true
}) => {
  const handleSubmitPrompt = (prompt: string) => {
    if (onPromptSubmit) {
      onPromptSubmit(prompt);
    } else if (onUseDocumentContent) {
      onUseDocumentContent(prompt);
    }
  };

  return (
    <Tabs defaultValue="image" className="w-full">
      <TabsList className="grid grid-cols-5 h-auto">
        <TabsTrigger value="image" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <Image className="h-4 w-4" />
          <span>Image</span>
        </TabsTrigger>
        <TabsTrigger value="voice" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <Mic className="h-4 w-4" />
          <span>Voice</span>
        </TabsTrigger>
        <TabsTrigger value="document" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <FileText className="h-4 w-4" />
          <span>Document</span>
        </TabsTrigger>
        <TabsTrigger value="code" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <Code className="h-4 w-4" />
          <span>Code</span>
        </TabsTrigger>
        <TabsTrigger value="diagram" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <GitBranch className="h-4 w-4" />
          <span>Diagram</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="mt-4">
        <ImageGenerationToolCard onSubmitPrompt={handleSubmitPrompt} />
      </TabsContent>
      
      <TabsContent value="voice" className="mt-4">
        <VoiceInteractionToolCard onSpeechRecognized={handleSubmitPrompt} />
      </TabsContent>
      
      <TabsContent value="document" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Document analysis will be available soon. This feature will allow you to upload and analyze PDFs, DOCs, and other text documents.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="code" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Code Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Code generation tools will be available in an upcoming update.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="diagram" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Diagram Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Diagram generation for flowcharts, mind maps, and process diagrams will be available soon.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

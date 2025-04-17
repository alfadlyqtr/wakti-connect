
import React from 'react';
import { ImageGenerationToolCard } from './ImageGenerationToolCard';
import { VoiceInteractionToolCard } from './VoiceInteractionToolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Image, FileText, Code, GitBranch, Calendar, Book } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { MeetingSummaryTool } from './MeetingSummaryTool';
import { LectureNotesTool } from './lecture-notes/LectureNotesTool';

interface AIToolsTabContentProps {
  onPromptSubmit?: (prompt: string) => void;
  onUseDocumentContent?: (content: string) => void;
  selectedRole?: AIAssistantRole;
  canAccess?: boolean;
  activeMode?: string;
}

export const AIToolsTabContent: React.FC<AIToolsTabContentProps> = ({ 
  onPromptSubmit, 
  onUseDocumentContent,
  selectedRole,
  canAccess = true,
  activeMode = 'general'
}) => {
  const handleSubmitPrompt = (prompt: string) => {
    if (onPromptSubmit) {
      onPromptSubmit(prompt);
    } else if (onUseDocumentContent) {
      onUseDocumentContent(prompt);
    }
  };
  
  // Always show image tab in general or creative mode
  const showImageTab = activeMode === 'general' || activeMode === 'creative';
  
  // Always show meeting tool in creative mode
  const showMeetingTab = activeMode === 'creative';
  
  // Show lecture tab in student mode
  const showLectureTab = activeMode === 'student' || activeMode === 'general';
  
  return (
    <Tabs defaultValue={showImageTab ? "image" : "voice"} className="w-full">
      <TabsList className={`grid ${showMeetingTab && showLectureTab ? 'grid-cols-7' : showMeetingTab || showLectureTab ? 'grid-cols-6' : 'grid-cols-5'} h-auto`}>
        {showImageTab && (
          <TabsTrigger value="image" className="text-xs flex flex-col gap-1 py-2 h-auto">
            <Image className="h-4 w-4" />
            <span>Image</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="voice" className="text-xs flex flex-col gap-1 py-2 h-auto">
          <Mic className="h-4 w-4" />
          <span>Voice</span>
        </TabsTrigger>
        {showMeetingTab && (
          <TabsTrigger value="meeting" className="text-xs flex flex-col gap-1 py-2 h-auto">
            <Calendar className="h-4 w-4" />
            <span>Meeting</span>
          </TabsTrigger>
        )}
        {showLectureTab && (
          <TabsTrigger value="lecture" className="text-xs flex flex-col gap-1 py-2 h-auto">
            <Book className="h-4 w-4" />
            <span>Lecture</span>
          </TabsTrigger>
        )}
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

      {showImageTab && (
        <TabsContent value="image" className="mt-4">
          <ImageGenerationToolCard onSubmitPrompt={handleSubmitPrompt} />
        </TabsContent>
      )}
      
      <TabsContent value="voice" className="mt-4">
        <VoiceInteractionToolCard onSpeechRecognized={handleSubmitPrompt} />
      </TabsContent>
      
      {showMeetingTab && (
        <TabsContent value="meeting" className="mt-4">
          <MeetingSummaryTool onUseSummary={handleSubmitPrompt} />
        </TabsContent>
      )}
      
      {showLectureTab && (
        <TabsContent value="lecture" className="mt-4">
          <LectureNotesTool onUseNotes={handleSubmitPrompt} />
        </TabsContent>
      )}
      
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



import React from 'react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { VoiceInteractionToolCard } from './VoiceInteractionToolCard';
import { ImageGenerationToolCard } from './ImageGenerationToolCard';
import { MeetingSummaryTool } from './MeetingSummaryTool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface EnhancedToolsTabProps {
  selectedRole: AIAssistantRole;
  onUseContent: (content: string) => void;
  canAccess: boolean;
  compact?: boolean;
}

export const EnhancedToolsTab: React.FC<EnhancedToolsTabProps> = ({
  selectedRole,
  onUseContent,
  canAccess,
  compact = false
}) => {
  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced AI Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            AI tools are available for Business and Individual plans.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSpeechRecognized = (text: string) => {
    onUseContent(text);
  };
  
  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    // Format as markdown image
    const imageMarkdown = `![${prompt}](${imageUrl})`;
    onUseContent(imageMarkdown);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <VoiceInteractionToolCard 
          onSpeechRecognized={handleSpeechRecognized}
          compact={true}
        />
        <ImageGenerationToolCard
          onImageGenerated={handleImageGenerated}
          compact={true}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-wakti-blue" />
          Enhanced AI Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VoiceInteractionToolCard onSpeechRecognized={handleSpeechRecognized} />
          <ImageGenerationToolCard onImageGenerated={handleImageGenerated} />
          <MeetingSummaryTool onUseSummary={onUseContent} />
        </div>
      </CardContent>
    </Card>
  );
};

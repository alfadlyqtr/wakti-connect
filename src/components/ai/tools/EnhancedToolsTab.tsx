
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIAssistantRole } from '@/types/ai-assistant.types'; 
import { AIUpgradeRequired } from '@/components/ai/AIUpgradeRequired';
import { DocumentUploadTool } from './DocumentUploadTool';
import { ImageGenerationToolCard } from './ImageGenerationToolCard';

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
    return <AIUpgradeRequired />;
  }

  if (compact) {
    return (
      <ImageGenerationToolCard onPromptUse={onUseContent} />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentUploadTool 
            canAccess={canAccess} 
            onUseDocumentContent={onUseContent}
            compact={true}
          />
          <ImageGenerationToolCard onPromptUse={onUseContent} />
        </div>
      </CardContent>
    </Card>
  );
};

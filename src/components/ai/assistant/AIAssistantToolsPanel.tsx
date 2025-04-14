
import React from 'react';
import { AIToolsTabContent } from '../tools/AIToolsTabContent';
import { AIAssistantRole } from '@/types/ai-assistant.types';

interface AIAssistantToolsPanelProps {
  onPromptSubmit: (prompt: string) => void;
  onUseDocumentContent?: (content: string) => void;
  selectedRole?: AIAssistantRole;
  canAccess?: boolean;
  activeMode?: string;
}

const AIAssistantToolsPanel: React.FC<AIAssistantToolsPanelProps> = ({
  onPromptSubmit,
  onUseDocumentContent,
  selectedRole,
  canAccess = true,
  activeMode = 'general'
}) => {
  return (
    <div className="w-full overflow-hidden">
      <AIToolsTabContent
        onPromptSubmit={onPromptSubmit}
        onUseDocumentContent={onUseDocumentContent}
        selectedRole={selectedRole}
        canAccess={canAccess}
        activeMode={activeMode}
      />
    </div>
  );
};

export default AIAssistantToolsPanel;


import React from "react";
import { DocumentAnalysisToolCard } from "./DocumentAnalysisToolCard";
import { VoiceInteractionToolCard } from "./VoiceInteractionToolCard";
import { KnowledgeProfileToolCard } from "./KnowledgeProfileToolCard";
import { QuickToolsCard } from "./QuickToolsCard";
import { ImageGenerationToolCard } from "./ImageGenerationToolCard";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface AIToolsTabContentProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
}

export const AIToolsTabContent: React.FC<AIToolsTabContentProps> = ({
  canAccess,
  onUseDocumentContent,
  selectedRole
}) => {
  if (!canAccess) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p>AI tools are only available for Business and Individual plans.</p>
      </div>
    );
  }

  const handleSpeechRecognized = (text: string) => {
    onUseDocumentContent(text);
  };

  return (
    <div className="space-y-6">
      <QuickToolsCard 
        selectedRole={selectedRole} 
        onToolSelect={onUseDocumentContent} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VoiceInteractionToolCard onSpeechRecognized={handleSpeechRecognized} />
        <ImageGenerationToolCard onPromptUse={onUseDocumentContent} />
        <KnowledgeProfileToolCard selectedRole={selectedRole} />
        <DocumentAnalysisToolCard 
          canAccess={canAccess}
          onUseDocumentContent={onUseDocumentContent}
          selectedRole={selectedRole}
        />
      </div>
    </div>
  );
};

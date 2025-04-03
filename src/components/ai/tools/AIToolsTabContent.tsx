
import React from "react";
import { DocumentAnalysisToolCard } from "./DocumentAnalysisToolCard";
import { ImageAnalysisToolCard } from "./ImageAnalysisToolCard";
import { VoiceInteractionToolCard } from "./VoiceInteractionToolCard";
import { KnowledgeBaseToolCard } from "./KnowledgeBaseToolCard";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface AIToolsTabContentProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
}

export const AIToolsTabContent: React.FC<AIToolsTabContentProps> = ({
  canAccess,
  onUseDocumentContent,
  selectedRole,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DocumentAnalysisToolCard 
        canAccess={canAccess} 
        onUseDocumentContent={onUseDocumentContent}
        selectedRole={selectedRole}
      />
      <ImageAnalysisToolCard />
      <VoiceInteractionToolCard />
      <KnowledgeBaseToolCard />
    </div>
  );
};

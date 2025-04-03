
import React from "react";
import { FileText } from "lucide-react";
import { AIAssistantDocumentsCard } from "@/components/ai/AIAssistantDocumentsCard";
import { AIToolCard } from "./AIToolCard";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface DocumentAnalysisToolCardProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
}

export const DocumentAnalysisToolCard: React.FC<DocumentAnalysisToolCardProps> = ({
  canAccess,
  onUseDocumentContent,
  selectedRole,
}) => {
  return (
    <AIToolCard
      icon={FileText}
      title="Document Analysis"
      description="Upload documents for the AI to analyze and extract information."
      iconColor="text-blue-600"
    >
      <AIAssistantDocumentsCard 
        canAccess={canAccess} 
        onUseDocumentContent={onUseDocumentContent}
        selectedRole={selectedRole}
      />
    </AIToolCard>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDocumentProcessor } from "@/components/ai/assistant/AIDocumentProcessor";
import { FileText, Upload } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface AIAssistantDocumentsCardProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
  compact?: boolean;
}

export const AIAssistantDocumentsCard: React.FC<AIAssistantDocumentsCardProps> = ({
  canAccess,
  onUseDocumentContent,
  selectedRole,
  compact = false
}) => {
  if (!canAccess) {
    return null;
  }

  // Adjust styling for compact mode
  const getHeaderClasses = () => {
    return compact 
      ? "pb-2" 
      : "pb-2 sm:pb-3";
  };

  const getIconClasses = () => {
    return compact
      ? "h-4 w-4 mr-1.5"
      : "h-5 w-5 mr-2";
  };

  const getTitleClasses = () => {
    return compact
      ? "text-base"
      : "text-xl";
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm mb-1">
          <FileText className="h-4 w-4 mr-1.5" />
          <span className="font-medium">Document Analysis</span>
        </div>
        <AIDocumentProcessor
          onUseDocumentContent={onUseDocumentContent}
          selectedRole={selectedRole}
          compact={true}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className={getHeaderClasses()}>
        <CardTitle className={`flex items-center ${getTitleClasses()}`}>
          <FileText className={getIconClasses()} />
          Document Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AIDocumentProcessor
          onUseDocumentContent={onUseDocumentContent}
          selectedRole={selectedRole}
        />
      </CardContent>
    </Card>
  );
};

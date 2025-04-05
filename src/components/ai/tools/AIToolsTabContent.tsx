
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentUploadTool } from "./DocumentUploadTool";
import { MeetingSummaryTool } from "./MeetingSummaryTool";
import { AIAssistantSettings } from "@/components/settings/ai/AIAssistantSettings";
import { AIUpgradeRequired } from "@/components/ai/AIUpgradeRequired";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { QuickToolsCard } from "./QuickToolsCard";
import { ImageGenerationToolCard } from "./ImageGenerationToolCard";
import { ImageTransformationToolCard } from "./ImageTransformationToolCard";
import { KnowledgeProfileToolCard } from "./KnowledgeProfileToolCard";

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
  if (!canAccess) {
    return <AIUpgradeRequired />;
  }

  return (
    <div className="space-y-8">
      {/* Quick Tools Section */}
      <div className="grid grid-cols-1 gap-4">
        <QuickToolsCard
          selectedRole={selectedRole}
          onToolSelect={(example) => onUseDocumentContent(example)}
        />
      </div>
      
      {/* Knowledge Profiles Section - Removed from here, moved to Knowledge tab */}
      
      {/* Tools Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentUploadTool
          canAccess={canAccess}
          onUseDocumentContent={onUseDocumentContent}
        />
        <MeetingSummaryTool onUseSummary={onUseDocumentContent} />
      </div>

      {/* Image Tools Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageGenerationToolCard 
          onPromptUse={onUseDocumentContent}
        />
        <ImageTransformationToolCard />
      </div>
    </div>
  );
};

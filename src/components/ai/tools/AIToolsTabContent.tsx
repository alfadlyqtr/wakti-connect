
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentUploadTool } from "./DocumentUploadTool";
import { VoiceInteractionToolCard } from "./VoiceInteractionToolCard";
import { MeetingSummaryTool } from "./MeetingSummaryTool";
import { AIAssistantSettings } from "@/components/settings/ai/AIAssistantSettings";
import { AIUpgradeRequired } from "@/components/ai/AIUpgradeRequired";
import { ImageGenerationToolCard } from "./ImageGenerationToolCard";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { QuickToolsCard } from "./QuickToolsCard";

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
      
      {/* First row of tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentUploadTool
          canAccess={canAccess}
          onUseDocumentContent={onUseDocumentContent}
        />
        <VoiceInteractionToolCard onSpeechRecognized={onUseDocumentContent} />
      </div>
      
      {/* Second row of tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MeetingSummaryTool onUseSummary={onUseDocumentContent} />
        <ImageGenerationToolCard onPromptUse={onUseDocumentContent} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <AIAssistantSettings />
        </CardContent>
      </Card>
    </div>
  );
};

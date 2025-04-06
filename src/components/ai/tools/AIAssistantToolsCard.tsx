
import React from "react";
import { AIToolsTabContent } from "./AIToolsTabContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { useTranslation } from "react-i18next";

interface AIAssistantToolsCardProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
  selectedRole: AIAssistantRole;
}

export const AIAssistantToolsCard: React.FC<AIAssistantToolsCardProps> = ({
  canAccess,
  onUseDocumentContent,
  selectedRole,
}) => {
  const { t } = useTranslation();
  
  if (!canAccess) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Wrench className="h-5 w-5 mr-2 text-wakti-blue" />
          {t("ai.tools.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AIToolsTabContent 
          canAccess={canAccess} 
          onUseDocumentContent={onUseDocumentContent}
          selectedRole={selectedRole}
        />
      </CardContent>
    </Card>
  );
};

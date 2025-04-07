
import React from "react";
import { AIToolsTabContent } from "./AIToolsTabContent";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EnhancedToolsTabProps {
  selectedRole: AIAssistantRole;
  onUseContent: (content: string) => void;
  canAccess: boolean;
}

export const EnhancedToolsTab: React.FC<EnhancedToolsTabProps> = ({
  selectedRole,
  onUseContent,
  canAccess
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className={`flex items-center text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Wrench className={`h-5 w-5 text-wakti-blue ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("ai.tools.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AIToolsTabContent 
          canAccess={canAccess} 
          onUseDocumentContent={onUseContent}
          selectedRole={selectedRole}
        />
      </CardContent>
    </Card>
  );
};

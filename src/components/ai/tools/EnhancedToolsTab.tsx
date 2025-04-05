
import React from "react";
import { AIToolsTabContent } from "./AIToolsTabContent";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

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
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Wrench className="h-5 w-5 mr-2 text-wakti-blue" />
          AI Tools
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

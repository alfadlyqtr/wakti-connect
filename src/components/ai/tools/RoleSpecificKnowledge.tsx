
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { KnowledgeProfileToolCard } from "./KnowledgeProfileToolCard";
import { AIUpgradeRequired } from "@/components/ai/AIUpgradeRequired";

interface RoleSpecificKnowledgeProps {
  selectedRole: AIAssistantRole;
  canAccess: boolean;
}

export const RoleSpecificKnowledge: React.FC<RoleSpecificKnowledgeProps> = ({
  selectedRole,
  canAccess
}) => {
  if (!canAccess) {
    return <AIUpgradeRequired />;
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <BookOpen className="h-5 w-5 mr-2 text-wakti-blue" />
          Knowledge Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Help your AI assistant understand your unique needs and context better by sharing some information about yourself.
        </p>
        
        <KnowledgeProfileToolCard selectedRole={selectedRole} />
      </CardContent>
    </Card>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { useAIAssistant } from "@/hooks/useAIAssistant";

export const AIConversationHistory: React.FC = () => {
  const { canUseAI } = useAIAssistant();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Conversation History</CardTitle>
        <CardDescription>
          Review your past conversations with the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AIAssistantHistoryCard canAccess={canUseAI} />
      </CardContent>
    </Card>
  );
};

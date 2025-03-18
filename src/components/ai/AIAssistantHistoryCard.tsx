
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AIAssistantUpgradeCard } from "./AIAssistantUpgradeCard";

interface AIAssistantHistoryCardProps {
  canAccess: boolean;
}

export function AIAssistantHistoryCard({ canAccess }: AIAssistantHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat History</CardTitle>
        <CardDescription>View your previous conversations with the AI assistant</CardDescription>
      </CardHeader>
      <CardContent>
        {canAccess ? (
          <p className="text-center text-muted-foreground py-8">
            Chat history feature coming soon
          </p>
        ) : (
          <AIAssistantUpgradeCard />
        )}
      </CardContent>
    </Card>
  );
}

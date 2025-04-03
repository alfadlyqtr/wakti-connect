
import React from "react";
import { Sparkles } from "lucide-react";
import { AIToolCard } from "./AIToolCard";

export const KnowledgeBaseToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Sparkles}
      title="Knowledge Base"
      description="Teach the AI about your business, projects, and preferences."
      iconColor="text-amber-500"
    >
      <div className="space-y-2">
        <div className="rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer">
          <h4 className="text-sm font-medium">Business Information</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Add details about your services, products, and operations
          </p>
        </div>
        <div className="rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer">
          <h4 className="text-sm font-medium">Personal Preferences</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Teach the AI about your style, schedule, and work habits
          </p>
        </div>
      </div>
    </AIToolCard>
  );
};

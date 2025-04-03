
import React from "react";
import { Database } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";

export const KnowledgeBaseToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Database}
      title="Knowledge Base"
      description="Access your knowledge base to reference previously saved information"
      iconColor="text-amber-500"
    >
      <Button disabled className="w-full">
        Coming Soon
      </Button>
    </AIToolCard>
  );
};


import React from "react";
import { Mic } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";

export const VoiceInteractionToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Mic}
      title="Voice Interaction"
      description="Use your voice to interact with the AI assistant"
      iconColor="text-purple-500"
    >
      <Button disabled className="w-full">
        Coming Soon
      </Button>
    </AIToolCard>
  );
};

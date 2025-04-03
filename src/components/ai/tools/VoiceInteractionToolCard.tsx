
import React from "react";
import { Mic } from "lucide-react";
import { AIToolCard } from "./AIToolCard";

export const VoiceInteractionToolCard: React.FC = () => {
  return (
    <AIToolCard
      icon={Mic}
      title="Voice Interaction"
      description="Speak to the AI assistant and get voice responses back."
      iconColor="text-purple-600"
    >
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
        <Mic className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Click to start voice recording</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ask questions or give commands with your voice
        </p>
      </div>
    </AIToolCard>
  );
};

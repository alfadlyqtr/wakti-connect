
import React from "react";
import { Bot, Info } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";

interface AIAssistantHeaderProps {
  userName?: string;
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
  isSpeechEnabled: boolean;
  onToggleSpeech: () => void;
  isListening: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export const AIAssistantHeader: React.FC<AIAssistantHeaderProps> = ({
  selectedRole,
}) => {
  const getRoleName = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return "Student Chat";
      case "employee": return "Work Chat";
      case "writer": return "Creator Chat";
      case "business_owner": return "Business Chat";
      default: return "General Chat";
    }
  };

  return (
    <header className="p-3 bg-white border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center mr-3 bg-wakti-blue shadow-sm">
            <Bot className="h-4 w-4 text-white" />
          </div>
          
          <div>
            <h1 className="text-lg font-medium">
              {getRoleName(selectedRole)} Mode
            </h1>
            <p className="text-xs text-muted-foreground">
              Ask me anything or try the suggested prompts below
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};


import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useAISetup } from "../context/AISetupContext";

export const WizardHeader: React.FC = () => {
  const { step, userRole, assistantMode } = useAISetup();

  return (
    <>
      <CardTitle className="text-2xl font-bold">Set Up Your AI Assistant</CardTitle>
      <CardDescription>
        Tell us about yourself so we can personalize your AI assistant experience.
        {step > 1 && userRole && (
          <span className="block mt-1 font-medium">
            Role: {userRole.replace('_', ' ')}
            {assistantMode && step > 2 && ` • Mode: ${assistantMode.replace('_', ' ')}`}
          </span>
        )}
      </CardDescription>
    </>
  );
};

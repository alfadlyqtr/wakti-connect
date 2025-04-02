
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoleSelection } from "../RoleSelection";
import { AssistantModeSelector } from "./AssistantModeSelector";
import { SpecializedSettingsStep } from "./SpecializedSettingsStep";
import { useAISetup } from "../context/AISetupContext";

export const WizardContent: React.FC = () => {
  const { step, initialAccountType } = useAISetup();

  return (
    <ScrollArea className="h-full max-h-[60vh] pr-4 overflow-y-auto">
      {step === 1 && (
        <RoleSelection 
          onSelect={(role) => useAISetup().handleRoleSelect(role)} 
          initialAccountType={initialAccountType} 
        />
      )}
      
      {step === 2 && (
        <AssistantModeSelector />
      )}
      
      {step === 3 && (
        <SpecializedSettingsStep />
      )}
    </ScrollArea>
  );
};

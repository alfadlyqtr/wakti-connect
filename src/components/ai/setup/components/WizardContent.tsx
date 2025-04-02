
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoleSelection } from "../RoleSelection";
import { SpecializedSettingsStep } from "./SpecializedSettingsStep";
import { useAISetup } from "../context/AISetupContext";

export const WizardContent: React.FC = () => {
  const { step, initialAccountType, handleRoleSelect } = useAISetup();

  return (
    <ScrollArea className="h-full max-h-[60vh] pr-4 overflow-y-auto">
      {step === 1 && (
        <RoleSelection 
          onSelect={handleRoleSelect} 
          initialAccountType={initialAccountType} 
        />
      )}
      
      {step === 3 && (
        <SpecializedSettingsStep />
      )}
    </ScrollArea>
  );
};

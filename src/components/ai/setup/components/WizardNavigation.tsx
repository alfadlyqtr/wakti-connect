
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAISetup } from "../context/AISetupContext";

export const WizardNavigation: React.FC = () => {
  const { step, isLoading, handleBack, handleComplete } = useAISetup();

  return (
    <div className="flex justify-between">
      {step > 1 && (
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isLoading}
        >
          Back
        </Button>
      )}
      {step === 3 ? (
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

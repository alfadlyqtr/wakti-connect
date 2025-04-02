
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { WizardHeader } from "./components/WizardHeader";
import { WizardContent } from "./components/WizardContent";
import { WizardNavigation } from "./components/WizardNavigation";
import { AISetupProvider } from "./context/AISetupContext";

interface AISetupWizardProps {
  onComplete: () => void;
  initialAccountType?: string;
  onError?: (error: string) => void;
}

export const AISetupWizard: React.FC<AISetupWizardProps> = ({ 
  onComplete,
  initialAccountType = "individual",
  onError
}) => {
  return (
    <AISetupProvider 
      onComplete={onComplete} 
      initialAccountType={initialAccountType}
      onError={onError}
    >
      <div className="h-full w-full overflow-auto py-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <WizardHeader />
          </CardHeader>
          
          <CardContent className="pb-4">
            <WizardContent />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <WizardNavigation />
          </CardFooter>
        </Card>
      </div>
    </AISetupProvider>
  );
};

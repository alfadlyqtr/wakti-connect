
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { StudentSetup } from "./StudentSetup";
import { ProfessionalSetup } from "./ProfessionalSetup";
import { BusinessSetup } from "./BusinessSetup";
import { RoleSelection } from "./RoleSelection";

export type UserRole = "student" | "professional" | "business_owner" | "other";
export type AssistantMode = "tutor" | "content_creator" | "project_manager" | "business_manager" | "personal_assistant";

interface AISetupWizardProps {
  onComplete: () => void;
  initialAccountType?: string;
}

export const AISetupWizard: React.FC<AISetupWizardProps> = ({ 
  onComplete,
  initialAccountType = "individual"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [assistantMode, setAssistantMode] = useState<AssistantMode | null>(null);
  const [specializedSettings, setSpecializedSettings] = useState<Record<string, any>>({});
  
  // If we already have a business account, skip to business setup
  useEffect(() => {
    if (initialAccountType === "business") {
      setUserRole("business_owner");
      setAssistantMode("business_manager");
      setStep(3); // Skip to specialized setup
    }
  }, [initialAccountType]);
  
  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    
    // Set default assistant mode based on role
    switch (role) {
      case "student":
        setAssistantMode("tutor");
        break;
      case "business_owner":
        setAssistantMode("business_manager");
        break;
      case "professional":
        setAssistantMode("personal_assistant");
        break;
      default:
        setAssistantMode("personal_assistant");
    }
    
    setStep(2);
  };
  
  const handleModeSelect = (mode: AssistantMode) => {
    setAssistantMode(mode);
    setStep(3);
  };
  
  const handleSpecializedSettingsChange = (settings: Record<string, any>) => {
    setSpecializedSettings({
      ...specializedSettings,
      ...settings
    });
  };
  
  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Check if user already has AI settings
      const { data: existingSettings, error: checkError } = await supabase
        .from("ai_assistant_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
        
      const settings = {
        user_id: user.id,
        user_role: userRole,
        assistant_mode: assistantMode,
        specialized_settings: specializedSettings,
        tone: specializedSettings.communicationStyle || "balanced",
        response_length: specializedSettings.detailLevel || "balanced"
      };
      
      if (existingSettings?.id) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from("ai_assistant_settings")
          .update(settings)
          .eq("id", existingSettings.id);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new settings
        const { error: insertError } = await supabase
          .from("ai_assistant_settings")
          .insert(settings);
          
        if (insertError) {
          throw insertError;
        }
      }
      
      // Also update the profile table with relevant information
      if (userRole === "student" && specializedSettings.schoolLevel) {
        await supabase
          .from("profiles")
          .update({ 
            occupation: `Student (${specializedSettings.schoolLevel})` 
          })
          .eq("id", user.id);
      }
      
      toast({
        title: "AI Setup Complete",
        description: "Your AI assistant is now personalized to your needs."
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving AI settings:", error);
      toast({
        title: "Setup Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
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
      </CardHeader>
      
      <CardContent className="pb-4">
        {step === 1 && (
          <RoleSelection onSelect={handleRoleSelect} />
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose Your Assistant Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRole === "student" && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("tutor")}
                  >
                    <span className="font-bold">Tutor</span>
                    <span className="text-sm text-muted-foreground">
                      Helps with homework, explains concepts, and assists with studying
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("content_creator")}
                  >
                    <span className="font-bold">Essay Helper</span>
                    <span className="text-sm text-muted-foreground">
                      Assists with writing assignments, research, and creative projects
                    </span>
                  </Button>
                </>
              )}
              
              {userRole === "professional" && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("personal_assistant")}
                  >
                    <span className="font-bold">Personal Assistant</span>
                    <span className="text-sm text-muted-foreground">
                      Helps with tasks, scheduling, and daily productivity
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("project_manager")}
                  >
                    <span className="font-bold">Project Manager</span>
                    <span className="text-sm text-muted-foreground">
                      Focuses on organizing workflows, tracking progress, and meeting deadlines
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("content_creator")}
                  >
                    <span className="font-bold">Content Creator</span>
                    <span className="text-sm text-muted-foreground">
                      Specializes in writing emails, reports, and professional documents
                    </span>
                  </Button>
                </>
              )}
              
              {userRole === "business_owner" && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("business_manager")}
                  >
                    <span className="font-bold">Business Manager</span>
                    <span className="text-sm text-muted-foreground">
                      Helps with operations, staff coordination, and business analytics
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-start h-auto p-4 text-left" 
                    onClick={() => handleModeSelect("content_creator")}
                  >
                    <span className="font-bold">Marketing Assistant</span>
                    <span className="text-sm text-muted-foreground">
                      Focuses on creating marketing content, emails, and business copy
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        
        {step === 3 && (
          <>
            {userRole === "student" && (
              <StudentSetup onChange={handleSpecializedSettingsChange} />
            )}
            {userRole === "professional" && (
              <ProfessionalSetup onChange={handleSpecializedSettingsChange} />
            )}
            {userRole === "business_owner" && (
              <BusinessSetup onChange={handleSpecializedSettingsChange} />
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
};

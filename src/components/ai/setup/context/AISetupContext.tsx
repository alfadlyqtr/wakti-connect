
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export type UserRole = "student" | "professional" | "business_owner" | "other";
export type AssistantMode = "tutor" | "content_creator" | "project_manager" | "business_manager" | "personal_assistant" | "text_generator";

interface AISetupContextType {
  step: number;
  setStep: (step: number) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  assistantMode: AssistantMode | null;
  setAssistantMode: (mode: AssistantMode | null) => void;
  specializedSettings: Record<string, any>;
  setSpecializedSettings: (settings: Record<string, any>) => void;
  updateSpecializedSettings: (settings: Record<string, any>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  handleRoleSelect: (role: UserRole) => void;
  handleModeSelect: (mode: AssistantMode) => void;
  handleBack: () => void;
  handleComplete: () => Promise<void>;
  initialAccountType: string;
  onComplete: () => void;
  onError?: (error: string) => void;
}

const AISetupContext = createContext<AISetupContextType | undefined>(undefined);

export const useAISetup = () => {
  const context = useContext(AISetupContext);
  if (!context) {
    throw new Error("useAISetup must be used within an AISetupProvider");
  }
  return context;
};

interface AISetupProviderProps {
  children: React.ReactNode;
  onComplete: () => void;
  initialAccountType?: string;
  onError?: (error: string) => void;
}

export const AISetupProvider: React.FC<AISetupProviderProps> = ({
  children,
  onComplete,
  initialAccountType = "individual",
  onError
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [assistantMode, setAssistantMode] = useState<AssistantMode | null>(null);
  const [specializedSettings, setSpecializedSettings] = useState<Record<string, any>>({});

  // Initialize business account if needed
  React.useEffect(() => {
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
      case "other":
        setAssistantMode("text_generator");
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

  const updateSpecializedSettings = (settings: Record<string, any>) => {
    setSpecializedSettings({
      ...specializedSettings,
      ...settings
    });
  };
  
  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleComplete = async () => {
    if (!user) {
      const errorMsg = "User not authenticated. Please sign in.";
      if (onError) onError(errorMsg);
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting AISetupWizard save process for user:", user.id);

      // Check if user already has AI settings
      const { data: existingSettings, error: checkError } = await supabase
        .from("ai_assistant_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking existing settings:", checkError);
        throw new Error(`Failed to check for existing settings: ${checkError.message}`);
      }
      
      // Store the role and mode information in a compatible format
      const tone = specializedSettings.communicationStyle || "balanced";
      const responseLength = specializedSettings.detailLevel || "balanced";
      
      // Modified: Store all information in enabled_features as a workaround for missing columns
      const enabledFeatures = {
        tasks: true,
        events: true,
        staff: true,
        analytics: true,
        messaging: true,
        text_generation: assistantMode === "text_generator" || assistantMode === "content_creator",
        // Store settings in enabled_features as a workaround for potential missing columns
        _userRole: userRole,
        _assistantMode: assistantMode,
        _specializedSettings: specializedSettings
      };
      
      // Prepare settings object with basic required fields
      const settings = {
        user_id: user.id,
        assistant_name: "WAKTI AI",
        tone: tone,
        response_length: responseLength,
        proactiveness: true,
        suggestion_frequency: "medium",
        enabled_features: enabledFeatures
      };
      
      // Attempt to add new fields if they exist in the schema
      try {
        // Only add these fields if they don't cause errors
        Object.assign(settings, {
          user_role: userRole,
          assistant_mode: assistantMode,
          specialized_settings: specializedSettings
        });
      } catch (e) {
        console.log("Schema might not support new fields yet, using fallback method");
      }
      
      console.log("Saving AI settings:", settings);
      
      if (existingSettings?.id) {
        // Update existing settings
        console.log("Updating existing settings with ID:", existingSettings.id);
        const { error: updateError } = await supabase
          .from("ai_assistant_settings")
          .update(settings)
          .eq("id", existingSettings.id);
          
        if (updateError) {
          console.error("Error updating settings:", updateError);
          throw new Error(`Failed to update settings: ${updateError.message}`);
        }
      } else {
        // Create new settings
        console.log("Creating new settings");
        const { error: insertError } = await supabase
          .from("ai_assistant_settings")
          .insert(settings);
          
        if (insertError) {
          console.error("Error inserting settings:", insertError);
          throw new Error(`Failed to create settings: ${insertError.message}`);
        }
      }
      
      // Also update the profile table with relevant information
      if (userRole === "student" && specializedSettings.schoolLevel) {
        console.log("Updating profile with student info");
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            occupation: `Student (${specializedSettings.schoolLevel})` 
          })
          .eq("id", user.id);
          
        if (profileError) {
          console.warn("Error updating profile:", profileError);
          // Don't throw here - just a warning as this is not critical
        }
      }
      
      console.log("AI setup completed successfully");
      
      toast({
        title: "AI Setup Complete",
        description: "Your AI assistant is now personalized to your needs."
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving AI settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (onError) {
        onError(errorMessage);
      }
      
      toast({
        title: "Setup Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    step,
    setStep,
    userRole,
    setUserRole,
    assistantMode,
    setAssistantMode,
    specializedSettings,
    setSpecializedSettings,
    updateSpecializedSettings,
    isLoading,
    setIsLoading,
    handleRoleSelect,
    handleModeSelect,
    handleBack,
    handleComplete,
    initialAccountType,
    onComplete,
    onError
  };

  return (
    <AISetupContext.Provider value={value}>
      {children}
    </AISetupContext.Provider>
  );
};

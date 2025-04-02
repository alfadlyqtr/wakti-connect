
// Re-export setup wizard components
export { AISetupWizard } from "./AISetupWizard";
export { RoleSelection } from "./RoleSelection";
export { StudentSetup } from "./StudentSetup";
export { ProfessionalSetup } from "./ProfessionalSetup";
export { BusinessSetup } from "./BusinessSetup";
export { TextCreatorSetup } from "./TextCreatorSetup";

// Re-export context and types from context file instead of from AISetupWizard
export { 
  AISetupProvider, 
  useAISetup, 
  type UserRole, 
  type AssistantMode 
} from "./context/AISetupContext";

// Re-export components
export { WizardHeader } from "./components/WizardHeader";
export { WizardContent } from "./components/WizardContent";
export { WizardNavigation } from "./components/WizardNavigation";
export { AssistantModeSelector } from "./components/AssistantModeSelector";
export { SpecializedSettingsStep } from "./components/SpecializedSettingsStep";

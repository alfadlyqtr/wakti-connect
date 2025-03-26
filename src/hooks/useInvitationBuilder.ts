
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchInvitationTemplates, 
  createInvitationCustomization 
} from "@/services/invitation"; 
import { 
  InvitationTemplate, 
  InvitationCustomization, 
  InvitationStyle 
} from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";

export const useInvitationBuilder = () => {
  const queryClient = useQueryClient();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [currentCustomization, setCurrentCustomization] = useState<Partial<InvitationCustomization>>({});
  
  // Fetch available templates
  const { 
    data: templates, 
    isLoading: isLoadingTemplates 
  } = useQuery({
    queryKey: ['invitationTemplates'],
    queryFn: fetchInvitationTemplates
  });
  
  // Get the selected template
  const selectedTemplate = templates?.find(template => template.id === selectedTemplateId) || null;
  
  // Create customization
  const createCustomization = useMutation({
    mutationFn: async () => {
      if (!selectedTemplateId) {
        throw new Error("No template selected");
      }
      
      return createInvitationCustomization(selectedTemplateId, currentCustomization);
    },
    onSuccess: (data) => {
      toast({
        title: "Customization Saved",
        description: "Your invitation styling has been saved successfully."
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Save Customization",
        description: error.message || "An error occurred while saving the customization",
        variant: "destructive"
      });
    }
  });
  
  // Update current customization
  const updateCustomization = (updates: Partial<InvitationCustomization>) => {
    setCurrentCustomization(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Set template and initialize customization with template defaults
  const selectTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    
    if (template) {
      setSelectedTemplateId(templateId);
      
      // Initialize customization with template defaults
      setCurrentCustomization({
        backgroundType: template.defaultStyles.background.type,
        backgroundValue: template.defaultStyles.background.value,
        fontFamily: template.defaultStyles.fontFamily,
        fontSize: template.defaultStyles.fontSize,
        textAlign: template.defaultStyles.textAlign,
        buttonStyles: template.defaultStyles.buttons,
        layoutSize: 'medium',
        customEffects: { shadow: template.defaultStyles.shadow }
      });
    }
  };
  
  // Reset customization to template defaults
  const resetToDefaults = () => {
    if (selectedTemplate) {
      setCurrentCustomization({
        backgroundType: selectedTemplate.defaultStyles.background.type,
        backgroundValue: selectedTemplate.defaultStyles.background.value,
        fontFamily: selectedTemplate.defaultStyles.fontFamily,
        fontSize: selectedTemplate.defaultStyles.fontSize,
        textAlign: selectedTemplate.defaultStyles.textAlign,
        buttonStyles: selectedTemplate.defaultStyles.buttons,
        layoutSize: 'medium',
        customEffects: { shadow: selectedTemplate.defaultStyles.shadow }
      });
    }
  };
  
  // Calculate the current preview style combining template defaults and customizations
  const getCurrentStyle = (): InvitationStyle => {
    if (!selectedTemplate) {
      // Default styles if no template is selected
      return {
        background: { 
          type: 'solid', 
          value: '#ffffff' 
        },
        font: 'Inter',
        colors: {
          primary: '#4CAF50',
          secondary: '#f44336',
          text: '#333333',
          accent: '#2196F3'
        },
        layout: 'standard'
      };
    }
    
    // Start with template defaults
    const baseStyle = selectedTemplate.defaultStyles;
    
    // Apply current customizations
    return {
      background: {
        type: (currentCustomization.backgroundType || baseStyle.background.type),
        value: currentCustomization.backgroundValue || baseStyle.background.value
      },
      font: currentCustomization.fontFamily || baseStyle.fontFamily,
      colors: {
        primary: '#4CAF50',
        secondary: '#f44336',
        text: '#333333',
        accent: '#2196F3'
      },
      layout: 'standard'
    };
  };
  
  return {
    templates,
    isLoadingTemplates,
    selectedTemplateId,
    selectedTemplate,
    currentCustomization,
    selectTemplate,
    updateCustomization,
    resetToDefaults,
    createCustomization,
    getCurrentStyle
  };
};

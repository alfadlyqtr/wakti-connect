
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import SubscribeButtonCard from "./advanced/SubscribeButtonCard";
import ChatbotCard from "./advanced/ChatbotCard";
import SaveButton from "./advanced/SaveButton";

interface AdvancedSettingsTabProps {
  pageData: {
    id?: string;
    chatbot_enabled?: boolean;
    chatbot_code?: string;
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
    subscribe_button_position?: string;
    subscribe_button_style?: string;
    subscribe_button_size?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  updatePage: any;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  updatePage
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localChanges, setLocalChanges] = useState<Partial<AdvancedSettingsTabProps['pageData']>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalChanges(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    handleInputChangeWithAutoSave(e);
  };
  
  const handleLocalToggleChange = (name: string, checked: boolean) => {
    setLocalChanges(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
    
    handleToggleWithAutoSave(name, checked);
  };

  const handleLocalSelectChange = (name: string, value: string) => {
    setLocalChanges(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  const handleSaveChanges = async () => {
    if (!pageData.id || !isDirty) {
      toast({
        title: "No changes to save",
        description: "No changes were detected in the advanced settings."
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updatePage.mutateAsync({
        pageId: pageData.id,
        data: localChanges
      });
      
      toast({
        title: "Advanced settings saved",
        description: "Your changes have been successfully saved."
      });
      
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving advanced settings:", error);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your changes. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonPreviewStyles = () => {
    const style: React.CSSProperties = {
      backgroundColor: 
        pageData.subscribe_button_style === 'gradient' 
          ? `linear-gradient(135deg, ${pageData.primary_color || '#3B82F6'} 0%, ${pageData.secondary_color || '#10B981'} 100%)`
          : pageData.subscribe_button_style === 'outline' ? 'transparent' 
          : pageData.subscribe_button_style === 'minimal' ? 'transparent'
          : pageData.primary_color || '#3B82F6',
      color: pageData.subscribe_button_style === 'outline' || pageData.subscribe_button_style === 'minimal' 
          ? pageData.primary_color || '#3B82F6'
          : '#ffffff',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      fontSize: pageData.subscribe_button_size === 'small' ? '0.875rem' : 
              pageData.subscribe_button_size === 'large' ? '1.125rem' : '1rem',
      height: pageData.subscribe_button_size === 'small' ? '32px' : 
              pageData.subscribe_button_size === 'large' ? '48px' : '40px',
      minWidth: pageData.subscribe_button_size === 'small' ? '80px' : 
              pageData.subscribe_button_size === 'large' ? '140px' : '120px',
      border: pageData.subscribe_button_style === 'outline' ? `2px solid ${pageData.primary_color || '#3B82F6'}` : 'none',
      boxShadow: pageData.subscribe_button_style === 'minimal' ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    };
    
    return style;
  };

  return (
    <div className="space-y-6">
      <SubscribeButtonCard 
        pageData={pageData}
        handleInputChange={handleLocalInputChange}
        handleToggleChange={handleLocalToggleChange}
        handleSelectChange={handleLocalSelectChange}
        getButtonPreviewStyles={getButtonPreviewStyles}
      />

      <ChatbotCard 
        chatbotEnabled={!!pageData.chatbot_enabled}
        chatbotCode={pageData.chatbot_code || ""}
        handleInputChange={handleLocalInputChange}
        handleToggleChange={handleLocalToggleChange}
      />

      <SaveButton 
        isSaving={isSaving}
        isDirty={isDirty}
        onClick={handleSaveChanges}
      />
    </div>
  );
};

export default AdvancedSettingsTab;

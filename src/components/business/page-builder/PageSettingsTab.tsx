import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLogoUpload } from "@/hooks/useLogoUpload";

// Import tab components
import GeneralSettingsTab from "./settings-tabs/GeneralSettingsTab";
import AppearanceSettingsTab from "./settings-tabs/AppearanceSettingsTab";
import SocialMediaSettingsTab from "./settings-tabs/SocialMediaSettingsTab";
import AdvancedSettingsTab from "./settings-tabs/AdvancedSettingsTab";

interface PageSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    chatbot_code?: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
  };
  businessId?: string;
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSavePageSettings: () => void;
  updatePage: ReturnType<typeof useMutation<BusinessPage, Error, any>>;
  autoSavePageSettings?: (pageData: Partial<BusinessPage>) => void;
  getPublicPageUrl: () => string;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({
  pageData,
  businessId,
  handlePageDataChange,
  handleToggleChange,
  handleSavePageSettings,
  updatePage,
  autoSavePageSettings,
  getPublicPageUrl
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink } = useBusinessSocialLinks(businessId);
  
  // Set up debounced auto-save - no need for async/await anymore
  const debouncedAutoSave = useDebouncedCallback((data) => {
    if (autoSavePageSettings) {
      autoSavePageSettings(data);
      setIsDirty(false);
    }
  }, 2000);
  
  // Custom input change handler that triggers auto-save
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handlePageDataChange(e);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      const { name, value } = e.target;
      debouncedAutoSave({
        ...pageData,
        [name]: value
      });
    }
  };
  
  // Custom toggle change handler that triggers auto-save
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    handleToggleChange(name, checked);
    setIsDirty(true);
    
    if (autoSavePageSettings) {
      debouncedAutoSave({
        ...pageData,
        [name]: checked
      });
    }
  };

  // Logo upload functionality
  const { uploadingLogo, handleLogoUpload } = useLogoUpload(
    businessId, 
    (logoUrl) => {
      if (autoSavePageSettings) {
        autoSavePageSettings({
          ...pageData,
          logo_url: logoUrl
        });
      }
    }
  );
  
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <GeneralSettingsTab
          pageData={pageData}
          businessId={businessId}
          handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
          handleToggleWithAutoSave={handleToggleWithAutoSave}
          handleLogoUpload={handleLogoUpload}
          getPublicPageUrl={getPublicPageUrl}
          uploadingLogo={uploadingLogo}
        />
      </TabsContent>
      
      <TabsContent value="appearance">
        <AppearanceSettingsTab
          pageData={pageData}
          handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
        />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialMediaSettingsTab
          socialLinks={socialLinks || []}
          addSocialLink={addSocialLink.mutate}
          updateSocialLink={updateSocialLink.mutate}
          deleteSocialLink={deleteSocialLink.mutate}
        />
      </TabsContent>
      
      <TabsContent value="advanced">
        <AdvancedSettingsTab
          pageData={pageData}
          handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
          handleToggleWithAutoSave={handleToggleWithAutoSave}
        />
      </TabsContent>
      
      <div className="flex justify-between mt-6">
        {isDirty && (
          <p className="text-xs text-muted-foreground">
            Auto-saving changes...
          </p>
        )}
        <Button 
          onClick={handleSavePageSettings} 
          disabled={updatePage.isPending}
          className="ml-auto"
        >
          {updatePage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </Tabs>
  );
};

export default PageSettingsTab;

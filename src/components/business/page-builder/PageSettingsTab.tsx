
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GeneralSettingsTab from "./settings-tabs/GeneralSettingsTab";
import AppearanceSettingsTab from "./settings-tabs/AppearanceSettingsTab";
import SocialMediaSettingsTab from "./settings-tabs/SocialMediaSettingsTab";
import AdvancedSettingsTab from "./settings-tabs/AdvancedSettingsTab";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageSettingsTabProps {
  pageData: any;
  businessId: string;
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  getPublicPageUrl: () => string;
  updatePage: any;
}

const PageSettingsTab = ({ 
  pageData, 
  businessId,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  getPublicPageUrl,
  updatePage
}: PageSettingsTabProps) => {
  const isMobile = useIsMobile();
  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  
  const handleLogoUpload = (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder for logo upload functionality
    setUploadingLogo(true);
    setTimeout(() => {
      setUploadingLogo(false);
    }, 1000);
  };
  
  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettingsTab 
            pageData={pageData} 
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            handleToggleWithAutoSave={handleToggleWithAutoSave}
            handleLogoUpload={handleLogoUpload}
            getPublicPageUrl={getPublicPageUrl}
            uploadingLogo={uploadingLogo}
            updatePage={updatePage}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettingsTab 
            pageData={pageData} 
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            updatePage={updatePage}
          />
        </TabsContent>
        
        <TabsContent value="social">
          <SocialMediaSettingsTab 
            businessId={businessId}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSettingsTab 
            pageData={pageData}
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            handleToggleWithAutoSave={handleToggleWithAutoSave}
            updatePage={updatePage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageSettingsTab;

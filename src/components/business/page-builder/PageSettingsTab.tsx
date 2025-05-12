
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GeneralSettingsTab from "./settings-tabs/GeneralSettingsTab";
import AppearanceSettingsTab from "./settings-tabs/AppearanceSettingsTab";
import SocialMediaSettingsTab from "./settings-tabs/SocialMediaSettingsTab";
import AdvancedSettingsTab from "./settings-tabs/AdvancedSettingsTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { useLogoUpload } from "@/hooks/useLogoUpload";

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
  const { uploadingLogo, handleLogoUpload } = useLogoUpload(
    businessId, 
    (logoUrl) => {
      console.log("Logo uploaded successfully:", logoUrl);
      handleInputChangeWithAutoSave({
        target: {
          name: 'logo_url',
          value: logoUrl
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  );
  
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
            getPublicPageUrl={() => '#'} // Return placeholder # instead of URL
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
            pageData={pageData}
            updatePage={updatePage}
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
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


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettingsTab from "./settings-tabs/GeneralSettingsTab";
import AppearanceSettingsTab from "./settings-tabs/AppearanceSettingsTab";
import SocialMediaSettingsTab from "./settings-tabs/SocialMediaSettingsTab";
import AdvancedSettingsTab from "./settings-tabs/AdvancedSettingsTab";
import { UseMutationResult } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";

interface PageSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    chatbot_code: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
  };
  businessId: string;
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  getPublicPageUrl: () => string;
  updatePage: UseMutationResult<any, unknown, { pageId: string; data: any; }, unknown>;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({
  pageData,
  businessId,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  getPublicPageUrl,
  updatePage
}) => {
  const handleColorChange = (name: string, value: string) => {
    updatePage.mutate({
      pageId: updatePage.variables?.pageId,
      data: { [name]: value }
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    updatePage.mutate({
      pageId: updatePage.variables?.pageId,
      data: { [name]: value }
    });
  };
  
  return (
    <div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
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
            getPublicPageUrl={getPublicPageUrl}
            updatePage={updatePage}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettingsTab 
            pageData={pageData as Partial<BusinessPage>}
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            handleToggleWithAutoSave={handleToggleWithAutoSave}
            handleColorChange={handleColorChange}
            handleSelectChange={handleSelectChange}
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

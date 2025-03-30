
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
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSavePageSettings: () => void;
  updatePage: any;
  autoSavePageSettings: (name: string, value: any) => void;
  getPublicPageUrl: () => string;
}

const PageSettingsTab = ({ 
  pageData, 
  businessId,
  handlePageDataChange, 
  handleToggleChange,
  handleSavePageSettings,
  updatePage,
  autoSavePageSettings,
  getPublicPageUrl
}: PageSettingsTabProps) => {
  const isMobile = useIsMobile();
  
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
            handlePageDataChange={handlePageDataChange}
            getPublicPageUrl={getPublicPageUrl}
            autoSavePageSettings={autoSavePageSettings}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettingsTab 
            pageData={pageData} 
            handlePageDataChange={handlePageDataChange}
            autoSavePageSettings={autoSavePageSettings}
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
            handlePageDataChange={handlePageDataChange}
            handleToggleChange={handleToggleChange}
            autoSavePageSettings={autoSavePageSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageSettingsTab;

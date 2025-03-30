
import React, { useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateBusinessPageForm from "./CreateBusinessPageForm";
import { PageSectionsTab } from "./sections";
import PageSettingsTab from "./PageSettingsTab";
import PagePreviewTab from "./PagePreviewTab";
import { useIsMobile } from "@/hooks/use-mobile";

const BusinessPageBuilder = () => {
  const { 
    ownerBusinessPage, 
    pageSections, 
    updatePage,
    createPage,
    isLoading,
    autoSavePage,
    autoSaveField,
    getPublicPageUrl
  } = useBusinessPage();
  
  const isMobile = useIsMobile();
  
  // Create state for editable page data
  const [pageData, setPageData] = React.useState({
    page_title: "",
    page_slug: "",
    description: "",
    is_published: false,
    chatbot_enabled: false,
    chatbot_code: "",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    logo_url: ""
  });
  
  // Update local state from fetched data
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageData({
        page_title: ownerBusinessPage.page_title || "",
        page_slug: ownerBusinessPage.page_slug || "",
        description: ownerBusinessPage.description || "",
        is_published: ownerBusinessPage.is_published || false,
        chatbot_enabled: ownerBusinessPage.chatbot_enabled || false,
        chatbot_code: ownerBusinessPage.chatbot_code || "",
        primary_color: ownerBusinessPage.primary_color || "#3B82F6",
        secondary_color: ownerBusinessPage.secondary_color || "#10B981",
        logo_url: ownerBusinessPage.logo_url || ""
      });
    }
  }, [ownerBusinessPage]);
  
  const handlePageDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setPageData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSavePageSettings = () => {
    if (ownerBusinessPage) {
      updatePage.mutate(pageData);
    } else {
      createPage.mutate(pageData);
    }
  };

  // Create a function that handles input changes and auto-saves
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
    autoSaveField(name, value);
  };

  // Create a function that handles toggle changes and auto-saves
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    setPageData(prev => ({ ...prev, [name]: checked }));
    autoSaveField(name, checked);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!ownerBusinessPage) {
    return (
      <CreateBusinessPageForm
        pageData={pageData}
        handlePageDataChange={handlePageDataChange}
        createPage={createPage}
        handleSavePageSettings={handleSavePageSettings}
      />
    );
  }
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Business Landing Page Builder</h1>
      
      <Tabs defaultValue="sections">
        <TabsList className="mb-4 sm:mb-6">
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        {/* Page Sections Tab */}
        <TabsContent value="sections">
          <PageSectionsTab 
            pageSections={pageSections} 
            businessPageId={ownerBusinessPage.id}
            getPublicPageUrl={getPublicPageUrl}
          />
        </TabsContent>
        
        {/* Page Settings Tab */}
        <TabsContent value="settings">
          <PageSettingsTab
            pageData={pageData}
            businessId={ownerBusinessPage.business_id}
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            handleToggleWithAutoSave={handleToggleWithAutoSave}
            getPublicPageUrl={getPublicPageUrl}
            updatePage={updatePage}
          />
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview">
          <PagePreviewTab getPublicPageUrl={getPublicPageUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessPageBuilder;

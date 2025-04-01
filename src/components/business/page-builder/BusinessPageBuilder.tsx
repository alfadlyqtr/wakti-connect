
import React, { useEffect, useState } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateBusinessPageForm from "./CreateBusinessPageForm";
import { PageSectionsTab } from "./sections";
import PageSettingsTab from "./PageSettingsTab";
import PagePreviewTab from "./PagePreviewTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

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
  const [pageData, setPageData] = useState({
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
      console.log("Updating page data from owner business page:", ownerBusinessPage);
      
      setPageData({
        page_title: ownerBusinessPage.page_title || "",
        page_slug: ownerBusinessPage.page_slug || "",
        description: ownerBusinessPage.description || "",
        is_published: ownerBusinessPage.is_published || false,
        chatbot_enabled: ownerBusinessPage.chatbot_enabled || false,
        chatbot_code: ownerBusinessPage.chatbot_code || "",
        primary_color: ownerBusinessPage.primary_color || "#3B82F6",
        secondary_color: ownerBusinessPage.secondary_color || "#10B981",
        logo_url: ownerBusinessPage.logo_url || "",
        // Add any additional fields that need to be handled
        text_color: ownerBusinessPage.text_color || "",
        font_family: ownerBusinessPage.font_family || "",
        border_radius: ownerBusinessPage.border_radius || "",
        page_pattern: ownerBusinessPage.page_pattern || "",
        background_color: ownerBusinessPage.background_color || "",
        subscribe_button_position: ownerBusinessPage.subscribe_button_position || "both",
        subscribe_button_style: ownerBusinessPage.subscribe_button_style || "default",
        subscribe_button_size: ownerBusinessPage.subscribe_button_size || "default",
        social_icons_style: ownerBusinessPage.social_icons_style || "default",
        social_icons_size: ownerBusinessPage.social_icons_size || "default",
        social_icons_position: ownerBusinessPage.social_icons_position || "footer",
        content_max_width: ownerBusinessPage.content_max_width || "1200px",
        section_spacing: ownerBusinessPage.section_spacing || "default",
        show_subscribe_button: ownerBusinessPage.show_subscribe_button !== false, // Default to true
        subscribe_button_text: ownerBusinessPage.subscribe_button_text || "Subscribe"
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
      // Log what we're saving
      console.log("Saving page settings:", pageData);
      
      updatePage.mutate({ 
        pageId: ownerBusinessPage.id,
        data: pageData
      }, {
        onSuccess: () => {
          toast({
            title: "Settings saved",
            description: "Your page settings have been updated successfully.",
          });
        },
        onError: (error: any) => {
          console.error("Failed to save page settings:", error);
          toast({
            variant: "destructive",
            title: "Save failed",
            description: "Failed to save page settings. Please try again.",
          });
        }
      });
    } else {
      createPage.mutate(pageData, {
        onSuccess: () => {
          toast({
            title: "Page created",
            description: "Your business page has been created successfully.",
          });
        },
        onError: (error: any) => {
          console.error("Failed to create page:", error);
          toast({
            variant: "destructive",
            title: "Creation failed",
            description: "Failed to create business page. Please try again.",
          });
        }
      });
    }
  };

  // Create a function that handles input changes and auto-saves
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    console.log(`Handling input change with auto-save for ${name}:`, value);
    
    setPageData(prev => ({ ...prev, [name]: value }));
    
    // Wrap in try-catch to prevent any errors from breaking functionality
    try {
      autoSaveField(name, value);
    } catch (error) {
      console.error(`Error in auto-saving field ${name}:`, error);
    }
  };

  // Create a function that handles toggle changes and auto-saves
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    console.log(`Handling toggle change with auto-save for ${name}:`, checked);
    
    setPageData(prev => ({ ...prev, [name]: checked }));
    
    // Wrap in try-catch to prevent any errors from breaking functionality
    try {
      autoSaveField(name, checked);
    } catch (error) {
      console.error(`Error in auto-saving toggle ${name}:`, error);
    }
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

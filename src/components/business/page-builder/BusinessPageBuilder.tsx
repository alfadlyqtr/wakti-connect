import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { BusinessPage } from "@/types/business.types";
import { useAuth } from "@/hooks/useAuth/index";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import PageBuilderEmptyState from "./PageBuilderEmptyState";
import { BusinessPageContext } from "./context/BusinessPageContext";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { toast } from "@/components/ui/use-toast";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { generateSlug } from "@/utils/string-utils";

// The main business page builder component
const BusinessPageBuilder: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id || "");
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  // Query to fetch the business page data - passing user ID properly
  const {
    data: pageData,
    isLoading,
    error,
    refetch
  } = useBusinessPageDataQuery(user?.id || undefined);
  
  // Mutations for creating and updating page data
  const createPageMutation = useCreateBusinessPageDataMutation();
  const updatePageMutation = useUpdateBusinessPageDataMutation();
  
  // Function to generate or update slug if needed
  const ensureValidSlug = (data: any) => {
    // If no pageSlug in page_data, generate one from business name
    if (!data.page_data.pageSlug && data.page_data.pageSetup?.businessName) {
      const generatedSlug = generateSlug(data.page_data.pageSetup.businessName);
      return {
        ...data,
        page_data: {
          ...data.page_data,
          pageSlug: generatedSlug
        }
      };
    }
    return data;
  };
  
  // Function to handle publishing the page
  const handlePublish = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to publish a page.",
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      if (pageData) {
        // Ensure the page data has a valid slug
        const updatedPageData = ensureValidSlug(pageData);
        
        // If page data exists, update it with published flag set to true
        await updatePageMutation.mutateAsync({
          id: updatedPageData.id,
          pageData: {
            ...updatedPageData.page_data,
            published: true
          }
        });
        toast({
          title: "Success",
          description: "Your page has been published successfully!",
        });
        
        // Refetch to get the latest data
        refetch();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You need to save your page before publishing.",
        });
      }
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish your page. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Function to handle saving page data
  const handleSavePageData = async (updatedPageData: any) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save changes.",
      });
      return;
    }
    
    setSaveStatus('saving');
    
    try {
      // Ensure there's a valid slug
      const dataWithSlug = {
        ...updatedPageData,
        pageSlug: updatedPageData.pageSlug || 
                 (updatedPageData.pageSetup?.businessName ? 
                   generateSlug(updatedPageData.pageSetup.businessName) : 
                   undefined)
      };
      
      if (pageData) {
        // Update existing page data
        await updatePageMutation.mutateAsync({
          id: pageData.id,
          pageData: dataWithSlug
        });
      } else {
        // Create new page data
        await createPageMutation.mutateAsync({
          userId: user.id,
          pageData: dataWithSlug
        });
      }
      
      setSaveStatus('saved');
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      });
      
      // Refetch to get the latest data including any generated slugs
      refetch();
    } catch (error) {
      console.error("Error saving page data:", error);
      setSaveStatus('unsaved');
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your changes. Please try again.",
      });
    }
  };
  
  // Function to update specific sections of page data
  const handleUpdateSection = (sectionKey: string, newData: any) => {
    if (!pageData) return;
    
    setSaveStatus('unsaved');
    
    const updatedPageData = {
      ...pageData.page_data,
      [sectionKey]: newData
    };
    
    // Auto-save after section updates
    handleSavePageData(updatedPageData);
  };
  
  // If still loading, display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your page builder...</p>
        </div>
      </div>
    );
  }
  
  // If there's an error, display error state
  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">
          Could not load your business page. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // If no page data exists, show empty state
  if (!pageData) {
    return <PageBuilderEmptyState createPage={createPageMutation.mutateAsync} />;
  }
  
  // Create a page data context provider and render the page builder interface
  return (
    <BusinessPageContext.Provider value={{
      pageData: pageData.page_data,
      updatePageData: handleSavePageData,
      updateSectionData: handleUpdateSection,
      saveStatus: saveStatus,
      handleSave: () => handleSavePageData(pageData.page_data as any)
    }}>
      <Helmet>
        <title>Business Page Builder | WAKTI</title>
      </Helmet>
      <div className="flex h-full max-h-screen">
        <LeftPanel isPublishing={isPublishing} onPublish={handlePublish} />
        <PreviewPanel />
      </div>
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;


import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { BusinessPage } from "@/types/business.types";
import { useAuth } from "@/hooks/useAuth/index"; // Using correct import path
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import PageBuilderEmptyState from "./PageBuilderEmptyState";
import { BusinessPageContext } from "./context/BusinessPageContext";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { toast } from "@/components/ui/use-toast";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";

// The main business page builder component
const BusinessPageBuilder: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id || ""); // Provide user ID or empty string to prevent error
  
  const [isPublishing, setIsPublishing] = useState(false);
  
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
  
  // Function to handle publishing the page
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      if (pageData) {
        // If page data exists, update it with published flag set to true
        await updatePageMutation.mutateAsync({
          id: pageData.id,
          pageData: {
            ...pageData.page_data,
            published: true
          }
        });
        toast({
          title: "Success",
          description: "Your page has been published successfully!",
        });
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
      updatePageData: () => {}, // We'll implement this in a future update
      updateSectionData: () => {}, // We'll implement this in a future update
      saveStatus: 'saved',
      handleSave: async () => {} // We'll implement this in a future update
    }}>
      <div className="flex h-full max-h-screen">
        <LeftPanel isPublishing={isPublishing} onPublish={handlePublish} />
        <PreviewPanel />
      </div>
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;

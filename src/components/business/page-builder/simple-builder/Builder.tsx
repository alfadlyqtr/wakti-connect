
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth/index";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { BusinessPageData } from "./types";
import TopBar from "./TopBar";
import { toast } from "@/components/ui/use-toast";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import SimpleLoading from "./SimpleLoading";
import { generateSlug } from "@/utils/string-utils";

// Create a default page data structure with basic setup
const createDefaultPageData = (businessName: string = "My Business"): BusinessPageData => ({
  pageSetup: {
    businessName,
    alignment: "center",
    visible: true,
  },
  logo: {
    url: "",
    shape: "circle",
    alignment: "center",
    visible: true,
  },
  bookings: {
    viewStyle: "grid",
    templates: [],
    visible: true,
  },
  socialInline: {
    style: "icon",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: true,
  },
  workingHours: {
    layout: "card",
    hours: [],
    visible: true,
  },
  chatbot: {
    position: "right",
    embedCode: "",
    visible: false,
  },
  theme: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontStyle: "sans-serif",
  },
  socialSidebar: {
    position: "right",
    platforms: {
      whatsapp: false,
      whatsappBusiness: false,
      facebook: false,
      instagram: false,
      googleMaps: false,
      phone: false,
      email: false,
    },
    visible: false,
  },
  contactInfo: {
    email: "",
    whatsapp: "",
    whatsappBusiness: "",
    phone: "",
    facebook: "",
    googleMaps: "",
    instagram: "",
  },
  sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
  published: false,
  pageSlug: "",
});

const Builder = () => {
  const { user } = useAuth();
  const [pageData, setPageData] = useState<BusinessPageData | null>(null);
  const [isEditMode, setEditMode] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Query to fetch business page data
  const { 
    data: fetchedPageData, 
    isLoading,
    refetch 
  } = useBusinessPageDataQuery(user?.id);
  
  // Mutations for creating and updating business page data
  const createMutation = useCreateBusinessPageDataMutation();
  const updateMutation = useUpdateBusinessPageDataMutation();
  
  // Initialize page data when fetched or create default if none exists
  useEffect(() => {
    if (isLoading) return;
    
    if (fetchedPageData) {
      setPageData(fetchedPageData.page_data as BusinessPageData);
    } else if (user) {
      // Create default page data if none exists
      setPageData(createDefaultPageData());
    }
  }, [fetchedPageData, isLoading, user]);
  
  // Function to update a specific section of the page data
  const handleSectionUpdate = (sectionKey: string, newSectionData: any) => {
    if (!pageData) return;
    
    setPageData(prevData => {
      if (!prevData) return prevData;
      
      return {
        ...prevData,
        [sectionKey]: newSectionData
      };
    });
  };
  
  // Function to validate slug format
  const validateAndFormatSlug = (slug: string | undefined): string => {
    if (!slug || slug.trim() === '') {
      // Generate slug from business name if available
      if (pageData?.pageSetup?.businessName) {
        return generateSlug(pageData.pageSetup.businessName);
      }
      return 'my-business'; // Default fallback
    }
    
    // Return formatted slug (already processed by generateSlug)
    return slug;
  };
  
  // Handle save operation
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your changes",
        variant: "destructive",
      });
      return;
    }
    
    if (!pageData) {
      toast({
        title: "No data to save",
        description: "Please create your business page first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Ensure we have a valid slug
      const validatedSlug = validateAndFormatSlug(pageData.pageSlug);
      
      // Create a copy of the pageData with the validated slug
      const dataToSave = {
        ...pageData,
        pageSlug: validatedSlug
      };
      
      if (fetchedPageData) {
        // Update existing page
        await updateMutation.mutateAsync({
          id: fetchedPageData.id,
          pageData: dataToSave
        });
      } else {
        // Create new page
        await createMutation.mutateAsync({
          userId: user.id,
          pageData: dataToSave
        });
      }
      
      toast({
        title: "Changes saved",
        description: "Your business page has been saved",
      });
      
      // Refetch to get the latest data
      refetch();
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle publish operation
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to publish your page",
        variant: "destructive",
      });
      return;
    }
    
    if (!pageData) return;
    
    setIsPublishing(true);
    
    try {
      // Ensure we have a valid slug before publishing
      const validatedSlug = validateAndFormatSlug(pageData.pageSlug);
      
      // Prepare the data to be published
      const dataToPublish = {
        ...pageData,
        published: true,
        pageSlug: validatedSlug
      };
      
      if (fetchedPageData) {
        // Update existing page with published flag
        await updateMutation.mutateAsync({
          id: fetchedPageData.id, 
          pageData: dataToPublish
        });
      } else {
        // Create new page with published flag
        await createMutation.mutateAsync({
          userId: user.id,
          pageData: dataToPublish
        });
      }
      
      toast({
        title: "Page published",
        description: "Your business page is now live",
      });
      
      // Refetch to get the latest data
      refetch();
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        title: "Publish failed",
        description: "There was a problem publishing your page",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
  };
  
  if (isLoading) {
    return <SimpleLoading />;
  }
  
  if (!pageData) {
    return <SimpleLoading />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={pageData.pageUrl || ''}
        onPreview={toggleEditMode}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setEditMode}
        pageSettings={{
          title: pageData.pageSetup?.businessName || "",
          slug: pageData.pageSlug || "",
          description: pageData.pageSetup?.description || "",
          primaryColor: pageData.theme.backgroundColor || "#ffffff",
          secondaryColor: pageData.theme.textColor || "#000000",
          fontFamily: pageData.theme.fontStyle || "sans-serif",
          textColor: pageData.theme.textColor || "#000000",
          backgroundColor: pageData.theme.backgroundColor || "#ffffff",
          isPublished: pageData.published || false,
          contactInfo: {
            email: pageData.contactInfo.email || "",
            phone: pageData.contactInfo.phone || "",
            address: "",
            whatsapp: pageData.contactInfo.whatsapp || ""
          },
          socialLinks: {
            facebook: pageData.contactInfo.facebook || "",
            instagram: pageData.contactInfo.instagram || "",
            twitter: "",
            linkedin: ""
          },
          businessHours: pageData.workingHours.hours || [],
          googleMapsUrl: pageData.contactInfo.googleMaps || "",
          tmwChatbotCode: pageData.chatbot.embedCode || "",
        }}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {isEditMode ? (
          <EditorPanel 
            pageData={pageData} 
            onSectionUpdate={handleSectionUpdate} 
            onSave={handleSave}
          />
        ) : null}
        <PagePreview 
          pageData={pageData}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default Builder;

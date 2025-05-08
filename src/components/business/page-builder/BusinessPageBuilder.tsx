import React, { useState, useEffect } from "react";
import SettingsDialog from "./components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { TopBar } from "./components/TopBar";
import LeftPanel from "./components/LeftPanel";
import PreviewPanel from "./components/PreviewPanel";
import { BusinessPageContext, BusinessPageData } from "./context/BusinessPageContext";
import { useUpdatePageMutation } from "@/hooks/useUpdatePageMutation";
import useIsSuperAdmin from "@/hooks/useIsSuperAdmin";
import { toast } from "@/components/ui/use-toast";
import { generateSlug } from "@/utils/string-utils";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

// Initial state for the business page data
const initialPageData: BusinessPageData = {
  pageSetup: {
    businessName: "My Business Page",
    alignment: "left",
    visible: true,
  },
  heroSection: {
    visible: true,
    title: "Your Headline Here",
    subtitle: "A compelling description of your business.",
    imageUrl: "https://via.placeholder.com/800x400",
    primaryButtonText: "Learn More",
    secondaryButtonText: "Contact Us",
  },
  featuresSection: {
    visible: true,
    title: "Key Features",
    features: [
      { id: "1", title: "Feature 1", description: "Description of feature 1" },
      { id: "2", title: "Feature 2", description: "Description of feature 2" },
      { id: "3", title: "Feature 3", description: "Description of feature 3" },
    ],
  },
  gallerySection: {
    visible: true,
    title: "Our Gallery",
    images: [
      { id: "1", url: "https://via.placeholder.com/400x300" },
      { id: "2", url: "https://via.placeholder.com/400x300" },
      { id: "3", url: "https://via.placeholder.com/400x300" },
    ],
  },
  testimonialsSection: {
    visible: true,
    title: "What Our Clients Say",
    testimonials: [
      { id: "1", author: "John Doe", content: "Great service!" },
      { id: "2", author: "Jane Smith", content: "Highly recommended." },
    ],
  },
  contactSection: {
    visible: true,
    title: "Contact Us",
    email: "info@example.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown",
  },
  footerSection: {
    visible: true,
    content: "© 2024 My Business. All rights reserved.",
  },
  themeSettings: {
    primaryColor: "#007BFF",
    secondaryColor: "#6C757D",
    backgroundColor: "#F8F9FA",
    textColor: "#343A40",
    fontFamily: "Arial, sans-serif",
  },
  advancedSettings: {
    customCss: "",
    googleAnalyticsCode: "",
    isMobileFriendly: true,
    isSearchable: true,
  },
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
  logo_url: "",
  sectionsOrder: [
    "pageSetup",
    "heroSection",
    "featuresSection",
    "gallerySection",
    "testimonialsSection",
    "contactSection",
    "footerSection",
  ],
};

export default function BusinessPageBuilder() {
  const [pageData, setPageData] = useState<BusinessPageData>(initialPageData);
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);
  const updatePageMutation = useUpdatePageMutation();
  
  // State for user profile data
  const [userId, setUserId] = useState<string>("");
  
  // Fetch the current user ID first
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error("Error getting user:", error);
          return;
        }
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Get the user's profile data to access the business_name for the URL
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  
  // Load saved page data from Supabase if available
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Error getting user:", userError);
          return;
        }
        
        const { data, error } = await supabase
          .from("business_pages")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code !== "PGRST116") {  // PGRST116 = no rows returned
            console.error("Error loading page data:", error);
          }
          return;
        }
        
        if (data && data.page_data) {
          setPageData(data.page_data as BusinessPageData);
        }
      } catch (error) {
        console.error("Failed to load page data:", error);
      }
    };
    
    loadPageData();
  }, []);
  
  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      setLastSaveAttempt(new Date());
      
      // Generate a slug from the business name in profile settings, not the page title
      // This ensures the URL is based on the business name in account settings
      let pageSlug = "";
      
      if (profile?.business_name) {
        pageSlug = generateSlug(profile.business_name);
      } else {
        // If no business name is set in profile, inform the user
        toast({
          variant: "destructive",
          title: "Missing business name",
          description: "Please set your business name in your account settings to generate a URL."
        });
        setSaveStatus("unsaved");
        return;
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error getting user:", userError);
        setSaveStatus("unsaved");
        return;
      }
      
      const { data, error } = await updatePageMutation.mutateAsync({
        userId: user.id,
        pageData,
        pageSlug
      });
      
      if (error) {
        console.error("Error saving page:", error);
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save page changes."
        });
        setSaveStatus("unsaved");
        return;
      }
      
      toast({
        title: "Page saved successfully",
        description: "Your page changes have been saved."
      });
      setSaveStatus("saved");
    } catch (error) {
      console.error("Failed to save page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "An unexpected error occurred while saving."
      });
      setSaveStatus("unsaved");
    }
  };
  
  const handleSectionDataUpdate = (sectionName: string, sectionData: any) => {
    setPageData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        ...sectionData
      }
    }));
    
    setSaveStatus("unsaved");
  };
  
  const handleToggleSection = (sectionName: string, visible: boolean) => {
    setPageData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        visible
      }
    }));
    
    setSaveStatus("unsaved");
  };
  
  const toggleSettingsDialog = () => {
    setShowSettings(!showSettings);
  };
  
  // Get public page URL based on the user's business name from profile
  const getPublicPageUrl = () => {
    if (profile?.business_name) {
      const slug = generateSlug(profile.business_name);
      return `https://wakti.qa/${slug}`;
    }
    return "#";
  };
  
  // Define the context value
  const contextValue = {
    pageData,
    updateSectionData: handleSectionDataUpdate,
    toggleSectionVisibility: handleToggleSection,
    saveStatus,
    handleSave,
    getPublicPageUrl
  };
  
  const closeSettingsDialog = () => {
    setShowSettings(false);
  };
  
  return (
    <BusinessPageContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        <TopBar 
          onSettingsClick={toggleSettingsDialog} 
          pageData={pageData}
          businessName={profile?.business_name}
        />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <PreviewPanel />
        </div>
        
        {showSettings && (
          <SettingsDialog 
            open={showSettings} 
            onClose={closeSettingsDialog} 
          />
        )}
      </div>
    </BusinessPageContext.Provider>
  );
}

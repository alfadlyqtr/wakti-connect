
import React, { useState, useEffect } from "react";
import { SettingsDialog } from "./components/SettingsDialog";
import { TopBar } from "./components/TopBar";
import { Separator } from "@/components/ui/separator";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdatePageMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BusinessPageContext, 
  BusinessPageData, 
  BusinessPageContextType 
} from "./context/BusinessPageContext";

const BusinessPageBuilder: React.FC = () => {
  // Initial page data state
  const [pageData, setPageData] = useState<BusinessPageData>({
    pageSetup: {
      businessName: "My Business",
      alignment: "center",
      visible: true
    },
    logo: {
      url: "",
      shape: "square",
      alignment: "center",
      visible: true
    },
    bookings: {
      viewStyle: "grid",
      templates: [],
      visible: true
    },
    socialInline: {
      style: "icon",
      platforms: {
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true
      },
      visible: true
    },
    workingHours: {
      layout: "card",
      hours: [
        { day: "Monday", open: "09:00", close: "17:00", closed: false },
        { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
        { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
        { day: "Thursday", open: "09:00", close: "17:00", closed: false },
        { day: "Friday", open: "09:00", close: "17:00", closed: false },
        { day: "Saturday", open: "10:00", close: "14:00", closed: true },
        { day: "Sunday", open: "00:00", close: "00:00", closed: true }
      ],
      visible: true
    },
    chatbot: {
      position: "right",
      embedCode: "",
      visible: false
    },
    theme: {
      backgroundColor: "#ffffff",
      textColor: "#333333",
      fontStyle: "sans-serif"
    },
    socialSidebar: {
      position: "right",
      platforms: {
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true
      },
      visible: false
    },
    contactInfo: {
      email: "",
      whatsapp: "",
      whatsappBusiness: "",
      phone: "",
      facebook: "",
      googleMaps: "",
      instagram: ""
    },
    sectionOrder: [
      "pageSetup",
      "logo",
      "bookings",
      "socialInline",
      "workingHours"
    ],
    published: false
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    fetchUser();
  }, []);
  
  // Get the user's profile data to access the business_name for the URL
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId || "");
  const updatePageMutation = useUpdatePageMutation();
  
  // Update page data
  const updatePageData = (data: Partial<BusinessPageData>) => {
    setPageData(prev => ({ ...prev, ...data }));
    setSaveStatus("unsaved");
  };
  
  // Update a specific section in the page data
  const updateSectionData = <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => {
    setPageData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setSaveStatus("unsaved");
  };
  
  // Toggle visibility of a section
  const toggleSectionVisibility = (sectionName: keyof BusinessPageData, visible: boolean) => {
    if (sectionName in pageData && 'visible' in pageData[sectionName]) {
      updateSectionData(sectionName, { visible } as any);
    }
  };
  
  // Handle saving the page
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      // This would be replaced with actual API call in a real app
      // Example: await updatePage({ id: page.id, data: pageData })
      console.log("Saving page data:", pageData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus("saved");
      toast({
        title: "Page saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving page:", error);
      setSaveStatus("unsaved");
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your changes."
      });
    }
  };
  
  // Get the public page URL
  const getPublicPageUrl = () => {
    // Use business_name from profile if available, otherwise use a generic placeholder
    if (profile && profile.business_name) {
      const slug = profile.business_name.toLowerCase().replace(/\s+/g, '-');
      return `www.wakti.qa/${slug}`;
    }
    return "www.wakti.qa/your-business-name";
  };
  
  // Context value
  const contextValue: BusinessPageContextType = {
    pageData,
    updatePageData,
    updateSectionData,
    saveStatus,
    handleSave,
  };

  return (
    <BusinessPageContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        <TopBar 
          onSettingsClick={() => setSettingsOpen(true)} 
          pageData={pageData}
          businessName={profile?.business_name} 
        />
        <Separator />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 p-4 overflow-auto">
            <PreviewPanel />
          </div>
        </div>
        <SettingsDialog 
          open={settingsOpen} 
          onClose={() => setSettingsOpen(false)} 
        />
      </div>
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;

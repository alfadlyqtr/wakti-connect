
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TopBar } from "./components/TopBar";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { BusinessPageContext, BusinessPageData } from "./context/BusinessPageContext";
import { SettingsDialog } from "./components/SettingsDialog";
import { useUpdatePageMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { toast } from "@/components/ui/use-toast";
import { generateSlug } from "@/utils/string-utils";
import { supabase } from "@/integrations/supabase/client";

// Initial state for the business page data
const initialPageData: BusinessPageData = {
  pageSetup: {
    businessName: "Your Business Name",
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
    visible: false,
    viewStyle: "grid",
    templates: []
  },
  socialInline: {
    visible: true,
    style: "icon",
    platforms: {
      whatsapp: true,
      whatsappBusiness: false,
      facebook: true,
      instagram: true,
      googleMaps: false,
      phone: true,
      email: true
    }
  },
  workingHours: {
    visible: true,
    layout: "card",
    hours: []
  },
  chatbot: {
    visible: false,
    position: "right",
    embedCode: ""
  },
  theme: {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontStyle: "sans-serif"
  },
  socialSidebar: {
    visible: false,
    position: "right",
    platforms: {
      whatsapp: true,
      whatsappBusiness: false,
      facebook: true,
      instagram: true,
      googleMaps: false,
      phone: true,
      email: true
    }
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
  sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
  published: false
};

const BusinessPageBuilder = () => {
  const [pageData, setPageData] = useState<BusinessPageData>(initialPageData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);
  const updatePageMutation = useUpdatePageMutation();
  
  // Load saved page data from Supabase if available
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: pageData, error } = await supabase
          .from('business_pages_data')
          .select('page_data, page_slug')
          .eq('user_id', user.id)
          .single();
        
        if (pageData?.page_data) {
          setPageData(pageData.page_data as unknown as BusinessPageData);
          setSaveStatus("saved");
        }
      } catch (error) {
        console.error("Error loading page data:", error);
      }
    };
    
    loadPageData();
  }, []);
  
  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      setLastSaveAttempt(new Date());
      
      // Generate a slug from the business name
      const pageSlug = generateSlug(pageData.pageSetup.businessName);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw userError || new Error("No authenticated user");
      }
      
      // Log the data being saved for debugging
      console.log("Saving page data:", {
        userId: user.id,
        pageSlug,
        pageData
      });
      
      // Save to Supabase - properly handling the types
      const { error } = await supabase
        .from('business_pages_data')
        .upsert({
          user_id: user.id,
          page_data: pageData as any, // Cast to any to avoid TypeScript errors with JSON types
          page_slug: pageSlug,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // If successful, update state
      setSaveStatus("saved");
      toast({
        title: "Changes saved",
        description: "Your page settings have been updated."
      });
    } catch (error: any) {
      console.error("Error saving page data:", error);
      setSaveStatus("unsaved");
      toast({
        variant: "destructive",
        title: "Error saving changes",
        description: error.message || "Failed to save changes. Please try again."
      });
    }
  };

  // Safe update function that avoids spread operator issues
  const updatePageData = (newData: Partial<BusinessPageData>) => {
    setPageData(prev => {
      const updated = { ...prev } as BusinessPageData;
      
      // Apply each property from newData to updated
      Object.keys(newData).forEach(key => {
        const typedKey = key as keyof BusinessPageData;
        if (newData[typedKey] !== undefined) {
          // Handle each property individually with proper typing
          updated[typedKey] = newData[typedKey] as any;
        }
      });
      
      return updated;
    });
    setSaveStatus("unsaved");
  };

  // Safe update for section data that avoids spread operator issues
  const updateSectionData = <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => {
    setPageData(prev => {
      // Create a new state object
      const updated = { ...prev } as BusinessPageData;
      
      // Get the current section data
      const currentSection = prev[section];
      
      // Type-safe way to update the section data
      if (typeof currentSection === 'object' && currentSection !== null) {
        // Create a new object with merged properties
        const mergedSection = {} as any;
        
        // Copy existing properties
        Object.keys(currentSection).forEach(key => {
          mergedSection[key] = (currentSection as any)[key];
        });
        
        // Apply updates
        Object.keys(data).forEach(key => {
          if ((data as any)[key] !== undefined) {
            mergedSection[key] = (data as any)[key];
          }
        });
        
        // Assign the new merged section
        updated[section] = mergedSection as BusinessPageData[K];
      }
      
      return updated;
    });
    setSaveStatus("unsaved");
  };

  const toggleSettingsDialog = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <BusinessPageContext.Provider 
      value={{ 
        pageData, 
        updatePageData, 
        updateSectionData, 
        saveStatus,
        handleSave 
      }}
    >
      <div className="flex flex-col min-h-screen bg-background">
        <TopBar 
          onSettingsClick={toggleSettingsDialog} 
          pageData={pageData}
        />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <div className="flex-1 p-4 overflow-auto">
            <PreviewPanel />
          </div>
        </div>
      </div>
      <SettingsDialog 
        open={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </BusinessPageContext.Provider>
  );
};

export default BusinessPageBuilder;


import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { TopBar } from "./components/TopBar";
import { LeftPanel } from "./components/LeftPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { BusinessPageContext, BusinessPageData } from "./context/BusinessPageContext";
import { SettingsDialog } from "./components/SettingsDialog";

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
  
  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      // Here we would save the data to the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving page data:", error);
      setSaveStatus("unsaved");
    }
  };

  // Fix the spread type error by explicitly typing the spread operation
  const updatePageData = (newData: Partial<BusinessPageData>) => {
    setPageData(prev => {
      const updated: BusinessPageData = { ...prev };
      // Apply each property from newData to updated
      Object.keys(newData).forEach(key => {
        const typedKey = key as keyof BusinessPageData;
        if (newData[typedKey] !== undefined) {
          (updated[typedKey] as any) = newData[typedKey];
        }
      });
      return updated;
    });
    setSaveStatus("unsaved");
  };

  // Fix the spread type error by handling section data properly
  const updateSectionData = <K extends keyof BusinessPageData>(
    section: K,
    data: Partial<BusinessPageData[K]>
  ) => {
    setPageData(prev => {
      const updated: BusinessPageData = { ...prev };
      
      // Directly copy the section to ensure type safety
      const currentSection = prev[section];
      
      // Create a new object by manually copying properties
      const updatedSection = { ...currentSection } as BusinessPageData[K];
      
      // Apply each property from data to updatedSection
      Object.keys(data).forEach(key => {
        const typedKey = key as keyof typeof data;
        if (data[typedKey] !== undefined) {
          // Type assertion to handle the assignment
          (updatedSection as any)[key] = data[typedKey];
        }
      });
      
      updated[section] = updatedSection;
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

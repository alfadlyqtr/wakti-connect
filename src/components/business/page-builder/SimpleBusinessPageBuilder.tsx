
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUpdatePageMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionType, PageSettings } from "./simple-builder/types";
import PagePreview from "./simple-builder/PagePreview";
import BookingSection from "./simple-builder/sections/BookingSection";
import EditorPanel from "./simple-builder/EditorPanel";
import TopBar from "./simple-builder/TopBar";
import SettingsTab from "./simple-builder/editor-tabs/SettingsTab";
import ThemeTab from "./simple-builder/editor-tabs/ThemeTab";

const SimpleBusinessPageBuilder = () => {
  // User session state
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  // Initialize with empty sections array
  const [sections, setSections] = useState<SectionType[]>([]);
  
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState("sections");
  
  const [isEditMode, setIsEditMode] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business Page",
    slug: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    description: "",
    isPublished: false,
    fontFamily: "Inter",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      whatsapp: ""
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    },
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: false },
      { day: "Sunday", hours: "Closed", isOpen: false }
    ],
    googleMapsUrl: "",
    tmwChatbotCode: ""
  });
  
  // Function to update a section
  const updateSection = (index: number, section: SectionType) => {
    console.log("Updating section:", index, section);
    const updatedSections = [...sections];
    updatedSections[index] = section;
    setSections(updatedSections);
    
    // Immediate UI feedback
    toast({
      title: "Section updated",
      description: `${section.type} section has been updated`,
      duration: 1500
    });
  };
  
  // Function to add a new section
  const addSection = (type: string) => {
    // Create new section with empty default content
    const newSection: SectionType = {
      id: Date.now().toString(), // Simple temporary ID
      type,
      title: "",
      subtitle: "",
      description: "",
      content: {},
      activeLayout: type === 'header' ? 'default' : 'standard'
    };
    
    setSections([...sections, newSection]);
    
    // Set the newly added section as active for immediate editing
    setActiveSectionIndex(sections.length);
    setActiveTab("sections");
    
    toast({
      title: "Section added",
      description: `New ${type} section has been added`,
    });
  };
  
  // Function to remove a section
  const removeSection = (index: number) => {
    const sectionType = sections[index].type;
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
    
    // If the active section was removed, clear the active section
    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    } else if (activeSectionIndex !== null && activeSectionIndex > index) {
      // If the active section was after the removed section, adjust the index
      setActiveSectionIndex(activeSectionIndex - 1);
    }
    
    toast({
      title: "Section removed",
      description: `${sectionType} section has been removed`,
    });
  };
  
  // Functions to move sections up and down
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    setSections(updatedSections);
    
    // Update active section index if needed
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index - 1);
    } else if (activeSectionIndex === index - 1) {
      setActiveSectionIndex(index);
    }
  };
  
  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updatedSections = [...sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    setSections(updatedSections);
    
    // Update active section index if needed
    if (activeSectionIndex === index) {
      setActiveSectionIndex(index + 1);
    } else if (activeSectionIndex === index + 1) {
      setActiveSectionIndex(index);
    }
  };
  
  // Fetch user's business ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setBusinessId(session.user.id);
      }
    };

    fetchUser();
  }, []);
  
  // Mock functions for top bar actions
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Changes saved",
        description: "Your page has been saved successfully",
      });
    }, 1500);
  };
  
  const handlePreview = () => {
    setIsEditMode(false);
    
    toast({
      title: "Preview mode",
      description: "You are now previewing your page",
    });
    
    // Switch back to edit mode after 5 seconds for demo purposes
    setTimeout(() => {
      setIsEditMode(true);
    }, 5000);
  };
  
  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      setPageSettings({
        ...pageSettings,
        isPublished: true
      });
      
      toast({
        title: "Page published",
        description: "Your page is now live",
      });
    }, 2000);
  };
  
  // Generate a mock page URL
  const pageUrl = pageSettings.isPublished && pageSettings.slug 
    ? `https://wakti.app/business/${pageSettings.slug}` 
    : '#';
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={pageUrl}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setIsEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <PagePreview 
            sections={sections}
            activeSection={activeSectionIndex !== null ? sections[activeSectionIndex] : undefined}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            addSection={addSection}
            pageSettings={pageSettings}
          />
        </div>
        
        <EditorPanel 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sections={sections}
          pageSettings={pageSettings}
          setPageSettings={setPageSettings}
          activeSectionIndex={activeSectionIndex}
          updateSection={updateSection}
          addSection={addSection}
          removeSection={removeSection}
          moveSectionUp={moveSectionUp}
          moveSectionDown={moveSectionDown}
          setActiveSectionIndex={setActiveSectionIndex}
        />
      </div>
    </div>
  );
};

export default SimpleBusinessPageBuilder;

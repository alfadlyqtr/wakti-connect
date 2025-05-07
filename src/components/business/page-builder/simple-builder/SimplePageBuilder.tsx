
import React, { useState, useEffect } from "react";
import EditorPanel from "./EditorPanel";
import PagePreview from "./PagePreview";
import { SectionType, PageSettings } from "./types";
import { toast } from "@/components/ui/use-toast";

const SimplePageBuilder: React.FC = () => {
  // Initialize with an empty array - no default sections
  const [sections, setSections] = useState<SectionType[]>([]);
  
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState("sections");
  
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
  
  // Function to update a specific section
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
  
  return (
    <div className="flex h-screen">
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
  );
};

export default SimplePageBuilder;

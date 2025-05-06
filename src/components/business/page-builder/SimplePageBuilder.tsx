import React, { useState, useEffect } from "react";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ExternalLink, Eye, Globe } from "lucide-react";
import TopBar from "./simple-builder/TopBar";
import EditorPanel from "./simple-builder/EditorPanel";
import PagePreview from "./simple-builder/PagePreview";
import { SectionType } from "./simple-builder/types";

const SimplePageBuilder = () => {
  const navigate = useNavigate();
  const { ownerBusinessPage, pageSections, updatePage } = useBusinessPage();
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sections");
  const [editMode, setEditMode] = useState<boolean>(true);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [pageSettings, setPageSettings] = useState({
    title: ownerBusinessPage?.page_title || "My Business",
    theme: "default",
    primaryColor: ownerBusinessPage?.primary_color || "#8B5CF6",
    fontFamily: ownerBusinessPage?.font_family || "Inter",
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
      { day: "Sunday", hours: "Closed", isOpen: false },
    ],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      whatsapp: "",
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
    googleMapsUrl: "",
    tmwChatbotCode: "",
  });

  useEffect(() => {
    if (ownerBusinessPage) {
      setPageSettings(prev => ({
        ...prev,
        title: ownerBusinessPage.page_title || prev.title,
        primaryColor: ownerBusinessPage.primary_color || prev.primaryColor,
        fontFamily: ownerBusinessPage.font_family || prev.fontFamily,
      }));
    }
    
    // Initialize with default sections if no sections exist
    if ((!pageSections || pageSections.length === 0) && sections.length === 0) {
      setSections([
        {
          type: "header",
          title: "Welcome to Our Business",
          subtitle: "We provide quality products and services",
          image: "",
          layouts: ["default", "centered", "split"],
          activeLayout: "default",
          content: {}
        },
        {
          type: "about",
          title: "About Us",
          subtitle: "Learn more about what we do",
          image: "",
          layouts: ["left-image", "right-image", "centered"],
          activeLayout: "left-image",
          content: {
            description: "We are dedicated to providing excellent service to all our customers."
          }
        }
      ]);
    }
  }, [ownerBusinessPage, pageSections]);

  const getPageUrl = () => {
    if (!ownerBusinessPage?.page_slug) return '#';
    return `${window.location.origin}/${ownerBusinessPage.page_slug}`;
  };

  const handleSaveChanges = async () => {
    try {
      if (!ownerBusinessPage) {
        throw new Error("No business page found");
      }

      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          page_title: pageSettings.title,
          primary_color: pageSettings.primaryColor,
          font_family: pageSettings.fontFamily,
          // Other settings could be saved to sections or JSON fields
        }
      });

      toast({
        title: "Changes saved successfully",
        description: "Your business page has been updated.",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewClick = () => {
    if (ownerBusinessPage?.page_slug) {
      window.open(`/${ownerBusinessPage.page_slug}/preview`, '_blank');
    } else {
      toast({
        title: "Preview not available",
        description: "Please create a page first to preview it.",
        variant: "destructive",
      });
    }
  };

  const handlePublishClick = async () => {
    try {
      if (!ownerBusinessPage) {
        throw new Error("No business page found");
      }

      await updatePage.mutateAsync({
        pageId: ownerBusinessPage.id,
        data: {
          is_published: true
        }
      });

      toast({
        title: "Page published successfully",
        description: "Your business page is now live.",
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        title: "Error publishing page",
        description: "There was a problem publishing your page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addSection = (sectionType: string) => {
    const newSections = [...sections];
    
    let newSection: SectionType;
    
    switch(sectionType) {
      case 'header':
        newSection = {
          type: "header",
          title: "Welcome to Our Business",
          subtitle: "We provide quality products and services",
          image: "",
          layouts: ["default", "centered", "split"],
          activeLayout: "default",
          content: {}
        };
        break;
      case 'about':
        newSection = {
          type: "about",
          title: "About Us",
          subtitle: "Learn more about what we do",
          image: "",
          layouts: ["left-image", "right-image", "centered"],
          activeLayout: "left-image",
          content: {
            description: "We are dedicated to providing excellent service to all our customers."
          }
        };
        break;
      case 'gallery':
        newSection = {
          type: "gallery",
          title: "Our Gallery",
          subtitle: "Check out our work",
          image: "",
          layouts: ["grid", "masonry", "slider"],
          activeLayout: "grid",
          content: {
            images: []
          }
        };
        break;
      case 'contact':
        newSection = {
          type: "contact",
          title: "Contact Us",
          subtitle: "Get in touch with us",
          image: "",
          layouts: ["form-only", "form-with-info", "info-only"],
          activeLayout: "form-with-info",
          content: {}
        };
        break;
      case 'hours':
        newSection = {
          type: "hours",
          title: "Business Hours",
          subtitle: "When you can visit us",
          image: "",
          layouts: ["list", "grid", "compact"],
          activeLayout: "list",
          content: {}
        };
        break;
      case 'testimonials':
        newSection = {
          type: "testimonials",
          title: "What Our Clients Say",
          subtitle: "Testimonials from our customers",
          image: "",
          layouts: ["grid", "slider", "quotes"],
          activeLayout: "grid",
          content: {
            testimonials: [
              { 
                name: "John Smith", 
                role: "Customer", 
                text: "Great service and products!"
              }
            ]
          }
        };
        break;
      case 'booking':
        newSection = {
          type: "booking",
          title: "Book an Appointment",
          subtitle: "Schedule a time with us",
          image: "",
          layouts: ["simple", "detailed", "calendar"],
          activeLayout: "simple",
          content: {}
        };
        break;
      case 'instagram':
        newSection = {
          type: "instagram",
          title: "Follow Us on Instagram",
          subtitle: "Check out our latest posts",
          image: "",
          layouts: ["grid", "carousel", "feed"],
          activeLayout: "grid",
          content: {}
        };
        break;
      case 'chatbot':
        newSection = {
          type: "chatbot",
          title: "Chat with Us",
          subtitle: "We're here to help",
          image: "",
          layouts: ["floating", "embedded", "sidebar"],
          activeLayout: "embedded",
          content: {}
        };
        break;
      default:
        return;
    }
    
    // Add the new section at the end
    newSections.push(newSection);
    setSections(newSections);
    setActiveSectionIndex(newSections.length - 1); // Select the newly added section
    setActiveTab("sections");
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
    setActiveSectionIndex(null);
  };

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setSections(newSections);
      setActiveSectionIndex(index - 1);
    }
  };

  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setSections(newSections);
      setActiveSectionIndex(index + 1);
    }
  };

  const updateSection = (index: number, updatedSection: SectionType) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };
  
  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar 
        pageUrl={getPageUrl()} 
        onPreview={handlePreviewClick}
        onPublish={handlePublishClick}
        onSave={handleSaveChanges}
        isEditMode={editMode}
        setEditMode={setEditMode}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-white p-4 border-r">
          <PagePreview 
            sections={sections} 
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            pageSettings={pageSettings}
            addSection={addSection}
          />
        </div>
        
        {/* Right Sidebar */}
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
        />
      </div>
    </div>
  );
};

export default SimplePageBuilder;

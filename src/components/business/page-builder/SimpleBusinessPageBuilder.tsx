
import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "@/components/ui/use-toast";
import TopBar from "./simple-builder/TopBar";
import { PageSettings, SectionType } from "./simple-builder/types";
import { 
  useUpdatePageMutation, 
  useUpdateSectionMutation 
} from "@/hooks/business-page/useBusinessPageMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeaderSection from "./simple-builder/sections/HeaderSection";
import AboutSection from "./simple-builder/sections/AboutSection";
import ContactSection from "./simple-builder/sections/ContactSection";
import GallerySection from "./simple-builder/sections/GallerySection";
import HoursSection from "./simple-builder/sections/HoursSection";
import BookingSection from "./simple-builder/sections/BookingSection";
import TestimonialsSection from "./simple-builder/sections/TestimonialsSection";
import InstagramSection from "./simple-builder/sections/InstagramSection";
import ChatbotSection from "./simple-builder/sections/ChatbotSection";

const SimpleBusinessPageBuilder: React.FC = () => {
  // Initialize with an empty array - no default sections
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
  
  // Get the update mutation hooks
  const updatePageMutation = useUpdatePageMutation();
  const updateSectionMutation = useUpdateSectionMutation();
  
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
  
  // Mock functions for top bar actions
  const handleSave = () => {
    setIsSaving(true);
    
    // If we have a real page ID from the backend, we would update it
    if (pageSettings.id) {
      // Properly use the updatePageMutation
      updatePageMutation.mutate({ 
        pageId: pageSettings.id as string,
        data: pageSettings 
      }, {
        onSuccess: () => {
          setIsSaving(false);
          toast({
            title: "Changes saved",
            description: "Your page has been saved successfully",
          });
        },
        onError: (error) => {
          setIsSaving(false);
          toast({
            variant: "destructive",
            title: "Save failed",
            description: error.message || "Something went wrong"
          });
        }
      });
    } else {
      // Simulate API call since we don't have a real page ID yet
      setTimeout(() => {
        setIsSaving(false);
        // Simulate getting an ID back
        setPageSettings({
          ...pageSettings,
          id: `page-${Date.now()}`
        });
        toast({
          title: "Page created",
          description: "Your business page has been created successfully",
        });
      }, 1500);
    }
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
    
    // In a real implementation, properly use the mutations
    if (pageSettings.id) {
      updatePageMutation.mutate({
        pageId: pageSettings.id as string,
        data: { is_published: true }
      }, {
        onSuccess: () => {
          setIsPublishing(false);
          setPageSettings({
            ...pageSettings,
            isPublished: true
          });
          
          toast({
            title: "Page published",
            description: "Your page is now live",
          });
        },
        onError: (error) => {
          setIsPublishing(false);
          toast({
            variant: "destructive",
            title: "Publish failed",
            description: error.message || "Something went wrong"
          });
        }
      });
    } else {
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
    }
  };
  
  // Generate the correct URL for business landing pages
  const displayUrl = pageSettings.slug ? 
    `https://${pageSettings.slug}.wakti.app` : 
    'No URL available yet';

  // React to changes in the page settings
  const handlePageSettingsChange = (key: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };
  
  // Render section based on type
  const renderSection = (section: SectionType, index: number) => {
    const isActive = index === activeSectionIndex;
    const handleClick = () => setActiveSectionIndex(index);
    
    switch (section.type) {
      case "header":
        return <HeaderSection section={section} isActive={isActive} onClick={handleClick} />;
      case "about":
        return <AboutSection section={section} isActive={isActive} onClick={handleClick} />;
      case "contact":
        return <ContactSection section={section} isActive={isActive} onClick={handleClick} />;
      case "gallery":
        return <GallerySection section={section} isActive={isActive} onClick={handleClick} />;
      case "hours":
        return <HoursSection section={section} isActive={isActive} onClick={handleClick} />;
      case "booking":
        return <BookingSection section={section} isActive={isActive} onClick={handleClick} />;
      case "testimonials":
        return <TestimonialsSection section={section} isActive={isActive} onClick={handleClick} />;
      case "instagram":
        return <InstagramSection section={section} isActive={isActive} onClick={handleClick} />;
      case "chatbot":
        return <ChatbotSection section={section} isActive={isActive} onClick={handleClick} />;
      default:
        return <div>Unknown section type</div>;
    }
  };
  
  // Render sections panel content
  const renderSectionsPanel = () => {
    if (sections.length === 0) {
      return (
        <div className="p-8 text-center border-2 border-dashed rounded-lg border-gray-300">
          <h3 className="text-lg font-medium mb-2">Add Your First Section</h3>
          <p className="text-gray-500 mb-4">
            Start building your page by adding sections like headers, about, services, and more.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => addSection('header')} variant="outline" className="w-full">Header</Button>
            <Button onClick={() => addSection('about')} variant="outline" className="w-full">About</Button>
            <Button onClick={() => addSection('gallery')} variant="outline" className="w-full">Gallery</Button>
            <Button onClick={() => addSection('contact')} variant="outline" className="w-full">Contact</Button>
            <Button onClick={() => addSection('hours')} variant="outline" className="w-full">Hours</Button>
            <Button onClick={() => addSection('testimonials')} variant="outline" className="w-full">Testimonials</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Page Sections</h2>
          <Button 
            onClick={() => setActiveTab("add")} 
            size="sm" 
            variant="outline"
          >
            Add Section
          </Button>
        </div>
        
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`border p-3 rounded-md cursor-pointer ${index === activeSectionIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setActiveSectionIndex(index)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium capitalize">{section.type}</h3>
                <p className="text-sm text-gray-500 truncate">{section.title || 'Untitled Section'}</p>
              </div>
              
              <div className="flex space-x-2">
                {index > 0 && (
                  <Button onClick={(e) => { e.stopPropagation(); moveSectionUp(index); }} size="sm" variant="ghost">↑</Button>
                )}
                {index < sections.length - 1 && (
                  <Button onClick={(e) => { e.stopPropagation(); moveSectionDown(index); }} size="sm" variant="ghost">↓</Button>
                )}
                <Button 
                  onClick={(e) => { e.stopPropagation(); removeSection(index); }} 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render Add Section panel content
  const renderAddSectionPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Add New Section</h2>
        <Button 
          onClick={() => setActiveTab("sections")} 
          size="sm" 
          variant="ghost"
        >
          Back to Sections
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => addSection('header')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Header</span>
          <span className="text-xs text-gray-500">Page title & intro</span>
        </Button>
        
        <Button onClick={() => addSection('about')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">About</span>
          <span className="text-xs text-gray-500">Describe your business</span>
        </Button>
        
        <Button onClick={() => addSection('gallery')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Gallery</span>
          <span className="text-xs text-gray-500">Showcase images</span>
        </Button>
        
        <Button onClick={() => addSection('contact')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Contact Form</span>
          <span className="text-xs text-gray-500">Let customers reach you</span>
        </Button>
        
        <Button onClick={() => addSection('hours')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Business Hours</span>
          <span className="text-xs text-gray-500">When you're open</span>
        </Button>
        
        <Button onClick={() => addSection('testimonials')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Testimonials</span>
          <span className="text-xs text-gray-500">Customer reviews</span>
        </Button>
        
        <Button onClick={() => addSection('booking')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Booking</span>
          <span className="text-xs text-gray-500">Online appointment booking</span>
        </Button>
        
        <Button onClick={() => addSection('instagram')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Instagram</span>
          <span className="text-xs text-gray-500">Show your Instagram feed</span>
        </Button>
        
        <Button onClick={() => addSection('chatbot')} variant="outline" className="h-24 flex flex-col">
          <span className="text-lg">Chatbot</span>
          <span className="text-xs text-gray-500">Add AI chat support</span>
        </Button>
      </div>
    </div>
  );
  
  // Render Edit Section panel content
  const renderEditSectionPanel = () => {
    if (activeSectionIndex === null || !sections[activeSectionIndex]) {
      return (
        <div className="p-8 text-center border-2 border-dashed rounded-lg border-gray-300">
          <h3 className="text-lg font-medium mb-2">No Section Selected</h3>
          <p className="text-gray-500">
            Select a section from the list to edit its content.
          </p>
        </div>
      );
    }
    
    const activeSection = sections[activeSectionIndex];
    
    const updateSectionField = (field: string, value: any) => {
      const updatedSection = { ...activeSection, [field]: value };
      updateSection(activeSectionIndex, updatedSection);
    };
    
    const updateSectionContent = (field: string, value: any) => {
      const content = activeSection.content || {};
      const updatedContent = { ...content, [field]: value };
      const updatedSection = { ...activeSection, content: updatedContent };
      updateSection(activeSectionIndex, updatedSection);
    };
    
    // Generic fields all sections have
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium capitalize">{activeSection.type} Section</h2>
          <Button 
            onClick={() => setActiveSectionIndex(null)} 
            size="sm" 
            variant="ghost"
          >
            Done
          </Button>
        </div>
        
        {/* Common fields for all section types */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              value={activeSection.title || ''}
              onChange={(e) => updateSectionField('title', e.target.value)}
              placeholder="Enter a title"
            />
          </div>
          
          <div>
            <Label htmlFor="section-subtitle">Subtitle</Label>
            <Input
              id="section-subtitle"
              value={activeSection.subtitle || ''}
              onChange={(e) => updateSectionField('subtitle', e.target.value)}
              placeholder="Enter a subtitle (optional)"
            />
          </div>
          
          {/* Section-specific fields */}
          {activeSection.type === 'about' && (
            <div>
              <Label htmlFor="section-description">About Content</Label>
              <Textarea
                id="section-description"
                value={activeSection.content?.description || ''}
                onChange={(e) => updateSectionContent('description', e.target.value)}
                placeholder="Describe your business..."
                rows={5}
              />
            </div>
          )}
          
          {activeSection.type === 'testimonials' && (
            <div className="space-y-4">
              <Label>Testimonials</Label>
              
              {/* Loop through testimonials or create defaults */}
              {(activeSection.content?.testimonials || [{ name: '', role: '', text: '' }]).map((testimonial: any, idx: number) => (
                <div key={idx} className="border p-4 rounded-md space-y-3">
                  <div>
                    <Label htmlFor={`testimonial-name-${idx}`}>Name</Label>
                    <Input
                      id={`testimonial-name-${idx}`}
                      value={testimonial.name || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(activeSection.content?.testimonials || [])];
                        updatedTestimonials[idx] = { ...testimonial, name: e.target.value };
                        updateSectionContent('testimonials', updatedTestimonials);
                      }}
                      placeholder="Customer name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-role-${idx}`}>Role</Label>
                    <Input
                      id={`testimonial-role-${idx}`}
                      value={testimonial.role || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(activeSection.content?.testimonials || [])];
                        updatedTestimonials[idx] = { ...testimonial, role: e.target.value };
                        updateSectionContent('testimonials', updatedTestimonials);
                      }}
                      placeholder="Customer role"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-text-${idx}`}>Testimonial</Label>
                    <Textarea
                      id={`testimonial-text-${idx}`}
                      value={testimonial.text || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...(activeSection.content?.testimonials || [])];
                        updatedTestimonials[idx] = { ...testimonial, text: e.target.value };
                        updateSectionContent('testimonials', updatedTestimonials);
                      }}
                      placeholder="Customer testimonial"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const testimonials = activeSection.content?.testimonials || [];
                  const updatedTestimonials = [...testimonials, { name: '', role: '', text: '' }];
                  updateSectionContent('testimonials', updatedTestimonials);
                }}
                variant="outline"
                size="sm"
              >
                Add Testimonial
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render settings panel content
  const renderSettingsPanel = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Page Settings</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="page-title">Page Title</Label>
          <Input
            id="page-title"
            value={pageSettings.title}
            onChange={(e) => handlePageSettingsChange('title', e.target.value)}
            placeholder="Business name or page title"
          />
        </div>
        
        <div>
          <Label htmlFor="page-slug">Page URL</Label>
          <div className="flex items-center space-x-2">
            <div className="text-gray-500">https://</div>
            <Input
              id="page-slug"
              value={pageSettings.slug}
              onChange={(e) => handlePageSettingsChange('slug', e.target.value)}
              placeholder="your-business-name"
              className="flex-1"
            />
            <div className="text-gray-500">.wakti.app</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This will be your unique page address.
          </p>
        </div>
        
        <div>
          <Label htmlFor="page-description">Page Description</Label>
          <Textarea
            id="page-description"
            value={pageSettings.description}
            onChange={(e) => handlePageSettingsChange('description', e.target.value)}
            placeholder="A short description of your business"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex">
              <Input
                type="color"
                id="primary-color"
                value={pageSettings.primaryColor}
                onChange={(e) => handlePageSettingsChange('primaryColor', e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Input
                type="text"
                value={pageSettings.primaryColor}
                onChange={(e) => handlePageSettingsChange('primaryColor', e.target.value)}
                className="flex-1 ml-2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex">
              <Input
                type="color"
                id="secondary-color"
                value={pageSettings.secondaryColor}
                onChange={(e) => handlePageSettingsChange('secondaryColor', e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Input
                type="text"
                value={pageSettings.secondaryColor}
                onChange={(e) => handlePageSettingsChange('secondaryColor', e.target.value)}
                className="flex-1 ml-2"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Contact Information</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={pageSettings.contactInfo.email}
                onChange={(e) => handlePageSettingsChange('contactInfo', {
                  ...pageSettings.contactInfo,
                  email: e.target.value
                })}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={pageSettings.contactInfo.phone}
                onChange={(e) => handlePageSettingsChange('contactInfo', {
                  ...pageSettings.contactInfo,
                  phone: e.target.value
                })}
                placeholder="(123) 456-7890"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-address">Address</Label>
              <Textarea
                id="contact-address"
                value={pageSettings.contactInfo.address}
                onChange={(e) => handlePageSettingsChange('contactInfo', {
                  ...pageSettings.contactInfo,
                  address: e.target.value
                })}
                placeholder="123 Business St, City, State ZIP"
                rows={2}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Social Media Links</h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="social-instagram">Instagram</Label>
              <Input
                id="social-instagram"
                value={pageSettings.socialLinks.instagram}
                onChange={(e) => handlePageSettingsChange('socialLinks', {
                  ...pageSettings.socialLinks,
                  instagram: e.target.value
                })}
                placeholder="https://instagram.com/yourbusiness"
              />
            </div>
            
            <div>
              <Label htmlFor="social-facebook">Facebook</Label>
              <Input
                id="social-facebook"
                value={pageSettings.socialLinks.facebook}
                onChange={(e) => handlePageSettingsChange('socialLinks', {
                  ...pageSettings.socialLinks,
                  facebook: e.target.value
                })}
                placeholder="https://facebook.com/yourbusiness"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={displayUrl}
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
          <div className="w-full">
            {sections.length === 0 ? (
              <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 text-center">
                <h2 className="text-2xl font-bold mb-4">Start Building Your Business Page</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Add sections to create your custom business page. Choose from headers, about sections,
                  galleries, contact forms, and more.
                </p>
                <Button onClick={() => { setActiveTab("add"); }} size="lg">
                  Add Your First Section
                </Button>
              </div>
            ) : (
              <div>
                {sections.map((section, index) => (
                  <div key={section.id} className="mb-6">
                    {renderSection(section, index)}
                  </div>
                ))}
                
                {/* Add section button at the bottom */}
                <div className="py-8 text-center">
                  <Button 
                    onClick={() => { setActiveTab("add"); }}
                    variant="outline"
                    className="mx-auto"
                  >
                    + Add Section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-96 border-l bg-white overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="w-full py-0">
                <TabsTrigger value="sections" className="flex-1">Sections</TabsTrigger>
                <TabsTrigger value="edit" className="flex-1" disabled={activeSectionIndex === null}>Edit</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                <TabsTrigger value="add" className="flex-1">Add</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              <TabsContent value="sections" className="mt-0">
                {renderSectionsPanel()}
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                {renderEditSectionPanel()}
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                {renderSettingsPanel()}
              </TabsContent>
              
              <TabsContent value="add" className="mt-0">
                {renderAddSectionPanel()}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimpleBusinessPageBuilder;

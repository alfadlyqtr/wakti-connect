
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessPage } from "@/hooks/business-page";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PagePreview from "./simple-builder/PagePreview";
import { SectionType, PageSettings } from "./simple-builder/types";

const SimpleBusinessPageBuilder = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isEditMode, setIsEditMode] = useState(true);
  
  const {
    ownerBusinessPage,
    pageLoading,
    createPage,
    updatePage,
    updateSection,
    getPublicPageUrl,
    pageSections = []
  } = useBusinessPage();
  
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "My Business",
    slug: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#10b981",
    description: "Welcome to our business",
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
  
  // Initialize sections with default sections
  const [sections, setSections] = useState<SectionType[]>([
    {
      id: "header",
      type: "header",
      title: "Welcome to Our Business",
      subtitle: "Professional Services at Your Fingertips",
      description: "Book our services online today",
      content: {},
      activeLayout: "default"
    },
    {
      id: "about",
      type: "about",
      title: "About Us",
      subtitle: "Our Story",
      description: "We are a professional service provider dedicated to excellence.",
      content: {
        description: "We are a professional service provider dedicated to excellence."
      },
      activeLayout: "left-image"
    },
    {
      id: "gallery",
      type: "gallery",
      title: "Gallery",
      subtitle: "Our Work",
      description: "",
      content: {
        images: [],
        layout: "grid",
        columns: 3
      },
      activeLayout: "standard"
    },
    {
      id: "hours",
      type: "hours",
      title: "Business Hours",
      subtitle: "When We're Open",
      description: "",
      content: {},
      activeLayout: "standard"
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact Us",
      subtitle: "Get in Touch",
      description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      content: {},
      activeLayout: "standard"
    }
  ]);
  
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  
  // Sync with actual data when loaded
  useEffect(() => {
    if (ownerBusinessPage) {
      setPageSettings({
        ...pageSettings,
        title: ownerBusinessPage.page_title,
        slug: ownerBusinessPage.page_slug,
        primaryColor: ownerBusinessPage.primary_color || "#4f46e5",
        description: ownerBusinessPage.description || "",
        isPublished: ownerBusinessPage.is_published
      });
      
      // If we have page sections, convert them to our format
      if (pageSections && pageSections.length > 0) {
        const mappedSections = pageSections.map(section => ({
          id: section.id,
          type: section.section_type as any,
          title: section.section_content?.title || "",
          subtitle: section.section_content?.subtitle || "",
          description: section.section_content?.description || "",
          content: section.section_content || {},
          activeLayout: section.section_content?.layout || "standard"
        }));
        
        setSections(mappedSections);
      }
      
      setIsLoading(false);
    } else {
      setIsLoading(pageLoading);
    }
  }, [ownerBusinessPage, pageLoading, pageSections]);
  
  // Create a new page if none exists
  const handleCreatePage = async () => {
    setIsSaving(true);
    try {
      await createPage.mutateAsync({
        page_title: pageSettings.title,
        page_slug: pageSettings.slug,
        primary_color: pageSettings.primaryColor,
        description: pageSettings.description
      });
      
      toast({
        title: "Page created",
        description: "Your business page has been created successfully",
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem creating your page"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update existing page
  const handleSavePage = async () => {
    if (!ownerBusinessPage) {
      return handleCreatePage();
    }
    
    setIsSaving(true);
    try {
      await updatePage.mutateAsync({
        id: ownerBusinessPage.id,
        data: {
          page_title: pageSettings.title,
          page_slug: pageSettings.slug,
          primary_color: pageSettings.primaryColor,
          description: pageSettings.description
        }
      });
      
      toast({
        title: "Page saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your changes"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Publish the page
  const handlePublish = async () => {
    if (!ownerBusinessPage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Save your page before publishing"
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      await updatePage.mutateAsync({
        id: ownerBusinessPage.id,
        data: {
          is_published: true
        }
      });
      
      setPageSettings({
        ...pageSettings,
        isPublished: true
      });
      
      toast({
        title: "Page published",
        description: "Your business page is now live",
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem publishing your page"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Preview the page
  const handlePreview = () => {
    setIsEditMode(false);
    
    toast({
      title: "Preview mode",
      description: "You are now previewing your page",
    });
    
    // Switch back to edit mode after 5 seconds
    setTimeout(() => {
      setIsEditMode(true);
    }, 5000);
  };
  
  // Update a section
  const updateSection = (index: number, section: SectionType) => {
    const updatedSections = [...sections];
    updatedSections[index] = section;
    setSections(updatedSections);
  };
  
  // Generate the display URL for the business page
  const displayUrl = pageSettings.isPublished && pageSettings.slug 
    ? `https://${pageSettings.slug}.wakti.app` 
    : 'No URL available yet';
  
  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p>Loading your business page...</p>
      </div>
    );
  }
  
  // If no page exists yet, show create page form
  if (!ownerBusinessPage) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Create Your Business Page</h1>
        <p className="text-muted-foreground mb-6">
          Set up your business landing page to showcase your services, hours, and more.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Business Name</Label>
            <Input 
              id="title"
              value={pageSettings.title}
              onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center">
              <span className="mr-2">https://</span>
              <Input 
                id="slug"
                value={pageSettings.slug}
                onChange={(e) => setPageSettings({...pageSettings, slug: e.target.value})}
                className="flex-1"
              />
              <span className="ml-2">.wakti.app</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be your page's web address
            </p>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              value={pageSettings.description}
              onChange={(e) => setPageSettings({...pageSettings, description: e.target.value})}
            />
          </div>
          
          <Button 
            onClick={handleCreatePage} 
            className="w-full" 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Business Page"
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  // Main page builder
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b p-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold mr-6">Business Landing Page</h1>
          <div className="flex items-center bg-gray-100 rounded-md max-w-md">
            <Input 
              value={displayUrl} 
              readOnly
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                navigator.clipboard.writeText(displayUrl);
                toast({
                  title: "URL copied",
                  description: "Page URL copied to clipboard",
                });
              }}
              disabled={!pageSettings.slug || !pageSettings.isPublished}
              className="mr-1"
            >
              Copy
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleSavePage} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handlePreview}
          >
            Preview
          </Button>
          
          <Button 
            variant="default" 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="bg-wakti-navy"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Page Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <PagePreview 
            sections={sections}
            activeSection={activeSectionIndex !== null ? sections[activeSectionIndex] : undefined}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            pageSettings={pageSettings}
          />
        </div>
        
        {/* Editor Panel */}
        <div className="w-80 bg-white border-l flex flex-col h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
              <TabsTrigger value="content" className="rounded-none">
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none">
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto p-4">
              <TabsContent value="content" className="m-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Page Sections</h3>
                    <div className="space-y-2">
                      {sections.map((section, index) => (
                        <div 
                          key={section.id}
                          className={`p-3 border rounded-md cursor-pointer ${activeSectionIndex === index ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setActiveSectionIndex(index)}
                        >
                          <div className="font-medium">{section.title || section.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {activeSectionIndex !== null && (
                    <div>
                      <Separator className="my-4" />
                      <h3 className="font-medium mb-4">Edit Section</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input 
                            value={sections[activeSectionIndex].title}
                            onChange={(e) => {
                              const updatedSection = {...sections[activeSectionIndex], title: e.target.value};
                              updateSection(activeSectionIndex, updatedSection);
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Subtitle</Label>
                          <Input 
                            value={sections[activeSectionIndex].subtitle}
                            onChange={(e) => {
                              const updatedSection = {...sections[activeSectionIndex], subtitle: e.target.value};
                              updateSection(activeSectionIndex, updatedSection);
                            }}
                          />
                        </div>
                        
                        {sections[activeSectionIndex].type === "about" && (
                          <div>
                            <Label>Description</Label>
                            <Input 
                              as="textarea"
                              value={sections[activeSectionIndex].content.description || ""}
                              onChange={(e) => {
                                const updatedSection = {
                                  ...sections[activeSectionIndex], 
                                  content: {
                                    ...sections[activeSectionIndex].content,
                                    description: e.target.value
                                  }
                                };
                                updateSection(activeSectionIndex, updatedSection);
                              }}
                              className="h-20"
                            />
                          </div>
                        )}
                        
                        {sections[activeSectionIndex].type === "gallery" && (
                          <div>
                            <Label>Gallery Layout</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].content.layout === "grid" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    content: {
                                      ...sections[activeSectionIndex].content,
                                      layout: "grid",
                                      columns: 3
                                    }
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Grid (3 columns)</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].content.layout === "cards" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    content: {
                                      ...sections[activeSectionIndex].content,
                                      layout: "cards",
                                      columns: 3,
                                      showCaption: true
                                    }
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Cards with Captions</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].content.layout === "masonry" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    content: {
                                      ...sections[activeSectionIndex].content,
                                      layout: "masonry"
                                    }
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Masonry Layout</span>
                              </Button>
                            </div>
                            
                            <div className="mt-4">
                              <Label>Upload Images</Label>
                              <input
                                type="file"
                                className="mt-2"
                                onChange={(e) => {
                                  // This would need to be connected to actual file upload
                                  toast({
                                    title: "File upload",
                                    description: "File upload will be implemented with actual backend integration"
                                  });
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {sections[activeSectionIndex].type === "header" && (
                          <div>
                            <Label>Header Layout</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "default" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "default"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Full Width Banner</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "centered" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "centered"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Centered Content</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "split" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "split"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Split (Text & Image)</span>
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {sections[activeSectionIndex].type === "about" && (
                          <div>
                            <Label>About Layout</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "left-image" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "left-image"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Image Left</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "right-image" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "right-image"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Image Right</span>
                              </Button>
                              
                              <Button
                                type="button"
                                variant={sections[activeSectionIndex].activeLayout === "centered" ? "default" : "outline"}
                                className="justify-start h-auto py-2"
                                onClick={() => {
                                  const updatedSection = {
                                    ...sections[activeSectionIndex],
                                    activeLayout: "centered"
                                  };
                                  updateSection(activeSectionIndex, updatedSection);
                                }}
                              >
                                <span className="text-xs">Centered</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="m-0 h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Page Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input 
                          id="page-title"
                          value={pageSettings.title}
                          onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="page-slug">URL Slug</Label>
                        <div className="flex items-center">
                          <span className="mr-2">https://</span>
                          <Input 
                            id="page-slug"
                            value={pageSettings.slug}
                            onChange={(e) => setPageSettings({...pageSettings, slug: e.target.value})}
                            className="flex-1"
                          />
                          <span className="ml-2">.wakti.app</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex">
                          <input
                            type="color"
                            value={pageSettings.primaryColor}
                            onChange={(e) => setPageSettings({...pageSettings, primaryColor: e.target.value})}
                            className="h-10 w-10 rounded-md border p-1"
                          />
                          <Input
                            value={pageSettings.primaryColor}
                            onChange={(e) => setPageSettings({...pageSettings, primaryColor: e.target.value})}
                            className="ml-2 flex-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="tmw-chatbot">TMW Chatbot Integration</Label>
                        <div className="mt-2 flex items-center">
                          <input
                            type="checkbox"
                            id="tmw-chatbot"
                            checked={!!pageSettings.tmwChatbotCode}
                            onChange={(e) => setPageSettings({
                              ...pageSettings, 
                              tmwChatbotCode: e.target.checked ? "default-code" : ""
                            })}
                            className="mr-2 h-4 w-4"
                          />
                          <Label htmlFor="tmw-chatbot" className="text-sm font-normal">
                            Enable TMW Chatbot
                          </Label>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSavePage} 
                        className="w-full mt-4" 
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Settings"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimpleBusinessPageBuilder;

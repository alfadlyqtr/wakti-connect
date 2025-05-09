
import React, { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth/index";
import { useBusinessPageDataQuery } from "@/hooks/business-page/useBusinessPageDataQueries";
import { useCreateBusinessPageDataMutation, useUpdateBusinessPageDataMutation } from "@/hooks/business-page/useBusinessPageDataMutations";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { BusinessPageData } from "./types";
import { GlobalLoading } from "@/components/common/GlobalLoading";
import { Check, Globe, Loader2, Save } from "lucide-react";
import SimplePagePreview from "./SimplePagePreview";

const SimplePageBuilder = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id || "");
  const userId = user?.id;
  
  // Fetch the business page data
  const { 
    data: pageDataRecord, 
    isLoading,
    refetch
  } = useBusinessPageDataQuery(userId);
  
  // Default business hours
  const defaultHours = [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
    { day: "Sunday", hours: "Closed", isOpen: false }
  ];
  
  // State for local business page data
  const [pageData, setPageData] = useState<BusinessPageData>({
    pageSetup: {
      businessName: profile?.business_name || profile?.full_name || "My Business",
      alignment: "center" as const,
      visible: true
    },
    logo: { 
      url: "", 
      shape: "circle", 
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
        whatsapp: false,
        whatsappBusiness: false,
        facebook: false,
        instagram: false,
        googleMaps: false,
        phone: false,
        email: false
      }, 
      visible: true
    },
    workingHours: { 
      layout: "card", 
      hours: defaultHours, 
      visible: true
    },
    chatbot: { 
      position: "right", 
      embedCode: "", 
      visible: false 
    },
    theme: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontStyle: "sans-serif"
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
        email: false
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
    sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
    published: false
  });
  
  // State for tracking if the user has made changes
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Mutations for creating and updating page data
  const createPageMutation = useCreateBusinessPageDataMutation();
  const updatePageMutation = useUpdateBusinessPageDataMutation();
  
  // Effect to update the local state when data is loaded from the server
  useEffect(() => {
    if (pageDataRecord) {
      setPageData(pageDataRecord.page_data);
      setHasChanges(false);
    }
  }, [pageDataRecord]);
  
  // Update local state when a field changes
  const handleFieldChange = (section: keyof BusinessPageData, field: string, value: any) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };
  
  // Handle nested field changes (like contactInfo)
  const handleNestedChange = (section: keyof BusinessPageData, nestedField: string, value: any) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: value
      }
    }));
    setHasChanges(true);
  };

  // Handle working hours changes
  const handleHoursChange = (index: number, field: string, value: any) => {
    setPageData(prev => {
      const updatedHours = [...prev.workingHours.hours];
      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value
      };
      return {
        ...prev,
        workingHours: {
          ...prev.workingHours,
          hours: updatedHours
        }
      };
    });
    setHasChanges(true);
  };
  
  // Handle saving the page
  const handleSave = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      if (pageDataRecord) {
        // Update existing page
        await updatePageMutation.mutateAsync({ 
          id: pageDataRecord.id,
          pageData: pageData
        });
      } else {
        // Create new page
        await createPageMutation.mutateAsync({ 
          userId: userId,
          pageData: pageData
        });
      }
      
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Your business page has been saved.",
      });
      refetch();
    } catch (error) {
      console.error("Error saving business page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your business page. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle publishing the page
  const handlePublish = async () => {
    if (!userId) return;
    
    setIsPublishing(true);
    try {
      const updatedPageData = {
        ...pageData,
        published: true
      };
      
      if (pageDataRecord) {
        // Update existing page
        await updatePageMutation.mutateAsync({ 
          id: pageDataRecord.id,
          pageData: updatedPageData
        });
      } else {
        // Create new page and publish it
        await createPageMutation.mutateAsync({ 
          userId,
          pageData: updatedPageData
        });
      }
      
      setPageData(updatedPageData);
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Your business page has been published.",
      });
      refetch();
    } catch (error) {
      console.error("Error publishing business page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish your business page. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Get the public URL for the page
  const getPublicPageUrl = () => {
    const baseUrl = window.location.origin;
    const businessUrlPart = pageData.pageSetup.businessName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    return `${baseUrl}/b/${businessUrlPart}`;
  };
  
  if (isLoading) {
    return <GlobalLoading />;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Business Page</h2>
                <div className="flex items-center gap-2">
                  {pageData.published && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        View Public Page
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isSaving || !hasChanges}
                    onClick={handleSave}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button 
                    variant={pageData.published ? "outline" : "default"} 
                    size="sm"
                    disabled={isPublishing}
                    onClick={handlePublish}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Publishing...
                      </>
                    ) : pageData.published ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Published
                      </>
                    ) : (
                      "Publish"
                    )}
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="general">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="hours">Hours</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={pageData.pageSetup.businessName}
                        onChange={(e) => handleFieldChange('pageSetup', 'businessName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={pageData.pageSetup.description || ''}
                        onChange={(e) => handleFieldChange('pageSetup', 'description', e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={pageData.logo.url}
                        onChange={(e) => handleFieldChange('logo', 'url', e.target.value)}
                        placeholder="Enter URL to your logo image"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the URL to your logo image. For best results, use a square image.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={pageData.contactInfo.email || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={pageData.contactInfo.phone || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={pageData.contactInfo.whatsapp || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'whatsapp', e.target.value)}
                        placeholder="Enter WhatsApp number with country code"
                      />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input
                        id="facebook"
                        value={pageData.contactInfo.facebook || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input
                        id="instagram"
                        value={pageData.contactInfo.instagram || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="googleMaps">Google Maps URL</Label>
                      <Input
                        id="googleMaps"
                        value={pageData.contactInfo.googleMaps || ''}
                        onChange={(e) => handleNestedChange('contactInfo', 'googleMaps', e.target.value)}
                        placeholder="https://maps.google.com/?q=yourbusiness"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hours">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Business Hours</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showHours"
                          checked={pageData.workingHours.visible}
                          onCheckedChange={(value) => handleFieldChange('workingHours', 'visible', value)}
                        />
                        <Label htmlFor="showHours">Show Hours</Label>
                      </div>
                    </div>
                    
                    {pageData.workingHours.hours.map((hour, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-3">
                          <p className="text-sm font-medium">{hour.day}</p>
                        </div>
                        <div className="col-span-6">
                          <Input
                            value={hour.hours}
                            onChange={(e) => handleHoursChange(index, 'hours', e.target.value)}
                            disabled={!hour.isOpen}
                            placeholder="e.g. 9:00 AM - 5:00 PM"
                          />
                        </div>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch
                            id={`day-${index}-open`}
                            checked={hour.isOpen}
                            onCheckedChange={(value) => handleHoursChange(index, 'isOpen', value)}
                          />
                          <Label htmlFor={`day-${index}-open`} className="text-sm">
                            {hour.isOpen ? "Open" : "Closed"}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="h-10 w-10 rounded border" 
                          style={{ backgroundColor: pageData.theme.backgroundColor }}
                        />
                        <Input
                          id="primaryColor"
                          value={pageData.theme.backgroundColor}
                          onChange={(e) => handleFieldChange('theme', 'backgroundColor', e.target.value)}
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <div 
                          className="h-10 w-10 rounded border" 
                          style={{ backgroundColor: pageData.theme.textColor }}
                        />
                        <Input
                          id="textColor"
                          value={pageData.theme.textColor}
                          onChange={(e) => handleFieldChange('theme', 'textColor', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <select
                        id="fontFamily"
                        value={pageData.theme.fontStyle}
                        onChange={(e) => handleFieldChange('theme', 'fontStyle', e.target.value)}
                        className="w-full p-2 rounded-md border border-input"
                      >
                        <option value="sans-serif">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="integrations">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chatbotCode">TMW Chatbot Code</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enableChatbot"
                            checked={pageData.chatbot.visible}
                            onCheckedChange={(value) => handleFieldChange('chatbot', 'visible', value)}
                          />
                          <Label htmlFor="enableChatbot">Enable Chatbot</Label>
                        </div>
                      </div>
                      <Textarea
                        id="chatbotCode"
                        value={pageData.chatbot.embedCode}
                        onChange={(e) => handleFieldChange('chatbot', 'embedCode', e.target.value)}
                        rows={6}
                        placeholder="Paste your TMW chatbot embed code here"
                      />
                      <p className="text-sm text-muted-foreground">
                        Paste the embed code from TMW to enable the chatbot on your business page.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chatbotPosition">Chatbot Position</Label>
                      <select
                        id="chatbotPosition"
                        value={pageData.chatbot.position}
                        onChange={(e) => handleFieldChange('chatbot', 'position', e.target.value)}
                        className="w-full p-2 rounded-md border border-input"
                        disabled={!pageData.chatbot.visible}
                      >
                        <option value="right">Right</option>
                        <option value="left">Left</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {hasChanges && (
                <Alert className="mt-6">
                  <AlertDescription>
                    You have unsaved changes. Click Save to preserve your updates.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Preview</h2>
              <div className="border rounded-lg overflow-hidden h-[800px] bg-gray-50">
                <SimplePagePreview pageData={pageData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimplePageBuilder;

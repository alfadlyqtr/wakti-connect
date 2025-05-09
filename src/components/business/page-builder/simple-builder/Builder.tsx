
// import all the code from the previous SimplePageBuilder component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useTMWChatbot } from '@/hooks/tmw-chatbot';
import { BusinessPageData, TextAlignment, LogoShape } from './types';
import SimplePagePreview from './SimplePagePreview';
import TopBar from './TopBar';
import { supabase } from '@/integrations/supabase/client';

// Create a simple loading component instead of importing one
const SimpleLoader = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading...</span>
  </div>
);

const Builder: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [pageId, setPageId] = useState<string | null>(null);

  // Define default page data structure with initial empty values
  const defaultPageData: BusinessPageData = {
    pageSetup: {
      businessName: '',
      alignment: 'center' as TextAlignment,
      visible: true,
      description: ''
    },
    logo: {
      url: '',
      shape: 'circle' as LogoShape,
      alignment: 'center',
      visible: true
    },
    bookings: {
      viewStyle: 'grid',
      templates: [],
      visible: true
    },
    socialInline: {
      style: 'icon',
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
      layout: 'card',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 5:00 PM', isOpen: true },
        { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', isOpen: true },
        { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', isOpen: true },
        { day: 'Thursday', hours: '9:00 AM - 5:00 PM', isOpen: true },
        { day: 'Friday', hours: '9:00 AM - 5:00 PM', isOpen: true },
        { day: 'Saturday', hours: '10:00 AM - 3:00 PM', isOpen: true },
        { day: 'Sunday', hours: 'Closed', isOpen: false }
      ],
      visible: true
    },
    chatbot: {
      position: 'right',
      embedCode: '',
      visible: false
    },
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontStyle: 'sans-serif'
    },
    socialSidebar: {
      position: 'right',
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
      email: '',
      phone: '',
      whatsapp: '',
      facebook: '',
      instagram: '',
      googleMaps: ''
    },
    sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
    published: false,
    sections: []
  };

  const [pageData, setPageData] = useState<BusinessPageData>(defaultPageData);
  const [pageSettings, setPageSettings] = useState({
    title: '',
    slug: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    description: '',
    isPublished: false,
    fontFamily: 'sans-serif',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      whatsapp: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    businessHours: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', isOpen: true },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', isOpen: true },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', isOpen: true },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', isOpen: true },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM', isOpen: true },
      { day: 'Saturday', hours: '10:00 AM - 3:00 PM', isOpen: true },
      { day: 'Sunday', hours: 'Closed', isOpen: false }
    ],
    googleMapsUrl: '',
    tmwChatbotCode: '',
    textAlignment: 'left' as TextAlignment,
    headingStyle: 'default' as HeadingStyle,
    buttonStyle: 'default' as ButtonStyle,
    sectionSpacing: 'default' as SectionSpacing,
    contentMaxWidth: '1200px'
  });

  // Initialize TMW chatbot (if enabled)
  useTMWChatbot(
    pageData.chatbot.visible,
    pageData.chatbot.embedCode,
    'tmw-chatbot-container'
  );

  // Fetch user's page data on component mount
  useEffect(() => {
    async function fetchPageData() {
      try {
        setIsLoading(true);
        
        // Get the current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: "Authentication Error",
            description: "Please log in to access the page builder",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        // Check if user already has a business page
        const { data: pageData, error } = await supabase
          .from('business_pages_data')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // Not found is not an error for us
          throw error;
        }
        
        if (pageData) {
          setPageId(pageData.id);
          setPageData(pageData.page_data as BusinessPageData);
          
          // Update page settings
          setPageSettings({
            title: pageData.page_data.pageSetup.businessName || '',
            slug: pageData.page_slug || '',
            primaryColor: pageData.page_data.theme.backgroundColor || '#3B82F6',
            secondaryColor: '#10B981',
            description: pageData.page_data.pageSetup.description || '',
            isPublished: pageData.page_data.published || false,
            fontFamily: pageData.page_data.theme.fontStyle || 'sans-serif',
            textColor: pageData.page_data.theme.textColor || '#000000',
            backgroundColor: pageData.page_data.theme.backgroundColor || '#ffffff',
            contactInfo: {
              email: pageData.page_data.contactInfo.email || '',
              phone: pageData.page_data.contactInfo.phone || '',
              address: pageData.page_data.contactInfo.address || '',
              whatsapp: pageData.page_data.contactInfo.whatsapp || ''
            },
            socialLinks: {
              facebook: pageData.page_data.contactInfo.facebook || '',
              instagram: pageData.page_data.contactInfo.instagram || '',
              twitter: '',
              linkedin: ''
            },
            businessHours: pageData.page_data.workingHours.hours || [],
            googleMapsUrl: pageData.page_data.contactInfo.googleMaps || '',
            tmwChatbotCode: pageData.page_data.chatbot.embedCode || '',
            textAlignment: 'left' as TextAlignment,
            headingStyle: 'default' as HeadingStyle,
            buttonStyle: 'default' as ButtonStyle,
            sectionSpacing: 'default' as SectionSpacing,
            contentMaxWidth: '1200px'
          });
        }
      } catch (error) {
        console.error("Error loading business page data:", error);
        toast({
          title: "Error loading page",
          description: "Could not load your business page data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPageData();
  }, [navigate, toast]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Determine which section of pageData to update
    if (name === 'businessName') {
      setPageData(prev => ({
        ...prev,
        pageSetup: {
          ...prev.pageSetup,
          businessName: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        title: value
      }));
      
    } else if (name === 'description') {
      setPageData(prev => ({
        ...prev,
        pageSetup: {
          ...prev.pageSetup,
          description: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        description: value
      }));
      
    } else if (name === 'slug') {
      setPageSettings(prev => ({
        ...prev,
        slug: value
      }));
      
    } else if (name === 'logo_url') {
      setPageData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          url: value
        }
      }));
      
    } else if (name === 'fontFamily') {
      setPageData(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          fontStyle: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        fontFamily: value
      }));
      
    } else if (name === 'backgroundColor') {
      setPageData(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          backgroundColor: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        backgroundColor: value
      }));
      
    } else if (name === 'textColor') {
      setPageData(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          textColor: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        textColor: value
      }));
      
    } else if (name === 'primaryColor') {
      setPageSettings(prev => ({
        ...prev,
        primaryColor: value
      }));
      
    } else if (name === 'secondaryColor') {
      setPageSettings(prev => ({
        ...prev,
        secondaryColor: value
      }));
      
    } else if (name === 'tmwChatbotCode') {
      setPageData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          embedCode: value
        }
      }));
      
      setPageSettings(prev => ({
        ...prev,
        tmwChatbotCode: value
      }));
      
    } else if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      
      setPageData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
      
      if (field === 'email' || field === 'phone' || field === 'whatsapp') {
        setPageSettings(prev => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [field]: value
          }
        }));
      }
      
    } else if (name.startsWith('socialLinks.')) {
      const platform = name.split('.')[1];
      
      setPageSettings(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
      
      // Also update in contactInfo for the page data
      setPageData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [platform]: value
        }
      }));
    }
  };
  
  // Toggle switch change handler
  const handleToggleChange = (name: string, checked: boolean) => {
    if (name === 'chatbotEnabled') {
      setPageData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          visible: checked
        }
      }));
    } else if (name === 'published') {
      setPageData(prev => ({
        ...prev,
        published: checked
      }));
      
      setPageSettings(prev => ({
        ...prev,
        isPublished: checked
      }));
    }
  };
  
  // Handle save button click
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!pageSettings.title.trim()) {
        toast({
          title: "Business name required",
          description: "Please enter a name for your business page",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a slug if none exists
      let slug = pageSettings.slug;
      if (!slug.trim()) {
        slug = pageSettings.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save your business page",
          variant: "destructive"
        });
        return;
      }
      
      if (pageId) {
        // Update existing page
        const { error } = await supabase
          .from('business_pages_data')
          .update({
            page_slug: slug,
            page_data: pageData,
            updated_at: new Date().toISOString()
          })
          .eq('id', pageId);
          
        if (error) throw error;
        
        toast({
          title: "Page saved",
          description: "Your business page has been updated successfully",
        });
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('business_pages_data')
          .insert({
            user_id: session.user.id,
            page_slug: slug,
            page_data: pageData
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        setPageId(data.id);
        
        toast({
          title: "Page created",
          description: "Your business page has been created successfully",
        });
      }
      
      // Update the page settings with the generated slug
      setPageSettings(prev => ({
        ...prev,
        slug
      }));
      
    } catch (error: any) {
      console.error("Error saving business page:", error);
      toast({
        title: "Error saving page",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle publish button click
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      // Save the page first with published flag
      const updatedPageData = {
        ...pageData,
        published: true
      };
      
      // Update state 
      setPageData(updatedPageData);
      setPageSettings(prev => ({
        ...prev,
        isPublished: true
      }));
      
      if (!pageId) {
        // Save the page first
        await handleSave();
        return;
      }
      
      // Update the page with published flag
      const { error } = await supabase
        .from('business_pages_data')
        .update({
          page_data: updatedPageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);
        
      if (error) throw error;
      
      toast({
        title: "Page published",
        description: `Your business page is now live at ${getPublicPageUrl()}`,
      });
      
    } catch (error: any) {
      console.error("Error publishing business page:", error);
      toast({
        title: "Error publishing page",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Generate a public URL for the page
  const getPublicPageUrl = () => {
    if (!pageSettings.slug) return "#";
    return `https://${pageSettings.slug}.wakti.app`;
  };
  
  // Handle preview mode
  const togglePreview = () => {
    setIsEditMode(prev => !prev);
  };
  
  if (isLoading) {
    return <SimpleLoader />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        pageUrl={pageSettings.slug}
        onPreview={togglePreview}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setIsEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex-1 overflow-hidden">
        {isEditMode ? (
          <div className="flex h-full">
            {/* Left panel: Settings and options */}
            <div className="w-1/3 bg-gray-50 overflow-y-auto p-4 border-r">
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="hours">Hours</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Info</CardTitle>
                      <CardDescription>Set up your business page identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name*</Label>
                        <Input
                          id="businessName"
                          name="businessName"
                          value={pageData.pageSetup.businessName}
                          onChange={handleInputChange}
                          placeholder="Your Business Name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={pageData.pageSetup.description || ''}
                          onChange={handleInputChange}
                          placeholder="Brief description of your business"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">Custom URL</Label>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-1">https://</span>
                          <Input
                            id="slug"
                            name="slug"
                            value={pageSettings.slug}
                            onChange={handleInputChange}
                            placeholder="your-business"
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 ml-1">.wakti.app</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Choose a unique identifier for your page URL
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo_url">Logo URL</Label>
                        <Input
                          id="logo_url"
                          name="logo_url"
                          value={pageData.logo.url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/your-logo.png"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a URL to your business logo
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="font-medium">Published</span>
                          <span className="text-sm text-muted-foreground">Make your page public</span>
                        </div>
                        <Switch
                          checked={pageData.published}
                          onCheckedChange={(checked) => handleToggleChange('published', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Add ways for customers to reach you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="contactInfo.email"
                          value={pageData.contactInfo.email || ''}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="contactInfo.phone"
                          value={pageData.contactInfo.phone || ''}
                          onChange={handleInputChange}
                          placeholder="+1 (234) 567-8901"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          name="contactInfo.whatsapp"
                          value={pageData.contactInfo.whatsapp || ''}
                          onChange={handleInputChange}
                          placeholder="+1 (234) 567-8901"
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Social Links</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            name="socialLinks.facebook"
                            value={pageSettings.socialLinks.facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/yourbusiness"
                          />
                        </div>
                        
                        <div className="space-y-2 mt-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            name="socialLinks.instagram"
                            value={pageSettings.socialLinks.instagram}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/yourbusiness"
                          />
                        </div>
                        
                        <div className="space-y-2 mt-2">
                          <Label htmlFor="googleMaps">Google Maps</Label>
                          <Input
                            id="googleMaps"
                            name="contactInfo.googleMaps"
                            value={pageData.contactInfo.googleMaps || ''}
                            onChange={handleInputChange}
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="hours">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Hours</CardTitle>
                      <CardDescription>Set your regular operating hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pageData.workingHours.hours.map((day, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium">{day.day}</span>
                          <div className="flex items-center gap-2">
                            <Input
                              value={day.hours}
                              onChange={(e) => {
                                const newHours = [...pageData.workingHours.hours];
                                newHours[index] = { 
                                  ...newHours[index], 
                                  hours: e.target.value 
                                };
                                
                                setPageData(prev => ({
                                  ...prev,
                                  workingHours: {
                                    ...prev.workingHours,
                                    hours: newHours
                                  }
                                }));
                                
                                // Also update pageSettings
                                const newBusinessHours = [...pageSettings.businessHours];
                                newBusinessHours[index] = {
                                  ...newBusinessHours[index],
                                  hours: e.target.value
                                };
                                
                                setPageSettings(prev => ({
                                  ...prev,
                                  businessHours: newBusinessHours
                                }));
                              }}
                              className="max-w-[180px]"
                            />
                            <Switch
                              checked={day.isOpen}
                              onCheckedChange={(checked) => {
                                const newHours = [...pageData.workingHours.hours];
                                newHours[index] = { 
                                  ...newHours[index], 
                                  isOpen: checked,
                                  hours: checked ? newHours[index].hours : 'Closed'
                                };
                                
                                setPageData(prev => ({
                                  ...prev,
                                  workingHours: {
                                    ...prev.workingHours,
                                    hours: newHours
                                  }
                                }));
                                
                                // Also update pageSettings
                                const newBusinessHours = [...pageSettings.businessHours];
                                newBusinessHours[index] = {
                                  ...newBusinessHours[index],
                                  isOpen: checked,
                                  hours: checked ? newBusinessHours[index].hours : 'Closed'
                                };
                                
                                setPageSettings(prev => ({
                                  ...prev,
                                  businessHours: newBusinessHours
                                }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize how your page looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fontFamily">Font</Label>
                        <select
                          id="fontFamily"
                          name="fontFamily"
                          value={pageData.theme.fontStyle}
                          onChange={(e) => handleInputChange(e as any)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="sans-serif">Sans-serif</option>
                          <option value="serif">Serif</option>
                          <option value="monospace">Monospace</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="backgroundColor">Background Color</Label>
                          <div className="flex">
                            <Input
                              type="color"
                              id="backgroundColor"
                              name="backgroundColor"
                              value={pageData.theme.backgroundColor}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={pageData.theme.backgroundColor}
                              onChange={handleInputChange}
                              name="backgroundColor"
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="textColor">Text Color</Label>
                          <div className="flex">
                            <Input
                              type="color"
                              id="textColor"
                              name="textColor"
                              value={pageData.theme.textColor}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={pageData.theme.textColor}
                              onChange={handleInputChange}
                              name="textColor"
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex">
                            <Input
                              type="color"
                              id="primaryColor"
                              name="primaryColor"
                              value={pageSettings.primaryColor}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={pageSettings.primaryColor}
                              onChange={handleInputChange}
                              name="primaryColor"
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                          <div className="flex">
                            <Input
                              type="color"
                              id="secondaryColor"
                              name="secondaryColor"
                              value={pageSettings.secondaryColor}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={pageSettings.secondaryColor}
                              onChange={handleInputChange}
                              name="secondaryColor"
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="integrations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chatbot Integration</CardTitle>
                      <CardDescription>Add a chatbot to your business page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Enable Chatbot</span>
                          <span className="text-sm text-muted-foreground">Add a TMW chatbot to your page</span>
                        </div>
                        <Switch
                          checked={pageData.chatbot.visible}
                          onCheckedChange={(checked) => handleToggleChange('chatbotEnabled', checked)}
                        />
                      </div>

                      {pageData.chatbot.visible && (
                        <div className="space-y-2">
                          <Label htmlFor="tmwChatbotCode">Chatbot Embed Code</Label>
                          <Textarea
                            id="tmwChatbotCode"
                            name="tmwChatbotCode"
                            value={pageData.chatbot.embedCode}
                            onChange={handleInputChange}
                            placeholder="<script>...</script> or <iframe>...</iframe>"
                            rows={6}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Paste the embed code for your TMW chatbot here
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </div>
            
            {/* Right panel: Preview */}
            <div className="w-2/3 overflow-y-auto bg-gray-100 p-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Page Preview</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <SimplePagePreview pageData={pageData} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <SimplePagePreview pageData={pageData} />
            </div>
          </div>
        )}
      </div>
      
      {/* TMW Chatbot container */}
      <div id="tmw-chatbot-container" />
    </div>
  );
};

export default Builder;

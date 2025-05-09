
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/auth/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Save } from 'lucide-react';
import SimpleLoading from './SimpleLoading';
import SimplePagePreview from './SimplePagePreview';
import TopBar from './TopBar';
import { BusinessPageData, LogoShape, WorkingHour } from './types';
import { useLogoUpload } from '@/hooks/useLogoUpload';

const Builder = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setEditMode] = useState(true);
  const [pageData, setPageData] = useState<BusinessPageData>({
    pageSetup: {
      businessName: '',
      alignment: 'center',
      visible: true,
      description: '',
    },
    logo: {
      url: '',
      shape: 'circle' as LogoShape,
      alignment: 'center',
      visible: true,
    },
    bookings: {
      viewStyle: 'grid',
      templates: [],
      visible: true,
    },
    socialInline: {
      style: 'icon',
      platforms: {
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true,
      },
      visible: true,
    },
    workingHours: {
      layout: 'card',
      hours: [
        {
          day: 'Monday',
          hours: '9:00 AM - 5:00 PM',
          isOpen: true,
        },
        {
          day: 'Tuesday',
          hours: '9:00 AM - 5:00 PM',
          isOpen: true,
        },
        {
          day: 'Wednesday',
          hours: '9:00 AM - 5:00 PM',
          isOpen: true,
        },
        {
          day: 'Thursday',
          hours: '9:00 AM - 5:00 PM',
          isOpen: true,
        },
        {
          day: 'Friday',
          hours: '9:00 AM - 5:00 PM',
          isOpen: true,
        },
        {
          day: 'Saturday',
          hours: '10:00 AM - 3:00 PM',
          isOpen: false,
        },
        {
          day: 'Sunday',
          hours: 'Closed',
          isOpen: false,
        },
      ],
      visible: true,
    },
    chatbot: {
      position: 'right',
      embedCode: '',
      visible: false,
    },
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      fontStyle: 'sans-serif',
    },
    socialSidebar: {
      position: 'right',
      platforms: {
        whatsapp: true,
        whatsappBusiness: false,
        facebook: true,
        instagram: true,
        googleMaps: true,
        phone: true,
        email: true,
      },
      visible: false,
    },
    contactInfo: {
      email: '',
      phone: '',
      whatsapp: '',
      whatsappBusiness: '',
      facebook: '',
      instagram: '',
      googleMaps: '',
    },
    sectionOrder: ['pageSetup', 'logo', 'bookings', 'socialInline', 'workingHours'],
    published: false,
  });
  
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState<string>('');
  
  // Add logo upload hook
  const { uploadingLogo, handleLogoUpload } = useLogoUpload(
    user?.id,
    (logoUrl) => {
      setPageData(prevData => ({
        ...prevData,
        logo: {
          ...prevData.logo,
          url: logoUrl,
        },
      }));
    }
  );

  useEffect(() => {
    if (user?.id) {
      loadPageData();
    }
  }, [user?.id]);

  const loadPageData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('business_pages_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert from JSON if needed
        setPageId(data.id);
        
        if (data.page_slug) {
          setPageUrl(`https://${data.page_slug}.wakti.app`);
        }
        
        // Check if page_data is already a parsed object or still a string
        let parsedData: BusinessPageData;
        
        if (typeof data.page_data === 'string') {
          try {
            parsedData = JSON.parse(data.page_data) as BusinessPageData;
          } catch (e) {
            console.error('Error parsing page data', e);
            parsedData = { ...pageData };
          }
        } else {
          parsedData = data.page_data as unknown as BusinessPageData;
        }
        
        // Ensure the loaded data has all the required fields
        const initializedData = {
          ...pageData,
          ...parsedData,
          pageSetup: {
            ...pageData.pageSetup,
            ...parsedData.pageSetup,
          },
          theme: {
            ...pageData.theme,
            ...parsedData.theme,
          },
          contactInfo: {
            ...pageData.contactInfo,
            ...parsedData.contactInfo,
          },
          logo: {
            ...pageData.logo,
            ...parsedData.logo,
          },
          workingHours: {
            ...pageData.workingHours,
            hours: parsedData.workingHours?.hours || pageData.workingHours.hours,
          },
          chatbot: {
            ...pageData.chatbot,
            ...parsedData.chatbot,
          },
        };
        
        setPageData(initializedData);
      }
    } catch (error) {
      console.error('Error loading page data:', error);
      toast({
        title: 'Error loading page data',
        description: 'There was a problem loading your page data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof BusinessPageData,
    field?: string
  ) => {
    const { name, value } = e.target;
    
    if (section && field) {
      setPageData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      // Find which section contains this field 
      // This is a simplified approach - in a real app we might have a more structured way
      if (name === 'businessName' || name === 'description') {
        setPageData(prev => ({
          ...prev,
          pageSetup: {
            ...prev.pageSetup,
            [name]: value,
          },
        }));
      } else if (name === 'backgroundColor' || name === 'textColor' || name === 'fontStyle') {
        setPageData(prev => ({
          ...prev,
          theme: {
            ...prev.theme,
            [name]: value,
          },
        }));
      } else if (name === 'email' || name === 'phone' || name === 'whatsapp' || 
                 name === 'facebook' || name === 'instagram' || name === 'googleMaps') {
        setPageData(prev => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [name]: value,
          },
        }));
      } else if (name === 'embedCode') {
        setPageData(prev => ({
          ...prev,
          chatbot: {
            ...prev.chatbot,
            embedCode: value,
          },
        }));
      }
    }
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    // Handle toggles based on their names
    if (name === 'published') {
      setPageData(prev => ({
        ...prev,
        published: checked,
      }));
    } else if (name.startsWith('platforms.')) {
      const platform = name.split('.')[1];
      setPageData(prev => ({
        ...prev,
        socialInline: {
          ...prev.socialInline,
          platforms: {
            ...prev.socialInline.platforms,
            [platform]: checked,
          },
        },
      }));
    } else if (name.startsWith('visible.')) {
      const section = name.split('.')[1] as keyof BusinessPageData;
      setPageData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          visible: checked,
        },
      }));
    } else if (name.startsWith('workingHours.')) {
      const dayIndex = parseInt(name.split('.')[1]);
      const newHours = [...pageData.workingHours.hours];
      newHours[dayIndex] = {
        ...newHours[dayIndex],
        isOpen: checked,
      };
      setPageData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          hours: newHours,
        },
      }));
    } else if (name === 'chatbotVisible') {
      setPageData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          visible: checked,
        },
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'logoShape') {
      setPageData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          shape: value as LogoShape,
        },
      }));
    } else if (name === 'fontStyle') {
      setPageData(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          fontStyle: value,
        },
      }));
    } else if (name === 'chatbotPosition') {
      setPageData(prev => ({
        ...prev,
        chatbot: {
          ...prev.chatbot,
          position: value,
        },
      }));
    }
  };

  const handleWorkingHourChange = (index: number, value: string) => {
    const newHours = [...pageData.workingHours.hours];
    newHours[index] = {
      ...newHours[index],
      hours: value,
    };
    setPageData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        hours: newHours,
      },
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      // Create the data structure to save
      const saveData = {
        user_id: user.id,
        page_data: pageData,
        page_slug: pageData.pageSetup.businessName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-'),
      };
      
      if (pageId) {
        // Update existing
        const { error } = await supabase
          .from('business_pages_data')
          .update(saveData)
          .eq('id', pageId);
          
        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('business_pages_data')
          .insert(saveData)
          .select();
          
        if (error) throw error;
        if (data && data[0]) {
          setPageId(data[0].id);
        }
      }
      
      toast({
        title: "Page saved",
        description: "Your page has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: 'Error saving page',
        description: 'There was a problem saving your page. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user?.id) return;
    
    try {
      setIsPublishing(true);
      
      // First save the page
      await handleSave();
      
      // Then update the published status
      const updatedPageData = {
        ...pageData,
        published: true,
      };
      
      await supabase
        .from('business_pages_data')
        .update({
          page_data: updatedPageData,
        })
        .eq('id', pageId);
        
      setPageData(updatedPageData);
      
      // Generate page URL if not already set
      if (!pageUrl) {
        const slug = pageData.pageSetup.businessName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-');
        
        setPageUrl(`https://${slug}.wakti.app`);
      }
      
      toast({
        title: "Page published",
        description: "Your page has been published successfully.",
      });
    } catch (error) {
      console.error('Error publishing page:', error);
      toast({
        title: 'Error publishing page',
        description: 'There was a problem publishing your page. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    setEditMode(!isEditMode);
  };

  const getPublicPageUrl = () => {
    if (!pageUrl) {
      return '#';
    }
    return pageUrl;
  };

  if (isLoading) {
    return <SimpleLoading />;
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        pageUrl={getPublicPageUrl()}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setEditMode}
        pageSettings={{
          title: pageData.pageSetup.businessName,
          slug: pageUrl.split('//')[1]?.split('.')[0] || '',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          description: pageData.pageSetup.description || '',
          isPublished: pageData.published,
          fontFamily: pageData.theme.fontStyle,
          textColor: pageData.theme.textColor,
          backgroundColor: pageData.theme.backgroundColor,
          contactInfo: {
            email: pageData.contactInfo.email,
            phone: pageData.contactInfo.phone,
            address: '',
            whatsapp: pageData.contactInfo.whatsapp,
          },
          socialLinks: {
            facebook: pageData.contactInfo.facebook,
            instagram: pageData.contactInfo.instagram,
            twitter: '',
            linkedin: '',
          },
          businessHours: pageData.workingHours.hours.map(hour => ({ 
            day: hour.day, 
            hours: hour.hours,
            isOpen: hour.isOpen
          })),
          googleMapsUrl: pageData.contactInfo.googleMaps,
          tmwChatbotCode: pageData.chatbot.embedCode,
        }}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {isEditMode ? (
          <div className="w-1/2 overflow-auto p-4 bg-gray-50 border-r">
            <Tabs defaultValue="business-details">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="business-details">Business Details</TabsTrigger>
                <TabsTrigger value="contact-info">Contact & Hours</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="business-details">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        name="businessName" 
                        value={pageData.pageSetup.businessName} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={pageData.pageSetup.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      {pageData.logo.url && (
                        <div className="mb-2">
                          <img 
                            src={pageData.logo.url} 
                            alt="Business Logo" 
                            className="h-20 w-20 object-contain border rounded"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e)}
                        disabled={uploadingLogo}
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Label>Logo Shape:</Label>
                        <select 
                          value={pageData.logo.shape}
                          onChange={(e) => handleSelectChange('logoShape', e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="circle">Circle</option>
                          <option value="square">Square</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact-info">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={pageData.contactInfo.email} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={pageData.contactInfo.phone} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input 
                        id="whatsapp" 
                        name="whatsapp" 
                        value={pageData.contactInfo.whatsapp} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input 
                        id="facebook" 
                        name="facebook" 
                        value={pageData.contactInfo.facebook} 
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input 
                        id="instagram" 
                        name="instagram" 
                        value={pageData.contactInfo.instagram} 
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/yourbusiness"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="googleMaps">Google Maps URL</Label>
                      <Input 
                        id="googleMaps" 
                        name="googleMaps" 
                        value={pageData.contactInfo.googleMaps} 
                        onChange={handleInputChange}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label className="block mb-2">Show Social Icons</Label>
                      <div className="flex flex-col space-y-2">
                        {Object.keys(pageData.socialInline.platforms).map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Switch
                              checked={pageData.socialInline.platforms[platform as keyof SocialPlatforms]}
                              onCheckedChange={(checked) => handleToggleChange(`platforms.${platform}`, checked)}
                            />
                            <Label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pageData.workingHours.hours.map((day, index) => (
                      <div key={day.day} className="flex items-center mb-2">
                        <div className="w-24">{day.day}</div>
                        <div className="flex-1">
                          <Input
                            value={day.hours}
                            onChange={(e) => handleWorkingHourChange(index, e.target.value)}
                            disabled={!day.isOpen}
                          />
                        </div>
                        <div className="ml-2 flex items-center">
                          <Switch
                            checked={day.isOpen}
                            onCheckedChange={(checked) => handleToggleChange(`workingHours.${index}`, checked)}
                          />
                          <span className="ml-2">{day.isOpen ? 'Open' : 'Closed'}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          id="backgroundColor"
                          name="backgroundColor" 
                          value={pageData.theme.backgroundColor} 
                          onChange={handleInputChange}
                          className="w-10 h-10"
                        />
                        <Input 
                          value={pageData.theme.backgroundColor} 
                          onChange={handleInputChange}
                          name="backgroundColor"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          id="textColor"
                          name="textColor" 
                          value={pageData.theme.textColor} 
                          onChange={handleInputChange}
                          className="w-10 h-10"
                        />
                        <Input 
                          value={pageData.theme.textColor} 
                          onChange={handleInputChange}
                          name="textColor"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontStyle">Font Style</Label>
                      <select 
                        id="fontStyle"
                        value={pageData.theme.fontStyle} 
                        onChange={(e) => handleSelectChange('fontStyle', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="sans-serif">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Section Visibility</h3>
                      <div className="space-y-2">
                        {['logo', 'bookings', 'socialInline', 'workingHours'].map((section) => (
                          <div key={section} className="flex items-center space-x-2">
                            <Switch
                              checked={pageData[section as keyof BusinessPageData]?.visible || false}
                              onCheckedChange={(checked) => handleToggleChange(`visible.${section}`, checked)}
                            />
                            <Label>{section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations">
                <Card>
                  <CardHeader>
                    <CardTitle>TMW Chatbot Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        checked={pageData.chatbot.visible}
                        onCheckedChange={(checked) => handleToggleChange('chatbotVisible', checked)}
                        id="chatbotVisible"
                      />
                      <Label htmlFor="chatbotVisible">Enable TMW Chatbot</Label>
                    </div>
                    
                    {pageData.chatbot.visible && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="embedCode">TMW Chatbot Embed Code</Label>
                          <Textarea 
                            id="embedCode" 
                            name="embedCode" 
                            value={pageData.chatbot.embedCode} 
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Paste your TMW Chatbot embed code here..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="chatbotPosition">Chatbot Position</Label>
                          <select 
                            id="chatbotPosition"
                            value={pageData.chatbot.position}
                            onChange={(e) => handleSelectChange('chatbotPosition', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="left">Left Side</option>
                            <option value="right">Right Side</option>
                          </select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : null}
        
        <div className={`${isEditMode ? 'w-1/2' : 'w-full'} overflow-auto border-l`}>
          <SimplePagePreview pageData={pageData} />
        </div>
      </div>
    </div>
  );
};

export default Builder;

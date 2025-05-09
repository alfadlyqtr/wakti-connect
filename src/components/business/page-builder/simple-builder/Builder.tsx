
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/auth/useUser";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/types/supabase";
import SimpleLoading from './SimpleLoading';
import SimplePagePreview from './SimplePagePreview';
import { 
  BusinessPageData, 
  TextAlignment, 
  LogoShape, 
  HeadingStyle, 
  ButtonStyle, 
  SectionSpacing, 
  WorkingHour,
  BusinessPageRecord,
  SocialPlatforms 
} from './types';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Builder: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<BusinessPageData>({
    pageSetup: {
      businessName: "",
      alignment: "center" as TextAlignment,
      visible: true,
      description: ""
    },
    logo: {
      url: "",
      shape: "circle" as LogoShape,
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
      hours: DAYS_OF_WEEK.map((day) => ({
        day,
        hours: "9:00 AM - 5:00 PM",
        isOpen: true
      })),
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
    published: false,
    sections: []
  });
  const [existingPageId, setExistingPageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("content");
  
  // Load existing page data if available
  useEffect(() => {
    const fetchPageData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('business_pages_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error("Error fetching business page data:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          const record = data[0];
          setExistingPageId(record.id);
          
          // Parse the page_data and apply defaults where needed
          const parsedData = record.page_data as any;
          
          // Handle theme defaults
          if (!parsedData.theme) {
            parsedData.theme = {
              backgroundColor: "#ffffff",
              textColor: "#000000",
              fontStyle: "sans-serif"
            };
          }
          
          // Add description to pageSetup if it doesn't exist
          if (parsedData.pageSetup && !parsedData.pageSetup.description) {
            parsedData.pageSetup.description = "";
          }
          
          // Ensure working hours has the correct structure
          if (!parsedData.workingHours || !parsedData.workingHours.hours) {
            parsedData.workingHours = {
              ...parsedData.workingHours,
              hours: DAYS_OF_WEEK.map((day) => ({
                day,
                hours: "9:00 AM - 5:00 PM",
                isOpen: true
              }))
            };
          }
          
          // Ensure contact info has all required fields
          if (!parsedData.contactInfo) {
            parsedData.contactInfo = {
              email: "",
              whatsapp: "",
              whatsappBusiness: "",
              phone: "",
              facebook: "",
              googleMaps: "",
              instagram: ""
            };
          }
          
          // Make sure platforms exist in social sections
          const defaultPlatforms = {
            whatsapp: false,
            whatsappBusiness: false,
            facebook: false,
            instagram: false,
            googleMaps: false,
            phone: false,
            email: false
          };
          
          if (!parsedData.socialInline || !parsedData.socialInline.platforms) {
            parsedData.socialInline = {
              ...parsedData.socialInline,
              platforms: defaultPlatforms
            };
          }
          
          if (!parsedData.socialSidebar || !parsedData.socialSidebar.platforms) {
            parsedData.socialSidebar = {
              ...parsedData.socialSidebar,
              platforms: defaultPlatforms
            };
          }
          
          // Set standard fields if missing
          if (!parsedData.headingStyle) parsedData.headingStyle = "default" as HeadingStyle;
          if (!parsedData.buttonStyle) parsedData.buttonStyle = "default" as ButtonStyle;
          if (!parsedData.sectionSpacing) parsedData.sectionSpacing = "default" as SectionSpacing;
          
          setPageData(parsedData as BusinessPageData);
        }
      } catch (err) {
        console.error("Error loading business page data:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your business page data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageData();
  }, [user?.id]);
  
  const handleSave = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to save your business page",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      let pageSlug = null;
      if (pageData.pageSetup?.businessName) {
        pageSlug = pageData.pageSetup.businessName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      
      if (existingPageId) {
        // Update existing page data
        const { data, error } = await supabase
          .from('business_pages_data')
          .update({
            page_slug: pageSlug,
            page_data: pageData as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPageId);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Page Updated",
          description: "Your business page has been updated successfully",
        });
      } else {
        // Create new page data
        const { data, error } = await supabase
          .from('business_pages_data')
          .insert({
            user_id: user.id,
            page_slug: pageSlug,
            page_data: pageData as unknown as Json
          });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Page Created",
          description: "Your business page has been created successfully",
        });
      }
    } catch (err: any) {
      console.error("Error saving business page data:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save business page data",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const updateField = (
    section: keyof BusinessPageData,
    field: string,
    value: any
  ) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (
    section: keyof BusinessPageData,
    parent: string,
    field: string,
    value: any
  ) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...(prev[section] as any)[parent],
          [field]: value
        }
      }
    }));
  };
  
  const updateSocialPlatform = (
    section: 'socialInline' | 'socialSidebar',
    platform: keyof SocialPlatforms,
    value: boolean
  ) => {
    setPageData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        platforms: {
          ...(prev[section] as any).platforms,
          [platform]: value
        }
      }
    }));
  };
  
  const updateWorkingHour = (
    index: number,
    field: keyof WorkingHour,
    value: string | boolean
  ) => {
    setPageData((prev) => {
      const newHours = [...prev.workingHours.hours];
      newHours[index] = {
        ...newHours[index],
        [field]: value
      };
      return {
        ...prev,
        workingHours: {
          ...prev.workingHours,
          hours: newHours
        }
      };
    });
  };
  
  if (loading) {
    return <SimpleLoading />;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Editor Panel */}
        <div className="w-full md:w-1/2 lg:w-2/5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Business Page Editor</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPageData(prev => ({...prev, published: !prev.published}))}
              >
                {pageData.published ? "Unpublish" : "Publish"}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                size="sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="space-y-6">
                {/* Business Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={pageData.pageSetup.businessName}
                        onChange={(e) => updateField("pageSetup", "businessName", e.target.value)}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={pageData.pageSetup.description || ""}
                        onChange={(e) => updateField("pageSetup", "description", e.target.value)}
                        placeholder="Describe your business"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alignment">Text Alignment</Label>
                      <Select
                        value={pageData.pageSetup.alignment}
                        onValueChange={(value: TextAlignment) => updateField("pageSetup", "alignment", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Logo */}
                <Card>
                  <CardHeader>
                    <CardTitle>Logo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={pageData.logo.url}
                        onChange={(e) => updateField("logo", "url", e.target.value)}
                        placeholder="Enter logo URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logoShape">Logo Shape</Label>
                      <Select
                        value={pageData.logo.shape}
                        onValueChange={(value: LogoShape) => updateField("logo", "shape", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="logoVisible">Show Logo</Label>
                      <Switch
                        id="logoVisible"
                        checked={pageData.logo.visible}
                        onCheckedChange={(value) => updateField("logo", "visible", value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={pageData.contactInfo.email}
                        onChange={(e) => updateField("contactInfo", "email", e.target.value)}
                        placeholder="your@email.com"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={pageData.contactInfo.phone}
                        onChange={(e) => updateField("contactInfo", "phone", e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Social Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={pageData.contactInfo.facebook}
                        onChange={(e) => updateField("contactInfo", "facebook", e.target.value)}
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={pageData.contactInfo.instagram}
                        onChange={(e) => updateField("contactInfo", "instagram", e.target.value)}
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={pageData.contactInfo.whatsapp}
                        onChange={(e) => updateField("contactInfo", "whatsapp", e.target.value)}
                        placeholder="WhatsApp number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="googleMaps">Google Maps</Label>
                      <Input
                        id="googleMaps"
                        value={pageData.contactInfo.googleMaps}
                        onChange={(e) => updateField("contactInfo", "googleMaps", e.target.value)}
                        placeholder="Google Maps URL"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Business Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pageData.workingHours.hours.map((hour, index) => (
                      <div key={hour.day} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-3 font-medium">{hour.day}</span>
                        <div className="col-span-6">
                          <Input
                            value={hour.hours}
                            onChange={(e) => updateWorkingHour(index, "hours", e.target.value)}
                            disabled={!hour.isOpen}
                          />
                        </div>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Label htmlFor={`day-${index}`}>Open</Label>
                          <Switch
                            id={`day-${index}`}
                            checked={hour.isOpen}
                            onCheckedChange={(value) => updateWorkingHour(index, "isOpen", value)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="workingHoursVisible">Show Business Hours</Label>
                      <Switch
                        id="workingHoursVisible"
                        checked={pageData.workingHours.visible}
                        onCheckedChange={(value) => updateField("workingHours", "visible", value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="backgroundColor"
                        value={pageData.theme.backgroundColor}
                        onChange={(e) => updateField("theme", "backgroundColor", e.target.value)}
                        placeholder="#ffffff"
                      />
                      <input
                        type="color"
                        value={pageData.theme.backgroundColor}
                        onChange={(e) => updateField("theme", "backgroundColor", e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded border"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="textColor"
                        value={pageData.theme.textColor}
                        onChange={(e) => updateField("theme", "textColor", e.target.value)}
                        placeholder="#000000"
                      />
                      <input
                        type="color"
                        value={pageData.theme.textColor}
                        onChange={(e) => updateField("theme", "textColor", e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded border"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontStyle">Font Style</Label>
                    <Select
                      value={pageData.theme.fontStyle}
                      onValueChange={(value) => updateField("theme", "fontStyle", value)}
                    >
                      <SelectTrigger id="fontStyle">
                        <SelectValue placeholder="Select font style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="space-y-2">
                    <Label htmlFor="chatbotCode">Chatbot Embed Code</Label>
                    <Textarea
                      id="chatbotCode"
                      value={pageData.chatbot.embedCode}
                      onChange={(e) => updateField("chatbot", "embedCode", e.target.value)}
                      placeholder="Paste your TMW chatbot embed code here"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="chatbotPosition">Chatbot Position</Label>
                    <Select
                      value={pageData.chatbot.position}
                      onValueChange={(value) => updateField("chatbot", "position", value)}
                    >
                      <SelectTrigger id="chatbotPosition">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="chatbotEnabled"
                      checked={pageData.chatbot.visible}
                      onCheckedChange={(value) => updateField("chatbot", "visible", value)}
                    />
                    <Label htmlFor="chatbotEnabled">Enable Chatbot</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Preview Panel */}
        <div className="w-full md:w-1/2 lg:w-3/5 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-medium">Preview</h2>
            <div className="text-xs text-slate-500">{pageData.published ? "Published" : "Draft"}</div>
          </div>
          <div className="p-4 h-[calc(100vh-13rem)] overflow-y-auto">
            <SimplePagePreview pageData={pageData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;

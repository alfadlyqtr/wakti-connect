import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/auth/useUser";
import { supabase } from "@/integrations/supabase/client";
import {
  BusinessPageData,
  TextAlignment,
  HeadingStyle,
  ButtonStyle,
  SectionSpacing,
  LogoShape,
  SocialPlatforms,
  SectionType
} from './types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateSlug } from "@/utils/string-utils";
import SettingsTab from './editor-tabs/SettingsTab';

const initialPageSettings = {
  title: 'My Business Page',
  slug: '',
  primaryColor: '#007BFF',
  secondaryColor: '#6C757D',
  description: 'Welcome to my business page!',
  isPublished: false,
  fontFamily: 'Arial, sans-serif',
  textColor: '#333333',
  backgroundColor: '#F8F9FA',
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    whatsapp: '',
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
  },
  businessHours: [],
  googleMapsUrl: '',
  tmwChatbotCode: '',
  textAlignment: 'left' as TextAlignment,
  headingStyle: 'default' as HeadingStyle,
  buttonStyle: 'default' as ButtonStyle,
  sectionSpacing: 'default' as SectionSpacing,
  contentMaxWidth: '800px',
};

const initialBusinessPageData: BusinessPageData = {
  pageSetup: {
    businessName: 'My Business',
    alignment: 'center' as TextAlignment,
    visible: true,
    description: 'Welcome to our business page!',
  },
  logo: {
    url: '',
    shape: 'circle' as LogoShape,
    alignment: 'center' as TextAlignment,
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
      googleMaps: false,
      phone: true,
      email: true,
    },
    visible: true,
  },
  workingHours: {
    layout: 'table',
    hours: [],
    visible: true,
  },
  chatbot: {
    position: 'bottom-right',
    embedCode: '',
    visible: false,
  },
  theme: {
    backgroundColor: '#f9f9f9',
    textColor: '#333333',
    fontStyle: 'Arial, sans-serif',
  },
  socialSidebar: {
    position: 'left',
    platforms: {
      whatsapp: true,
      whatsappBusiness: false,
      facebook: true,
      instagram: true,
      googleMaps: false,
      phone: true,
      email: true,
    },
    visible: false,
  },
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    whatsapp: '',
  },
  sectionOrder: ['pageSetup', 'logo', 'bookings', 'socialInline', 'workingHours'],
  published: false,
  pageSlug: '',
};

const Builder: React.FC = () => {
  const { user } = useUser();
  const [pageSettings, setPageSettings] = useState(initialPageSettings);
  const [businessPageData, setBusinessPageData] = useState<BusinessPageData>(initialBusinessPageData);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeTab, setActiveTab] = useState<"sections" | "settings">("sections");
  const { toast } = useToast();

  // Fetch existing data or initialize
  useEffect(() => {
    const fetchPageData = async () => {
      if (user?.id) {
        const { data: existingData, error } = await supabase
          .from('business_pages_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching business page data:", error);
          toast({
            title: "Error fetching data",
            description: "Failed to load existing page data.",
            variant: "destructive",
          });
        } else if (existingData) {
          // Ensure page_data exists and is an object
          if (existingData.page_data && typeof existingData.page_data === 'object') {
            setBusinessPageData(existingData.page_data as BusinessPageData);
          } else {
            console.warn("Invalid page_data format in database, using initial data.");
            setBusinessPageData(initialBusinessPageData);
          }
          // Initialize page settings from existing data if available
          setPageSettings({
            title: existingData.page_data?.pageSetup?.businessName || initialPageSettings.title,
            slug: existingData.page_data?.pageSlug || initialPageSettings.slug,
            primaryColor: initialPageSettings.primaryColor,
            secondaryColor: initialPageSettings.secondaryColor,
            description: initialPageSettings.description,
            isPublished: existingData.page_data?.published || initialPageSettings.isPublished,
            fontFamily: initialPageSettings.fontFamily,
            textColor: initialPageSettings.textColor,
            backgroundColor: initialPageSettings.backgroundColor,
            contactInfo: initialPageSettings.contactInfo,
            socialLinks: initialPageSettings.socialLinks,
            businessHours: initialPageSettings.businessHours,
            googleMapsUrl: initialPageSettings.googleMapsUrl,
            tmwChatbotCode: initialPageSettings.tmwChatbotCode,
            textAlignment: existingData.page_data?.pageSetup?.alignment || initialPageSettings.textAlignment,
            headingStyle: initialPageSettings.headingStyle,
            buttonStyle: initialPageSettings.buttonStyle,
            sectionSpacing: initialPageSettings.sectionSpacing,
            contentMaxWidth: initialPageSettings.contentMaxWidth,
          });
        }
      }
    };

    fetchPageData();
  }, [user?.id, toast]);

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to save changes.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure there's a valid slug
      let pageSlug = pageSettings.slug;
      if (!pageSlug && pageSettings.title) {
        pageSlug = generateSlug(pageSettings.title);
        setPageSettings(prev => ({ ...prev, slug: pageSlug }));
      }

      // Update businessPageData with current settings
      const updatedBusinessPageData: BusinessPageData = {
        ...businessPageData,
        pageSlug: pageSlug,
        pageSetup: {
          ...businessPageData.pageSetup,
          businessName: pageSettings.title,
          alignment: pageSettings.textAlignment,
        },
      };

      const { data, error } = await supabase
        .from('business_pages_data')
        .upsert(
          [
            {
              user_id: user.id,
              page_slug: pageSlug,
              page_data: updatedBusinessPageData,
            },
          ],
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        console.error("Error saving business page data:", error);
        toast({
          title: "Error saving",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Changes saved",
          description: "Your changes have been saved successfully.",
        });
      }
    } catch (err) {
      console.error("Exception during save:", err);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessPageData({
      ...businessPageData,
      pageSetup: {
        ...businessPageData.pageSetup,
        businessName: e.target.value,
      },
    });
  };

  const handleAlignmentChange = (alignment: TextAlignment) => {
    setBusinessPageData({
      ...businessPageData,
      pageSetup: {
        ...businessPageData.pageSetup,
        alignment: alignment,
      },
    });
  };

  const toggleSectionVisibility = (section: keyof BusinessPageData) => {
    setBusinessPageData({
      ...businessPageData,
      [section]: {
        ...businessPageData[section],
        visible: !businessPageData[section].visible,
      },
    });
  };

  const SectionCard = ({
    sectionKey,
    title,
  }: {
    sectionKey: keyof BusinessPageData;
    title: string;
  }) => (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <CardHeader className="pl-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Switch
            checked={businessPageData[sectionKey].visible}
            onCheckedChange={() => toggleSectionVisibility(sectionKey)}
            aria-label="Toggle visibility"
          />
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        {/* Left Panel / Editor */}
        <div className="w-80 p-4 border-r bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Edit Your Page</h2>

          {/* Tabs */}
          <div className="mb-4">
            <Button
              variant={activeTab === "sections" ? "default" : "outline"}
              onClick={() => setActiveTab("sections")}
              className="w-1/2 rounded-none"
            >
              Sections
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "outline"}
              onClick={() => setActiveTab("settings")}
              className="w-1/2 rounded-none"
            >
              Settings
            </Button>
          </div>

          {activeTab === "sections" && (
            <div className="space-y-4">
              <SectionCard sectionKey="pageSetup" title="Page Setup" />
              <SectionCard sectionKey="logo" title="Logo" />
              <SectionCard sectionKey="bookings" title="Bookings" />
              <SectionCard sectionKey="socialInline" title="Social Links" />
              <SectionCard sectionKey="workingHours" title="Working Hours" />
            </div>
          )}

          {activeTab === "settings" && (
            <SettingsTab pageSettings={pageSettings} setPageSettings={setPageSettings} pageData={businessPageData} />
          )}

          <Button onClick={handleSave} className="w-full mt-6">
            Save Changes
          </Button>
        </div>

        {/* Right Panel / Preview */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-semibold mb-4">Page Preview</h2>
          <div
            className="p-6 rounded shadow-md"
            style={{
              backgroundColor: pageSettings.backgroundColor,
              color: pageSettings.textColor,
              fontFamily: pageSettings.fontFamily,
            }}
          >
            <h1
              className="text-2xl font-bold mb-2"
              style={{ textAlign: pageSettings.textAlignment }}
            >
              {pageSettings.title}
            </h1>
            <p style={{ textAlign: pageSettings.textAlignment }}>
              {pageSettings.description}
            </p>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Builder;

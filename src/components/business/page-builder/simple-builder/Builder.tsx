
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/auth/useUser';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import TopBar from './TopBar';
import PagePreview from './PagePreview';
import EditorPanel from './EditorPanel';
import SimpleLoading from './SimpleLoading';
import SimplePagePreview from './SimplePagePreview';
import { 
  SectionType, 
  BusinessPageData, 
  PageSettings, 
  TextAlignment,
  HeadingStyle,
  ButtonStyle,
  SectionSpacing,
} from './types';

// Define a type for the Json coming from Supabase
import { Json } from '@/types/supabase';

// Utility function to safely convert Json to BusinessPageData
const convertJsonToBusinessPageData = (json: Json | null): BusinessPageData => {
  if (!json) {
    // Return default structure if no data
    return {
      pageSetup: {
        businessName: "My Business",
        alignment: "center" as TextAlignment,
        visible: true,
        description: "",
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
        hours: [], 
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
    };
  }

  // Try to cast the json to BusinessPageData
  try {
    const typedJson = json as unknown;
    const businessPageData = typedJson as BusinessPageData;

    // Ensure required structures exist with defaults
    return {
      pageSetup: businessPageData.pageSetup || {
        businessName: "My Business",
        alignment: "center" as TextAlignment,
        visible: true,
        description: "",
      },
      logo: businessPageData.logo || { 
        url: "", 
        shape: "circle", 
        alignment: "center", 
        visible: true 
      },
      bookings: businessPageData.bookings || { 
        viewStyle: "grid", 
        templates: [], 
        visible: true 
      },
      socialInline: businessPageData.socialInline || { 
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
      workingHours: businessPageData.workingHours || { 
        layout: "card", 
        hours: [], 
        visible: true
      },
      chatbot: businessPageData.chatbot || { 
        position: "right", 
        embedCode: "", 
        visible: false
      },
      theme: businessPageData.theme || {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontStyle: "sans-serif"
      },
      socialSidebar: businessPageData.socialSidebar || { 
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
      contactInfo: businessPageData.contactInfo || {
        email: "",
        whatsapp: "",
        whatsappBusiness: "",
        phone: "",
        facebook: "",
        googleMaps: "",
        instagram: ""
      },
      sectionOrder: businessPageData.sectionOrder || ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
      published: businessPageData.published || false,
      sections: businessPageData.sections || []
    };
  } catch (error) {
    console.error("Error converting JSON to BusinessPageData:", error);
    // Return default on error
    return {
      pageSetup: {
        businessName: "My Business",
        alignment: "center" as TextAlignment,
        visible: true,
        description: "",
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
        hours: [], 
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
    };
  }
};

const Builder = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [pageData, setPageData] = useState<BusinessPageData | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageSlug, setPageSlug] = useState<string>('');
  const [activeTab, setActiveTab] = useState('sections');
  const [sections, setSections] = useState<SectionType[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
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
    businessHours: [],
    googleMapsUrl: '',
    tmwChatbotCode: '',
    textAlignment: 'left',
    headingStyle: 'default',
    buttonStyle: 'default',
    sectionSpacing: 'default',
    contentMaxWidth: '1200px'
  });

  const { user } = useUser();
  const queryClient = useQueryClient();
  
  // Fetch page data
  useEffect(() => {
    const fetchPageData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('business_pages_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (error) {
          console.error("Error fetching business page data:", error);
          toast({
            variant: "destructive",
            title: "Error fetching page data",
            description: error.message,
          });
          setIsLoading(false);
          return;
        }

        if (data) {
          console.log("Fetched page data:", data);
          setPageId(data.id);
          setPageSlug(data.page_slug || '');
          
          // Convert from JSON to our BusinessPageData type
          const convertedData = convertJsonToBusinessPageData(data.page_data);
          setPageData(convertedData);
          
          // Set page settings from the fetched data
          const fetchedSettings: PageSettings = {
            title: convertedData.pageSetup?.businessName || '',
            slug: data.page_slug || '',
            primaryColor: convertedData.theme?.backgroundColor || '#ffffff',
            secondaryColor: '#10B981',
            description: convertedData.pageSetup?.description || '',
            isPublished: convertedData.published || false,
            fontFamily: convertedData.theme?.fontStyle || 'sans-serif',
            textColor: convertedData.theme?.textColor || '#000000',
            backgroundColor: convertedData.theme?.backgroundColor || '#ffffff',
            contactInfo: {
              email: convertedData.contactInfo?.email || '',
              phone: convertedData.contactInfo?.phone || '',
              address: '',
              whatsapp: convertedData.contactInfo?.whatsapp || ''
            },
            socialLinks: {
              facebook: convertedData.contactInfo?.facebook || '',
              instagram: convertedData.contactInfo?.instagram || '',
              twitter: '',
              linkedin: ''
            },
            businessHours: [],
            googleMapsUrl: convertedData.contactInfo?.googleMaps || '',
            tmwChatbotCode: convertedData.chatbot?.embedCode || '',
            textAlignment: 'left',
            headingStyle: 'default',
            buttonStyle: 'default',
            sectionSpacing: 'default',
            contentMaxWidth: '1200px'
          };
          
          setPageSettings(fetchedSettings);
          
          // Set sections if available
          if (convertedData.sections && Array.isArray(convertedData.sections)) {
            setSections(convertedData.sections);
          }
        } else {
          // Create new page with default data if none exists
          const defaultData = createDefaultPageData();
          setPageData(defaultData);
          
          // Set default page settings
          setPageSettings({
            title: defaultData.pageSetup.businessName,
            slug: '',
            primaryColor: '#3B82F6',
            secondaryColor: '#10B981',
            description: defaultData.pageSetup.description || '',
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
            businessHours: [],
            googleMapsUrl: '',
            tmwChatbotCode: '',
            textAlignment: 'left',
            headingStyle: 'default',
            buttonStyle: 'default',
            sectionSpacing: 'default',
            contentMaxWidth: '1200px'
          });
          
          // Create a new page record
          await createNewPage(defaultData, user.id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Exception while fetching page data:", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load page data",
        });
      }
    };

    fetchPageData();
  }, [user?.id]);

  // Create a new page function
  const createNewPage = async (pageData: BusinessPageData, userId: string) => {
    try {
      setIsSaving(true);
      
      // Generate a slug from the business name
      const generatedSlug = generateSlugFromName(pageData.pageSetup.businessName);
      setPageSlug(generatedSlug);
      
      // Create new page record
      const { data, error } = await supabase
        .from('business_pages_data')
        .insert({
          user_id: userId,
          page_slug: generatedSlug,
          page_data: pageData as unknown as Json
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error creating business page:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create business page: " + error.message,
        });
        setIsSaving(false);
        return;
      }
      
      console.log("Created new page:", data);
      setPageId(data.id);
      
      toast({
        title: "Business page created",
        description: "Your business page has been created successfully",
      });
      
      setIsSaving(false);
    } catch (error) {
      console.error("Exception while creating new page:", error);
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create business page",
      });
    }
  };

  // Generate slug from name
  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Create default page data
  const createDefaultPageData = (): BusinessPageData => {
    return {
      pageSetup: {
        businessName: "My Business",
        alignment: "center" as TextAlignment,
        visible: true,
        description: "Welcome to my business page",
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
        hours: [], 
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
      sections: [
        {
          id: uuidv4(),
          type: "header",
          title: "Header Section",
          content: {},
          activeLayout: "default",
        }
      ]
    };
  };

  // Save page function
  const handleSave = async () => {
    if (!user?.id || !pageId || !pageData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing user ID, page ID or page data",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Update pageData with latest sections
      const updatedPageData: BusinessPageData = {
        ...pageData,
        sections: sections,
        pageSetup: {
          ...pageData.pageSetup,
          businessName: pageSettings.title,
          description: pageSettings.description,
        },
        theme: {
          ...pageData.theme,
          backgroundColor: pageSettings.backgroundColor,
          textColor: pageSettings.textColor,
          fontStyle: pageSettings.fontFamily,
        },
        chatbot: {
          ...pageData.chatbot,
          embedCode: pageSettings.tmwChatbotCode,
        },
        contactInfo: {
          ...pageData.contactInfo,
          email: pageSettings.contactInfo.email,
          phone: pageSettings.contactInfo.phone,
          whatsapp: pageSettings.contactInfo.whatsapp,
          googleMaps: pageSettings.googleMapsUrl,
        }
      };
      
      // Generate a slug if needed
      const generatedSlug = pageSlug || generateSlugFromName(pageSettings.title);
      
      // Update the page record
      const { error } = await supabase
        .from('business_pages_data')
        .update({
          page_slug: generatedSlug,
          page_data: updatedPageData as unknown as Json,
        })
        .eq('id', pageId);
        
      if (error) {
        console.error("Error updating business page:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update business page: " + error.message,
        });
        setIsSaving(false);
        return;
      }
      
      // Update local state
      setPageData(updatedPageData);
      setPageSlug(generatedSlug);
      setPageSettings({
        ...pageSettings,
        slug: generatedSlug,
      });
      
      toast({
        title: "Business page saved",
        description: "Your business page has been saved successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      
      setIsSaving(false);
    } catch (error) {
      console.error("Exception while saving page:", error);
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save business page",
      });
    }
  };

  // Publish page function
  const handlePublish = async () => {
    if (!user?.id || !pageId || !pageData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing user ID, page ID or page data",
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      // Update pageData with publishing state
      const updatedPageData: BusinessPageData = {
        ...pageData,
        published: true,
      };
      
      // Update the page record
      const { error } = await supabase
        .from('business_pages_data')
        .update({
          page_data: updatedPageData as unknown as Json,
        })
        .eq('id', pageId);
        
      if (error) {
        console.error("Error publishing business page:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to publish business page: " + error.message,
        });
        setIsPublishing(false);
        return;
      }
      
      // Update local state
      setPageData(updatedPageData);
      setPageSettings({
        ...pageSettings,
        isPublished: true,
      });
      
      toast({
        title: "Business page published",
        description: "Your business page has been published successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['businessPageData'] });
      
      setIsPublishing(false);
    } catch (error) {
      console.error("Exception while publishing page:", error);
      setIsPublishing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish business page",
      });
    }
  };

  // Toggle between edit and preview mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Section manipulation functions
  const addSection = (type: string) => {
    const newSection: SectionType = {
      id: uuidv4(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: {},
      activeLayout: "default",
    };
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
  };

  const updateSection = (index: number, section: SectionType) => {
    const newSections = [...sections];
    newSections[index] = section;
    setSections(newSections);
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
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
      setSections(newSections);
      setActiveSectionIndex(index - 1);
    }
  };

  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
      setSections(newSections);
      setActiveSectionIndex(index + 1);
    }
  };

  // Check if any required section is at least visible
  const isHeaderVisible = pageData?.pageSetup?.visible ?? false;

  if (isLoading) {
    return <SimpleLoading />;
  }

  // Render preview mode
  if (!isEditMode) {
    return (
      <div className="flex flex-col h-screen">
        <TopBar
          pageUrl={pageSlug}
          onPreview={toggleEditMode}
          onPublish={handlePublish}
          onSave={handleSave}
          isEditMode={isEditMode}
          setEditMode={setIsEditMode}
          pageSettings={pageSettings}
          isSaving={isSaving}
          isPublishing={isPublishing}
        />
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          {pageData && <SimplePagePreview pageData={pageData} />}
        </div>
      </div>
    );
  }

  // Render edit mode
  return (
    <div className="flex flex-col h-screen">
      <TopBar
        pageUrl={pageSlug}
        onPreview={toggleEditMode}
        onPublish={handlePublish}
        onSave={handleSave}
        isEditMode={isEditMode}
        setEditMode={setIsEditMode}
        pageSettings={pageSettings}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="py-8">
            {!isHeaderVisible && (
              <div className="max-w-2xl mx-auto bg-amber-50 p-4 rounded-md border border-amber-200 mb-6">
                <p className="text-amber-800">
                  Your business header is currently hidden. Consider making it visible for better user experience.
                </p>
              </div>
            )}
            <PagePreview
              sections={sections}
              activeSectionIndex={activeSectionIndex}
              setActiveSectionIndex={setActiveSectionIndex}
              addSection={addSection}
              pageSettings={pageSettings}
            />
          </div>
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

export default Builder;

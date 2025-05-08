
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { useBusinessPage } from "@/hooks/business-page";

interface GalleryImage {
  url: string;
  caption?: string;
}

const SimpleLandingPageBuilder: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const { toast } = useToast();
  const [pageId, setPageId] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [pageSections, setPageSections] = useState<any[]>([]);
  const [pageSettings, setPageSettings] = useState<any>({
    page_title: "",
    page_slug: "",
    description: "",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    is_published: false
  });

  // Get user session and business ID
  useEffect(() => {
    const fetchUserAndBusinessId = async () => {
      setLoading(true);
      try {
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast({
            title: "Error",
            description: "You must be logged in to access this page",
            variant: "destructive",
          });
          return;
        }

        const userId = session.user.id;
        setBusinessId(userId); // For business accounts, the user ID is the business ID

        // Check if a business page already exists
        const { data: existingPage, error: pageError } = await supabase
          .from("business_pages")
          .select("*")
          .eq("business_id", userId)
          .single();

        if (pageError && pageError.code !== "PGRST116") {
          console.error("Error fetching business page:", pageError);
          toast({
            title: "Error",
            description: "Failed to load business page",
            variant: "destructive",
          });
        }

        if (existingPage) {
          // Page exists, load settings and sections
          setPageId(existingPage.id);
          setPageSettings(existingPage);
          
          // Fetch page sections
          const { data: sections, error: sectionsError } = await supabase
            .from("business_page_sections")
            .select("*")
            .eq("page_id", existingPage.id)
            .order("section_order", { ascending: true });

          if (sectionsError) {
            console.error("Error fetching page sections:", sectionsError);
            toast({
              title: "Error",
              description: "Failed to load page sections",
              variant: "destructive",
            });
          } else {
            setPageSections(sections || []);
          }
        } else {
          // No page exists, create a new one
          await createNewBusinessPage(userId);
        }
      } catch (error) {
        console.error("Error in initial setup:", error);
        toast({
          title: "Error",
          description: "Failed to initialize business page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBusinessId();
  }, []);

  const createNewBusinessPage = async (businessId: string) => {
    try {
      // Create new page
      const { data: newPage, error: pageError } = await supabase
        .from("business_pages")
        .insert({
          business_id: businessId,
          page_title: "My Business Page",
          page_slug: `business-${Date.now().toString(36)}`,
          description: "Welcome to my business page",
          primary_color: "#3B82F6",
          secondary_color: "#10B981",
          is_published: false,
        })
        .select()
        .single();

      if (pageError) {
        throw pageError;
      }

      setPageId(newPage.id);
      setPageSettings(newPage);

      // Create default sections
      const defaultSections = [
        {
          page_id: newPage.id,
          section_type: "header",
          section_order: 0,
          section_content: JSON.stringify({
            title: "My Business",
            subtitle: "Welcome to our page",
            show_logo: true,
          }),
          is_visible: true,
        },
        {
          page_id: newPage.id,
          section_type: "about",
          section_order: 1,
          section_content: JSON.stringify({
            title: "About Us",
            content: "We are a business dedicated to providing excellent service."
          }),
          is_visible: true,
        },
        {
          page_id: newPage.id,
          section_type: "contact",
          section_order: 2,
          section_content: JSON.stringify({
            title: "Contact Us",
            email: "",
            phone: "",
            address: "",
          }),
          is_visible: true,
        },
        {
          page_id: newPage.id,
          section_type: "gallery",
          section_order: 3,
          section_content: JSON.stringify({
            title: "Gallery",
            images: []
          }),
          is_visible: true,
        }
      ];

      const { error: sectionsError } = await supabase
        .from("business_page_sections")
        .insert(defaultSections);

      if (sectionsError) {
        throw sectionsError;
      }

      // Fetch the created sections
      const { data: sections } = await supabase
        .from("business_page_sections")
        .select("*")
        .eq("page_id", newPage.id)
        .order("section_order", { ascending: true });

      setPageSections(sections || []);

    } catch (error) {
      console.error("Error creating business page:", error);
      toast({
        title: "Error",
        description: "Failed to create business page",
        variant: "destructive",
      });
    }
  };

  const handleSettingsChange = (field: string, value: any) => {
    setPageSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setPageSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: field === "section_content" ? JSON.stringify(value) : value } 
          : section
      )
    );
  };

  const saveChanges = async () => {
    if (!pageId || !businessId) return;
    
    setSaving(true);
    try {
      // Save page settings
      const { error: settingsError } = await supabase
        .from("business_pages")
        .update(pageSettings)
        .eq("id", pageId);

      if (settingsError) throw settingsError;

      // Save each section
      for (const section of pageSections) {
        const { error: sectionError } = await supabase
          .from("business_page_sections")
          .update(section)
          .eq("id", section.id);

        if (sectionError) throw sectionError;
      }

      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Page Builder</h1>
        <Button 
          onClick={saveChanges} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6">
          {/* Sections Editor */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Page Sections</h2>
            {pageSections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium capitalize mb-2">{section.section_type} Section</h3>
                <textarea
                  className="w-full h-32 p-2 border rounded"
                  value={section.section_content}
                  onChange={(e) => handleSectionChange(section.id, "section_content", e.target.value)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          {/* Preview tab will show a live preview of the page */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Page Preview</h2>
            <iframe 
              src={`/business/${pageSettings.page_slug}/preview`}
              className="w-full h-[600px] border rounded"
              title="Page Preview"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          {/* Settings form */}
          <div>
            <label className="block text-sm font-medium mb-1">Page Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={pageSettings.page_title}
              onChange={(e) => handleSettingsChange("page_title", e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Page Slug</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={pageSettings.page_slug}
              onChange={(e) => handleSettingsChange("page_slug", e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded h-24"
              value={pageSettings.description}
              onChange={(e) => handleSettingsChange("description", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input
                type="color"
                className="w-full h-10"
                value={pageSettings.primary_color}
                onChange={(e) => handleSettingsChange("primary_color", e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <input
                type="color"
                className="w-full h-10"
                value={pageSettings.secondary_color}
                onChange={(e) => handleSettingsChange("secondary_color", e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={pageSettings.is_published}
              onChange={(e) => handleSettingsChange("is_published", e.target.checked)}
              id="is-published"
            />
            <label htmlFor="is-published">Publish Page</label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleLandingPageBuilder;

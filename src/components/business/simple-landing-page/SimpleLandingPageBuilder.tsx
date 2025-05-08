
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleLandingPageView from "./SimpleLandingPageView";
import { Loader2, Upload } from "lucide-react";

interface GalleryImage {
  url: string;
  id: string;
}

interface BusinessPage {
  id: string;
  business_id: string;
  page_title: string;
  page_slug: string;
  description?: string;
  logo_url?: string;
  is_published: boolean;
}

const SimpleLandingPageBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { uploadingLogo, handleLogoUpload } = useLogoUpload();
  
  // Business info state
  const [businessName, setBusinessName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  
  // Contact info state
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState<string>("");
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  
  // Page state
  const [pageId, setPageId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  
  // Load user profile and page data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast({
            title: "Not authenticated",
            description: "Please log in to edit your business page",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        setUserId(session.user.id);
        
        // Get business page
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('*')
          .eq('business_id', session.user.id)
          .single();
        
        if (pageError && pageError.code !== 'PGRST116') { // Not found is ok
          toast({
            title: "Error loading page data",
            description: pageError.message,
            variant: "destructive",
          });
        }
        
        if (pageData) {
          // Page exists
          setPageId(pageData.id);
          setBusinessName(pageData.page_title || "");
          setDescription(pageData.description || "");
          setLogoUrl(pageData.logo_url || "");
          setPageData(pageData);
          
          // Load section data
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('business_page_sections')
            .select('*')
            .eq('page_id', pageData.id)
            .order('section_order', { ascending: true });
          
          if (sectionsError) {
            console.error("Error loading sections", sectionsError);
          } else if (sectionsData) {
            // Process sections
            const contactSection = sectionsData.find(s => s.section_type === 'contact');
            const gallerySection = sectionsData.find(s => s.section_type === 'gallery');
            
            if (contactSection && contactSection.section_content) {
              try {
                const contactContent = typeof contactSection.section_content === 'string' 
                  ? JSON.parse(contactSection.section_content)
                  : contactSection.section_content;
                  
                setGoogleMapsUrl(contactContent.googleMapsUrl || "");
                setWhatsappNumber(contactContent.whatsappNumber || "");
                setInstagramUrl(contactContent.instagramUrl || "");
              } catch (e) {
                console.error("Error parsing contact section", e);
              }
            }
            
            if (gallerySection && gallerySection.section_content) {
              try {
                const galleryContent = typeof gallerySection.section_content === 'string'
                  ? JSON.parse(gallerySection.section_content)
                  : gallerySection.section_content;
                  
                if (galleryContent && Array.isArray(galleryContent.images)) {
                  setGalleryImages(galleryContent.images);
                }
              } catch (e) {
                console.error("Error parsing gallery section", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load page data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);
  
  // Handle logo upload success
  const handleLogoUploadSuccess = (url: string) => {
    setLogoUrl(url);
  };
  
  // Handle gallery image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userId) return;
    
    const file = e.target.files[0];
    setUploadingImage(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/gallery/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);
      
      // Add to gallery
      const newImage = {
        url: publicUrl,
        id: Math.random().toString(36).substring(2, 10)
      };
      
      setGalleryImages([...galleryImages, newImage]);
      toast({
        title: "Image uploaded",
        description: "Gallery image has been added successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Remove gallery image
  const removeImage = (id: string) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };
  
  // Save the page data
  const savePage = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      // Create or update the page
      let pageId = pageData?.id;
      
      if (!pageId) {
        // Create new page
        const slug = businessName.toLowerCase().replace(/\s+/g, '-');
        
        const { data: newPage, error: pageError } = await supabase
          .from('business_pages')
          .insert([
            {
              business_id: userId,
              page_title: businessName,
              page_slug: slug,
              description: description,
              logo_url: logoUrl,
              is_published: true
            }
          ])
          .select()
          .single();
        
        if (pageError) throw pageError;
        pageId = newPage.id;
        setPageId(newPage.id);
      } else {
        // Update existing page
        const { error: updateError } = await supabase
          .from('business_pages')
          .update({
            page_title: businessName,
            description: description,
            logo_url: logoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', pageId);
        
        if (updateError) throw updateError;
      }
      
      // Update contact section
      const contactContent = {
        googleMapsUrl,
        whatsappNumber,
        instagramUrl
      };
      
      // Check if contact section exists
      const { data: contactSection, error: contactError } = await supabase
        .from('business_page_sections')
        .select()
        .eq('page_id', pageId)
        .eq('section_type', 'contact')
        .single();
      
      if (contactError && contactError.code !== 'PGRST116') throw contactError;
      
      if (contactSection) {
        // Update existing contact section
        await supabase
          .from('business_page_sections')
          .update({
            section_content: contactContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', contactSection.id);
      } else {
        // Create new contact section
        await supabase
          .from('business_page_sections')
          .insert([
            {
              page_id: pageId,
              section_type: 'contact',
              section_order: 2,
              section_content: contactContent,
              is_visible: true
            }
          ]);
      }
      
      // Update gallery section
      const galleryContent = {
        images: galleryImages
      };
      
      // Check if gallery section exists
      const { data: gallerySection, error: galleryError } = await supabase
        .from('business_page_sections')
        .select()
        .eq('page_id', pageId)
        .eq('section_type', 'gallery')
        .single();
      
      if (galleryError && galleryError.code !== 'PGRST116') throw galleryError;
      
      if (gallerySection) {
        // Update existing gallery section
        await supabase
          .from('business_page_sections')
          .update({
            section_content: galleryContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', gallerySection.id);
      } else {
        // Create new gallery section
        await supabase
          .from('business_page_sections')
          .insert([
            {
              page_id: pageId,
              section_type: 'gallery',
              section_order: 3,
              section_content: galleryContent,
              is_visible: true
            }
          ]);
      }
      
      toast({
        title: "Success",
        description: "Your business page has been saved successfully",
      });
      
      // Reload data to make sure we have updated content
      const { data: updatedPage } = await supabase
        .from('business_pages')
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (updatedPage) {
        setPageData(updatedPage);
      }
      
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: "Failed to save page data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading your business page...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Page Builder</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit Page</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                
                <div className="mb-4">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    className="mt-1"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your business"
                    className="mt-1"
                    rows={4}
                  />
                </div>
                
                <div className="mb-4">
                  <Label>Business Logo</Label>
                  <div className="mt-2 flex items-center">
                    {logoUrl && (
                      <div className="relative mr-4">
                        <img src={logoUrl} alt="Logo" className="h-20 w-20 object-contain" />
                      </div>
                    )}
                    <div>
                      <Button variant="outline" disabled={uploadingLogo} asChild>
                        <label className="cursor-pointer">
                          {uploadingLogo ? "Uploading..." : "Upload Logo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleLogoUpload(e, handleLogoUploadSuccess)}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Info Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="mb-4">
                  <Label htmlFor="googleMaps">Google Maps URL</Label>
                  <Input 
                    id="googleMaps"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="mt-1"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input 
                    id="instagram"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/yourbusiness"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Gallery Section */}
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative aspect-square border rounded-md overflow-hidden">
                      <img src={image.url} alt="Gallery" className="w-full h-full object-cover" />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2" 
                        onClick={() => removeImage(image.id)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  {galleryImages.length < 6 && (
                    <div className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center p-4">
                      <Button variant="ghost" disabled={uploadingImage} asChild>
                        <label className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2" />
                          {uploadingImage ? "Uploading..." : "Add Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Upload up to 6 images to showcase your business</p>
              </CardContent>
            </Card>
            
            {/* Save Button */}
            <div className="md:col-span-2 flex justify-end">
              <Button 
                onClick={savePage} 
                disabled={saving || !businessName}
                className="px-8"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Page"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-0">
              {pageData ? (
                <div className="border rounded-md overflow-hidden">
                  <SimpleLandingPageView isPreview={true} />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p>Please save your page first to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleLandingPageBuilder;


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Instagram, Phone, MapPin } from "lucide-react";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { BookingTemplateCard } from "../page-builder/components/BookingTemplateCard";
import { generateGoogleMapsUrl } from "@/config/maps";

interface BusinessPageData {
  id?: string;
  business_id?: string;
  page_title: string;
  page_slug: string;
  description: string;
  logo_url?: string;
  is_published: boolean;
  whatsapp_url?: string;
  instagram_url?: string;
  location?: string;
}

const SimpleLandingPageBuilder = () => {
  // Get business ID (for production, get from auth context)
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [pageData, setPageData] = useState<BusinessPageData>({
    page_title: "",
    page_slug: "",
    description: "",
    is_published: false,
    whatsapp_url: "",
    instagram_url: "",
    location: ""
  });
  const [galleryImages, setGalleryImages] = useState<Array<{url: string, alt: string}>>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Logo upload hook
  const { uploadingLogo, handleLogoUpload } = useLogoUpload(businessId, (logoUrl) => {
    setPageData(prev => ({ ...prev, logo_url: logoUrl }));
  });
  
  // Get booking templates
  const { templates, isLoading: loadingTemplates } = useBookingTemplates(businessId || "");
  
  // Load business ID and page data
  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, business_id')
          .eq('id', user.id)
          .single();
          
        if (profile?.business_id) {
          setBusinessId(profile.business_id);
          
          // Fetch business page data
          const { data: pageData } = await supabase
            .from('business_pages')
            .select('*')
            .eq('business_id', profile.business_id)
            .maybeSingle();
            
          if (pageData) {
            setPageData(pageData);
            
            // Fetch gallery images
            const { data: galleryData } = await supabase
              .from('business_page_sections')
              .select('section_content')
              .eq('page_id', pageData.id)
              .eq('section_type', 'gallery')
              .maybeSingle();
              
            if (galleryData?.section_content?.images) {
              setGalleryImages(galleryData.section_content.images);
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching business data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business data"
        });
        setIsLoading(false);
      }
    };
    
    fetchBusinessId();
  }, []);
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };
  
  // Handle gallery image upload
  const handleImageUpload = async () => {
    if (!newImageFile || !businessId) return;
    
    try {
      setUploadingImage(true);
      
      // Create a unique file name
      const fileExt = newImageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${businessId}/gallery/${fileName}`;
      
      // Upload image
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('business-assets')
        .upload(filePath, newImageFile);
        
      if (uploadError) throw uploadError;
      
      // Get the URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);
        
      // Add to gallery
      const newImage = { url: publicUrl, alt: newImageFile.name.split('.')[0] };
      const updatedGallery = [...galleryImages, newImage];
      setGalleryImages(updatedGallery);
      
      // Save gallery to database if page exists
      if (pageData.id) {
        const { data: existingSection } = await supabase
          .from('business_page_sections')
          .select('id')
          .eq('page_id', pageData.id)
          .eq('section_type', 'gallery')
          .maybeSingle();
          
        if (existingSection) {
          await supabase
            .from('business_page_sections')
            .update({ 
              section_content: { 
                title: "Gallery", 
                images: updatedGallery 
              } 
            })
            .eq('id', existingSection.id);
        } else {
          await supabase
            .from('business_page_sections')
            .insert({
              page_id: pageData.id,
              section_type: 'gallery',
              section_order: 2,
              is_visible: true,
              section_content: { 
                title: "Gallery", 
                images: updatedGallery 
              }
            });
        }
      }
      
      setNewImageFile(null);
      toast({
        title: "Image uploaded",
        description: "Gallery image has been added"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not upload the image"
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };
  
  // Handle removing an image
  const handleRemoveImage = async (index: number) => {
    const updatedGallery = [...galleryImages];
    updatedGallery.splice(index, 1);
    setGalleryImages(updatedGallery);
    
    // Update database if page exists
    if (pageData.id) {
      const { data: existingSection } = await supabase
        .from('business_page_sections')
        .select('id')
        .eq('page_id', pageData.id)
        .eq('section_type', 'gallery')
        .maybeSingle();
        
      if (existingSection) {
        await supabase
          .from('business_page_sections')
          .update({ 
            section_content: { 
              title: "Gallery", 
              images: updatedGallery 
            } 
          })
          .eq('id', existingSection.id);
      }
    }
  };
  
  // Save page data
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!pageData.page_title || !pageData.page_slug) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Business name and URL slug are required"
        });
        setIsSaving(false);
        return;
      }
      
      let pageId = pageData.id;
      
      if (pageId) {
        // Update existing page
        const { error } = await supabase
          .from('business_pages')
          .update({
            page_title: pageData.page_title,
            page_slug: pageData.page_slug,
            description: pageData.description,
            logo_url: pageData.logo_url,
            whatsapp_url: pageData.whatsapp_url,
            instagram_url: pageData.instagram_url,
            location: pageData.location
          })
          .eq('id', pageId);
          
        if (error) throw error;
      } else if (businessId) {
        // Create new page
        const { data: newPage, error } = await supabase
          .from('business_pages')
          .insert({
            business_id: businessId,
            page_title: pageData.page_title,
            page_slug: pageData.page_slug,
            description: pageData.description,
            logo_url: pageData.logo_url,
            whatsapp_url: pageData.whatsapp_url,
            instagram_url: pageData.instagram_url,
            location: pageData.location,
            is_published: false
          })
          .select()
          .single();
          
        if (error) throw error;
        
        pageId = newPage.id;
        setPageData(prev => ({ ...prev, id: newPage.id }));
        
        // Create default sections
        await supabase
          .from('business_page_sections')
          .insert([
            {
              page_id: pageId,
              section_type: 'header',
              section_order: 0,
              is_visible: true,
              section_content: {
                title: pageData.page_title,
                subtitle: "",
                logo_url: pageData.logo_url
              }
            },
            {
              page_id: pageId,
              section_type: 'about',
              section_order: 1,
              is_visible: true,
              section_content: {
                title: "About Us",
                description: pageData.description
              }
            },
            {
              page_id: pageId,
              section_type: 'gallery',
              section_order: 2,
              is_visible: true,
              section_content: {
                title: "Gallery",
                images: galleryImages
              }
            },
            {
              page_id: pageId,
              section_type: 'contact',
              section_order: 3,
              is_visible: true,
              section_content: {
                title: "Contact Us",
                whatsapp: pageData.whatsapp_url,
                instagram: pageData.instagram_url,
                location: pageData.location
              }
            },
            {
              page_id: pageId,
              section_type: 'booking',
              section_order: 4,
              is_visible: true,
              section_content: {
                title: "Our Services",
                subtitle: "Book your appointment today"
              }
            }
          ]);
      }
      
      toast({
        title: "Changes saved",
        description: "Your landing page has been updated"
      });
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save your changes"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Publish page
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      if (!pageData.id) {
        await handleSave();
      }
      
      await supabase
        .from('business_pages')
        .update({ is_published: true })
        .eq('id', pageData.id);
        
      setPageData(prev => ({ ...prev, is_published: true }));
      
      toast({
        title: "Page published",
        description: "Your landing page is now live"
      });
    } catch (error) {
      console.error("Error publishing page:", error);
      toast({
        variant: "destructive",
        title: "Publishing failed",
        description: "Could not publish your landing page"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Get live URL
  const getLiveUrl = () => {
    return pageData.is_published && pageData.page_slug
      ? `https://wakti.app/${pageData.page_slug}`
      : null;
  };
  
  // Preview page
  const handlePreview = () => {
    const previewUrl = pageData.page_slug
      ? `/${pageData.page_slug}/preview`
      : null;
      
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Preview unavailable",
        description: "Please set a URL slug first"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading business page...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Editor Panel */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Business Landing Page</h1>
            
            <div className="flex space-x-2">
              {pageData.is_published && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const url = getLiveUrl();
                    if (url) {
                      window.open(url, '_blank');
                    }
                  }}
                >
                  View Live
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={handlePreview}
              >
                Preview
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : "Save"}
              </Button>
              
              <Button
                onClick={handlePublish}
                disabled={isPublishing || isSaving}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : pageData.is_published ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="info">Business Info</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="contact">Contact & Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6 mt-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="page_title">
                      Business Name
                    </label>
                    <Input
                      id="page_title"
                      name="page_title"
                      placeholder="Your Business Name"
                      value={pageData.page_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="page_slug">
                      URL Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        wakti.app/
                      </span>
                      <Input
                        id="page_slug"
                        name="page_slug"
                        placeholder="your-business"
                        value={pageData.page_slug}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="description">
                      Business Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell people about your business..."
                      value={pageData.description}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3" htmlFor="logo">
                      Business Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {pageData.logo_url ? (
                        <img 
                          src={pageData.logo_url} 
                          alt="Business Logo" 
                          className="h-24 w-24 object-contain bg-gray-100 border rounded-lg"
                        />
                      ) : (
                        <div className="h-24 w-24 flex items-center justify-center bg-gray-100 border rounded-lg">
                          No logo
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <label className="cursor-pointer">
                          <div className="flex items-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                            <Upload size={16} />
                            <span>{pageData.logo_url ? "Change Logo" : "Upload Logo"}</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                        
                        {uploadingLogo && (
                          <p className="text-sm text-muted-foreground mt-2 flex items-center">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-6 mt-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Image Gallery</h2>
                
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-6">
                    No images yet. Add some to showcase your business.
                  </p>
                )}
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3">Add New Image</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={uploadingImage}
                    />
                    <Button
                      onClick={handleImageUpload}
                      disabled={!newImageFile || uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-6 mt-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Contact & Social Media</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1" htmlFor="whatsapp_url">
                      <Phone size={16} />
                      WhatsApp Number
                    </label>
                    <Input
                      id="whatsapp_url"
                      name="whatsapp_url"
                      placeholder="+1234567890"
                      value={pageData.whatsapp_url}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your full phone number with country code
                    </p>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1" htmlFor="instagram_url">
                      <Instagram size={16} />
                      Instagram Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        instagram.com/
                      </span>
                      <Input
                        id="instagram_url"
                        name="instagram_url"
                        placeholder="yourusername"
                        value={pageData.instagram_url}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1" htmlFor="location">
                      <MapPin size={16} />
                      Business Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="123 Main St, City, Country"
                      value={pageData.location}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your full address to create a Google Maps link
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Preview Panel */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b p-4">
              <h2 className="font-medium">Page Preview</h2>
            </div>
            
            <div className="p-4 space-y-8 max-h-[800px] overflow-y-auto">
              {/* Header Preview */}
              <div className="text-center p-6">
                {pageData.logo_url && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={pageData.logo_url} 
                      alt="Business Logo" 
                      className="h-24 object-contain"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold">{pageData.page_title || "Your Business Name"}</h1>
              </div>
              
              {/* About Section Preview */}
              {pageData.description && (
                <div className="py-4">
                  <h2 className="text-2xl font-bold mb-4 text-center">About Us</h2>
                  <p className="text-gray-700">{pageData.description}</p>
                </div>
              )}
              
              {/* Gallery Preview */}
              {galleryImages.length > 0 && (
                <div className="py-4">
                  <h2 className="text-2xl font-bold mb-4 text-center">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.slice(0, 6).map((image, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Contact Preview */}
              <div className="py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {pageData.whatsapp_url && (
                    <a
                      href={`https://wa.me/${pageData.whatsapp_url.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Phone size={20} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  
                  {pageData.instagram_url && (
                    <a
                      href={`https://instagram.com/${pageData.instagram_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Instagram size={20} />
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {pageData.location && (
                    <a
                      href={generateGoogleMapsUrl(pageData.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <MapPin size={20} />
                      <span>Map</span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Booking Templates Preview */}
              <div className="py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Our Services</h2>
                
                {loadingTemplates ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : templates && templates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map(template => (
                      <Card key={template.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <BookingTemplateCard template={template} preview={true} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-muted-foreground">
                      No booking templates available yet. Add them in the Bookings tab.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLandingPageBuilder;

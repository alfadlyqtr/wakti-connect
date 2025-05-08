
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Phone, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SimpleLandingPageViewProps {
  isPreview?: boolean;
  slug?: string;
}

interface BusinessPage {
  id: string;
  business_id: string;
  page_title: string;
  page_slug: string;
  description?: string;
  logo_url?: string;
}

interface PageSection {
  id: string;
  section_type: string;
  section_content: any;
}

interface GalleryImage {
  url: string;
  id: string;
}

interface BookingTemplate {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}

const SimpleLandingPageView: React.FC<SimpleLandingPageViewProps> = ({ 
  isPreview = false,
  slug: propSlug
}) => {
  const params = useParams();
  const slug = propSlug || params.slug;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [pageData, setPageData] = useState<BusinessPage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [bookingTemplates, setBookingTemplates] = useState<BookingTemplate[]>([]);
  
  const [contactInfo, setContactInfo] = useState({
    googleMapsUrl: "",
    whatsappNumber: "",
    instagramUrl: ""
  });
  
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        
        let businessId: string | null = null;
        let pageId: string | null = null;
        
        // If preview mode, get current user's page
        if (isPreview) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session?.user) {
            console.error("No authenticated user for preview");
            setLoading(false);
            return;
          }
          
          businessId = session.user.id;
          
          // Get the business page
          const { data: pageData, error: pageError } = await supabase
            .from("business_pages")
            .select("*")
            .eq("business_id", businessId)
            .single();
          
          if (pageError) {
            console.error("Error loading preview page:", pageError);
            setLoading(false);
            return;
          }
          
          setPageData(pageData);
          pageId = pageData.id;
        } else {
          // Public view mode - get page by slug
          if (!slug) {
            console.error("No slug provided for public view");
            setLoading(false);
            return;
          }
          
          // Get page by slug
          const { data: pageData, error: pageError } = await supabase
            .from("business_pages")
            .select("*")
            .eq("page_slug", slug)
            .eq("is_published", true)
            .single();
          
          if (pageError) {
            console.error("Error loading page by slug:", pageError);
            setLoading(false);
            return;
          }
          
          setPageData(pageData);
          businessId = pageData.business_id;
          pageId = pageData.id;
        }
        
        if (pageId) {
          // Load page sections
          const { data: sectionsData, error: sectionsError } = await supabase
            .from("business_page_sections")
            .select("*")
            .eq("page_id", pageId)
            .order("section_order", { ascending: true });
          
          if (sectionsError) {
            console.error("Error loading page sections:", sectionsError);
          } else {
            setSections(sectionsData);
            
            // Process contact section
            const contactSection = sectionsData.find(s => s.section_type === "contact");
            if (contactSection && contactSection.section_content) {
              try {
                const contactContent = typeof contactSection.section_content === "string"
                  ? JSON.parse(contactSection.section_content)
                  : contactSection.section_content;
                
                setContactInfo({
                  googleMapsUrl: contactContent.googleMapsUrl || "",
                  whatsappNumber: contactContent.whatsappNumber || "",
                  instagramUrl: contactContent.instagramUrl || ""
                });
              } catch (e) {
                console.error("Error parsing contact section:", e);
              }
            }
            
            // Process gallery section
            const gallerySection = sectionsData.find(s => s.section_type === "gallery");
            if (gallerySection && gallerySection.section_content) {
              try {
                const galleryContent = typeof gallerySection.section_content === "string"
                  ? JSON.parse(gallerySection.section_content)
                  : gallerySection.section_content;
                
                if (galleryContent && Array.isArray(galleryContent.images)) {
                  setGalleryImages(galleryContent.images);
                }
              } catch (e) {
                console.error("Error parsing gallery section:", e);
              }
            }
          }
        }
        
        if (businessId) {
          // Load booking templates
          const { data: templatesData, error: templatesError } = await supabase
            .from("booking_templates")
            .select("*")
            .eq("business_id", businessId)
            .eq("is_published", true)
            .order("name");
          
          if (templatesError) {
            console.error("Error loading booking templates:", templatesError);
          } else {
            setBookingTemplates(templatesData);
          }
        }
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPageData();
  }, [isPreview, slug]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p>The business page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  // Format WhatsApp link
  const whatsappLink = contactInfo.whatsappNumber
    ? `https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex items-center">
          {pageData.logo_url && (
            <img 
              src={pageData.logo_url} 
              alt={pageData.page_title} 
              className="h-16 w-16 object-contain mr-4" 
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{pageData.page_title}</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* About Section */}
        {pageData.description && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">About Us</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="whitespace-pre-line">{pageData.description}</p>
            </div>
          </section>
        )}
        
        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div 
                  key={image.id} 
                  className="aspect-square rounded-lg overflow-hidden shadow-sm"
                >
                  <img 
                    src={image.url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Booking Templates Section */}
        {bookingTemplates.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookingTemplates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Duration: {template.duration} min
                        </p>
                        {template.price && (
                          <p className="font-medium">${template.price.toFixed(2)}</p>
                        )}
                      </div>
                      <Button>Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Contact Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-6">
              {contactInfo.whatsappNumber && (
                <a 
                  href={whatsappLink || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600"
                >
                  <Phone className="h-5 w-5" />
                  <span>{contactInfo.whatsappNumber}</span>
                </a>
              )}
              
              {contactInfo.googleMapsUrl && (
                <a 
                  href={contactInfo.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-red-600"
                >
                  <MapPin className="h-5 w-5" />
                  <span>View on Google Maps</span>
                </a>
              )}
              
              {contactInfo.instagramUrl && (
                <a 
                  href={contactInfo.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-purple-600"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Follow us on Instagram</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {pageData.page_title}</p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLandingPageView;

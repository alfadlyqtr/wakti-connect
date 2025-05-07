
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Phone, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { generateGoogleMapsUrl } from "@/config/maps";
import { BookingModalContent } from "../landing/booking";

interface SimpleLandingPageProps {
  isPreview?: boolean;
}

const SimpleLandingPageView: React.FC<SimpleLandingPageProps> = ({ isPreview = false }) => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { templates, isLoading: loadingTemplates } = useBookingTemplates(businessId || "");
  
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('business_pages').select('*');
        
        // If preview mode, get the page by slug without checking published status
        if (isPreview) {
          query = query.eq('page_slug', slug);
        } else {
          // In public view, only show published pages
          query = query.eq('page_slug', slug).eq('is_published', true);
        }
        
        const { data: page, error: pageError } = await query.maybeSingle();
        
        if (pageError) throw pageError;
        
        if (!page) {
          setError("Page not found");
          setIsLoading(false);
          return;
        }
        
        setPageData(page);
        setBusinessId(page.business_id);
        
        // Fetch page sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('business_page_sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_visible', true)
          .order('section_order');
          
        if (sectionsError) throw sectionsError;
        
        setSections(sectionsData || []);
        
      } catch (error) {
        console.error("Error fetching page data:", error);
        setError("Could not load the page");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPageData();
    } else {
      setError("Invalid page URL");
      setIsLoading(false);
    }
  }, [slug, isPreview]);
  
  // Get relevant section content by type
  const getSectionContent = (sectionType: string) => {
    const section = sections.find(s => s.section_type === sectionType);
    return section?.section_content || {};
  };
  
  // Get gallery images
  const getGalleryImages = () => {
    const gallerySection = sections.find(s => s.section_type === 'gallery');
    return gallerySection?.section_content?.images || [];
  };
  
  // Get contact links
  const getContactInfo = () => {
    const contactSection = sections.find(s => s.section_type === 'contact');
    if (contactSection?.section_content) {
      return {
        whatsapp: contactSection.section_content.whatsapp,
        instagram: contactSection.section_content.instagram,
        location: contactSection.section_content.location
      };
    }
    return {};
  };
  
  const contactInfo = getContactInfo();
  const galleryImages = getGalleryImages();
  
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (!pageData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or is not published.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar with preview indicator */}
      {isPreview && (
        <div className="bg-amber-100 text-amber-800 text-center py-2 px-4">
          Preview Mode - This is how your page will look when published
        </div>
      )}
      
      {/* Header */}
      <header className="text-center py-8 px-4">
        {pageData.logo_url && (
          <div className="flex justify-center mb-4">
            <img 
              src={pageData.logo_url} 
              alt={`${pageData.page_title} Logo`} 
              className="h-32 object-contain"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold">{pageData.page_title}</h1>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 space-y-12 pb-12">
          {/* About Section */}
          {pageData.description && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-center">
                {getSectionContent('about').title || "About Us"}
              </h2>
              <div className="prose max-w-none">
                <p>{pageData.description}</p>
              </div>
            </section>
          )}
          
          {/* Gallery Section */}
          {galleryImages.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {getSectionContent('gallery').title || "Gallery"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image: any, index: number) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Booking Templates */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {getSectionContent('booking').title || "Our Services"}
            </h2>
            {loadingTemplates ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : templates && templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template: BookingTemplateWithRelations) => (
                  <div 
                    key={template.id} 
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setShowBookingModal(true);
                    }}
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      {template.description && (
                        <p className="text-gray-600 mb-4">{template.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {template.duration} minutes
                        </div>
                        {template.price !== null && (
                          <div className="font-semibold">${template.price}</div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 border-t">
                      <Button className="w-full" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No services available for booking.</p>
              </div>
            )}
          </section>
          
          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {getSectionContent('contact').title || "Contact Us"}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Phone size={20} />
                  <span>WhatsApp</span>
                </a>
              )}
              
              {contactInfo.instagram && (
                <a
                  href={`https://instagram.com/${contactInfo.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              )}
              
              {contactInfo.location && (
                <a
                  href={generateGoogleMapsUrl(contactInfo.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MapPin size={20} />
                  <span>Find Us</span>
                </a>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-6 bg-gray-100">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {pageData.page_title}</p>
          <p className="mt-1">Powered by WAKTI</p>
        </div>
      </footer>
      
      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTemplate && (
            <BookingModalContent 
              template={selectedTemplate} 
              businessId={businessId || ""}
              onClose={() => setShowBookingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleLandingPageView;

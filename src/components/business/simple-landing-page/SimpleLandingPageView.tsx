
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface SimpleLandingPageViewProps {
  isPreview?: boolean;
}

interface BusinessPage {
  id: string;
  business_id: string;
  page_title: string;
  page_slug: string;
  description?: string;
  logo_url?: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
}

interface SectionContent {
  contact?: {
    instagram_url?: string;
    whatsapp_url?: string;
    google_maps_url?: string;
  };
  gallery?: {
    images: GalleryImage[];
  };
}

const SimpleLandingPageView: React.FC<SimpleLandingPageViewProps> = ({ isPreview = false }) => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [pageData, setPageData] = useState<BusinessPage | null>(null);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [bookingTemplates, setBookingTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        
        // First get the page data
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('*')
          .eq('page_slug', slug)
          .single();
          
        if (pageError) {
          console.error("Error fetching business page:", pageError);
          setLoading(false);
          return;
        }
        
        setPageData(pageData);
        
        // Get section data
        const { data: sections, error: sectionsError } = await supabase
          .from('business_page_sections')
          .select('*')
          .eq('page_id', pageData.id)
          .order('section_order', { ascending: true });
          
        if (sectionsError) {
          console.error("Error fetching page sections:", sectionsError);
          setLoading(false);
          return;
        }
        
        const contentData: SectionContent = {};
        
        // Process contact section
        const contactSection = sections?.find(s => s.section_type === 'contact');
        if (contactSection && contactSection.section_content) {
          const content = typeof contactSection.section_content === 'string'
            ? JSON.parse(contactSection.section_content)
            : contactSection.section_content;
            
          contentData.contact = content;
        }
        
        // Process gallery section
        const gallerySection = sections?.find(s => s.section_type === 'gallery');
        if (gallerySection && gallerySection.section_content) {
          const content = typeof gallerySection.section_content === 'string'
            ? JSON.parse(gallerySection.section_content)
            : gallerySection.section_content;
            
          if (content.images) {
            contentData.gallery = {
              images: content.images
            };
          }
        }
        
        setSectionContent(contentData);
        
        // Get booking templates if available
        if (pageData.business_id) {
          const { data: templates, error: templatesError } = await supabase
            .from('booking_templates')
            .select('*')
            .eq('business_id', pageData.business_id)
            .eq('is_published', true);
            
          if (templatesError) {
            console.error("Error fetching booking templates:", templatesError);
          } else if (templates) {
            setBookingTemplates(templates);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching landing page data:", error);
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Page Not Found</h2>
          <p className="text-gray-600">The business page you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageData.page_title || "Business Landing Page"}</title>
        <meta name="description" content={pageData.description || "Business landing page"} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex items-center">
            {pageData.logo_url && (
              <div className="mr-4">
                <img 
                  src={pageData.logo_url} 
                  alt={`${pageData.page_title} logo`}
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pageData.page_title}</h1>
              {isPreview && (
                <div className="mt-1 bg-amber-100 text-amber-800 text-sm px-2 py-0.5 rounded-sm inline-block">
                  Preview Mode
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          {/* About Section */}
          {pageData.description && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">About Us</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-700 whitespace-pre-line">{pageData.description}</p>
              </div>
            </section>
          )}
          
          {/* Gallery Section */}
          {sectionContent.gallery?.images && sectionContent.gallery.images.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionContent.gallery.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden shadow">
                    <img 
                      src={image.url} 
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Booking Templates */}
          {bookingTemplates.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookingTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-2">{template.name}</h3>
                      {template.description && (
                        <p className="text-gray-600 mb-4">{template.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          {template.duration && (
                            <span className="text-sm text-gray-500">
                              {template.duration} min
                            </span>
                          )}
                          {template.price && (
                            <span className="ml-2 font-medium">
                              ${template.price}
                            </span>
                          )}
                        </div>
                        <a 
                          href={`/booking/${pageData.business_id}/${template.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Contact Section */}
          {sectionContent.contact && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Us</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  {sectionContent.contact.whatsapp_url && (
                    <a 
                      href={sectionContent.contact.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg"
                    >
                      <span className="bg-green-100 p-3 rounded-full mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </span>
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  )}
                  
                  {sectionContent.contact.instagram_url && (
                    <a 
                      href={sectionContent.contact.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg"
                    >
                      <span className="bg-pink-100 p-3 rounded-full mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </span>
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}
                  
                  {sectionContent.contact.google_maps_url && (
                    <a 
                      href={sectionContent.contact.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg"
                    >
                      <span className="bg-red-100 p-3 rounded-full mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                        </svg>
                      </span>
                      <span className="font-medium">Location</span>
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">&copy; {new Date().getFullYear()} {pageData.page_title}</p>
            <p className="text-gray-400 text-sm">
              Created with Simple Business Page Builder
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SimpleLandingPageView;

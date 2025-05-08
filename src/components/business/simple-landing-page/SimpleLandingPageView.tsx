
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useBusinessPage } from "@/hooks/business-page";

interface SimpleLandingPageViewProps {
  isPreview?: boolean;
}

const SimpleLandingPageView: React.FC<SimpleLandingPageViewProps> = ({ isPreview = false }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // Get the current user session for preview mode
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (isPreview && !userId) {
          toast({
            title: "Error",
            description: "You must be logged in to preview your page",
            variant: "destructive",
          });
          return;
        }
        
        // In preview mode, get the user's business page
        // In normal mode, get the page by slug from URL params
        const { data: pageData, error: pageError } = isPreview 
          ? await supabase
              .from("business_pages")
              .select("*")
              .eq("business_id", userId)
              .single()
          : await supabase
              .from("business_pages")
              .select("*")
              .eq("page_slug", window.location.pathname.split('/').pop())
              .eq("is_published", true)
              .single();

        if (pageError) {
          console.error("Error fetching business page:", pageError);
          toast({
            title: "Error",
            description: "Failed to load business page",
            variant: "destructive",
          });
          return;
        }

        setPage(pageData);
        
        // Fetch page sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("business_page_sections")
          .select("*")
          .eq("page_id", pageData.id)
          .eq("is_visible", true)
          .order("section_order", { ascending: true });

        if (sectionsError) {
          console.error("Error fetching page sections:", sectionsError);
          toast({
            title: "Error",
            description: "Failed to load page sections",
            variant: "destructive",
          });
          return;
        }

        setSections(sectionsData || []);
      } catch (error) {
        console.error("Error loading business page:", error);
        toast({
          title: "Error",
          description: "Failed to load business page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [isPreview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[500px]">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground">The business page you're looking for doesn't exist or isn't published.</p>
      </div>
    );
  }

  // Apply theme colors
  const themeStyle = {
    "--primary-color": page.primary_color || "#3B82F6",
    "--secondary-color": page.secondary_color || "#10B981",
  } as React.CSSProperties;

  return (
    <div style={themeStyle} className="min-h-screen">
      {/* Header */}
      <header 
        className="bg-[var(--primary-color)] text-white py-6 px-4"
        style={{ 
          backgroundImage: page.banner_url ? `url(${page.banner_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center">
            {page.logo_url && (
              <img src={page.logo_url} alt="Logo" className="w-12 h-12 rounded-full mr-4 object-cover" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{page.page_title}</h1>
              {page.description && <p className="text-sm opacity-90">{page.description}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-4">
        {sections.map((section) => {
          // Parse the section content
          let content;
          try {
            content = typeof section.section_content === 'string' 
              ? JSON.parse(section.section_content) 
              : section.section_content;
          } catch (e) {
            console.error("Error parsing section content:", e);
            content = {};
          }

          return (
            <section 
              key={section.id} 
              className="my-8 p-4 rounded-lg" 
              style={{
                backgroundColor: section.background_color,
                color: section.text_color
              }}
            >
              <h2 className="text-xl font-bold mb-4">{content.title}</h2>
              
              {/* Render different section types */}
              {section.section_type === "about" && (
                <div className="prose max-w-none">
                  <p>{content.content}</p>
                </div>
              )}
              
              {section.section_type === "contact" && (
                <div className="space-y-4">
                  {content.email && (
                    <div>
                      <strong>Email:</strong> {content.email}
                    </div>
                  )}
                  {content.phone && (
                    <div>
                      <strong>Phone:</strong> {content.phone}
                    </div>
                  )}
                  {content.address && (
                    <div>
                      <strong>Address:</strong> {content.address}
                    </div>
                  )}
                </div>
              )}
              
              {section.section_type === "gallery" && content.images && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.images.map((image: any, idx: number) => (
                    <div key={idx} className="rounded overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.caption || `Gallery image ${idx + 1}`} 
                        className="w-full h-48 object-cover"
                      />
                      {image.caption && (
                        <div className="p-2 text-sm">{image.caption}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 px-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} {page.page_title}</p>
          {isPreview && (
            <div className="mt-2 text-sm bg-yellow-600 text-white p-2 rounded inline-block">
              Preview Mode
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default SimpleLandingPageView;

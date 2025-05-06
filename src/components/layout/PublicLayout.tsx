
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PublicLayout = () => {
  const location = useLocation();
  const [isBusinessPage, setIsBusinessPage] = useState(false);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const potentialSlug = pathParts.length === 1 ? pathParts[0] : '';
  
  // Check if this is a business page by checking the URL pattern
  useEffect(() => {
    // Clear detection on each route change
    setIsBusinessPage(false);
    
    // Skip detection for known app routes
    const knownRoutes = ['auth', 'dashboard', 'booking', 'business', 'contact', 'about', 'pricing', 'features', 'faq', 'terms', 'privacy', 'e', 'i'];
    
    if (potentialSlug && !knownRoutes.includes(potentialSlug)) {
      // This might be a business slug, check against the database
      const checkSlug = async () => {
        const { data } = await supabase
          .from('business_pages')
          .select('id')
          .eq('page_slug', potentialSlug)
          .eq('is_published', true)
          .maybeSingle();
          
        if (data) {
          console.log("Detected business page:", potentialSlug);
          setIsBusinessPage(true);
        }
      };
      
      checkSlug();
    } else if (location.pathname.startsWith('/business/')) {
      // Legacy URL format - always a business page
      setIsBusinessPage(true);
    }
  }, [location.pathname, potentialSlug]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Only render the Header on non-business pages */}
      {!isBusinessPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Only render the Footer on non-business pages */}
      {!isBusinessPage && <Footer />}
    </div>
  );
};

export default PublicLayout;


import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const PublicLayout = () => {
  const location = useLocation();
  
  // Check if the current path is a business landing page
  const isBusinessPage = location.pathname.startsWith('/business/');
  console.log("PublicLayout rendering for path:", location.pathname);
  
  // Load Google Translate script dynamically
  useEffect(() => {
    // Check if we should load the script (only on public pages)
    if (document.getElementById('google-translate-script')) return;
    
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    // Define the callback function that Google Translate will use
    window.googleTranslateElementInit = function() {
      // This function will be called by Google's script
      // The actual translation will be handled by the LanguageSwitcher component
    };
    
    document.body.appendChild(script);
    
    // Clean up function
    return () => {
      const scriptElement = document.getElementById('google-translate-script');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);
  
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

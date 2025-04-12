
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const PublicLayout = () => {
  const location = useLocation();
  
  // Check if the current path is a business landing page
  const isBusinessPage = location.pathname.startsWith('/business/');
  console.log("PublicLayout rendering for path:", location.pathname);
  
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

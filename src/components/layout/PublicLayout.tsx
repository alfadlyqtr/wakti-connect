
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const PublicLayout = () => {
  const location = useLocation();
  
  // Check if the current route is a business page (starts with /b/)
  const isBusinessPage = location.pathname.startsWith('/b/');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isBusinessPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isBusinessPage && <Footer />}
    </div>
  );
};

export default PublicLayout;

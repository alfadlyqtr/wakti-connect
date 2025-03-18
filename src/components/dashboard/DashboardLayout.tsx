
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Close sidebar on mobile by default
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'text-right' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main 
          className={`flex-1 transition-all duration-200 overflow-y-auto p-4 md:p-6 ${
            isSidebarOpen ? (
              isRtl ? "mr-[280px] lg:mr-[280px]" : "ml-[280px] lg:ml-[280px]"
            ) : "mr-0 ml-0"
          }`}
        >
          <div className="pb-10">
            {children}
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default DashboardLayout;

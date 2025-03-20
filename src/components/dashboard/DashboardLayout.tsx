
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useIsMobile } from "@/hooks/useResponsive";
import SidebarManager from "./SidebarManager";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <SidebarManager 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} userRole="free" />
          
          <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-safe-area-inset-bottom ${mainContentClass}`}>
            <div className="container mx-auto animate-in">
              {children}
            </div>
          </main>
        </div>
      </SidebarManager>
    </div>
  );
};

export default DashboardLayout;

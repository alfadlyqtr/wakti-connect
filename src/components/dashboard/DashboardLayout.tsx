
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useIsMobile } from "@/hooks/useResponsive";
import SidebarManager from "./SidebarManager";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Get user role from localStorage if not provided via props
  const storedUserRole = localStorage.getItem('userRole') as "free" | "individual" | "business" | null;
  const userRoleValue = propUserRole || storedUserRole || "free";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "" 
    : `pl-${isSidebarOpen ? "64" : "20"}`;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <SidebarManager 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
      >
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue} />
          
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

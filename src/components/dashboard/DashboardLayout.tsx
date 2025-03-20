
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useIsMobile } from "@/hooks/useResponsive";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileLoader from "./ProfileLoader";
import SidebarManager from "./SidebarManager";
import { useAuthListener } from "./useAuthListener";
import { useThemeSetter } from "./useThemeSetter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { profileData, isLoading } = useProfileData();
  
  // Setup auth listener
  useAuthListener();
  
  // Set theme based on user preference
  useThemeSetter(profileData);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the correct user role
  const userRoleValue = profileData?.account_type || propUserRole || "free";

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
          <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue as "free" | "individual" | "business"} />
          
          <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-safe-area-inset-bottom ${mainContentClass}`}>
            <div className="container mx-auto animate-in">
              {isLoading ? <ProfileLoader /> : children}
            </div>
          </main>
        </div>
      </SidebarManager>
    </div>
  );
};

export default DashboardLayout;

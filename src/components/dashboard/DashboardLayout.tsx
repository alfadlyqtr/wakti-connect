
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useDashboardProfile } from "@/hooks/useDashboardProfile";
import ProfileLoadError from "./error/ProfileLoadError";
import DashboardFallback from "./fallback/DashboardFallback";
import DashboardSpinner from "./ui/DashboardSpinner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [hasLoadingTimeout, setHasLoadingTimeout] = useState(false);
  
  // Get profile data using our custom hook
  const { profileData, profileLoading, profileError } = useDashboardProfile();

  // Set a timeout to prevent infinite loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasLoadingTimeout(true);
    }, 7000); // 7 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const navbarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(event.target as Node) && 
            navbarToggle && 
            !navbarToggle.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the correct user role with a fallback mechanism
  const userRoleValue = profileData?.account_type || 
                        propUserRole || 
                        localStorage.getItem('userRole') as "free" | "individual" | "business" || 
                        "free";

  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  // Show error UI if profile loading error
  if (profileError) {
    console.error("Dashboard profile loading error:", profileError);
    return <ProfileLoadError />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRoleValue as "free" | "individual" | "business"} />
        
        <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-12 ${mainContentClass}`}>
          <div className="container mx-auto animate-in">
            {profileLoading && !hasLoadingTimeout ? (
              <DashboardSpinner />
            ) : (
              <ErrorBoundary fallback={<DashboardFallback />}>
                {children}
              </ErrorBoundary>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

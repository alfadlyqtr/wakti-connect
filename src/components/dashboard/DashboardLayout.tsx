
import React, { useCallback, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import DashboardContent from "./DashboardContent";
import { Outlet, useLocation } from "react-router-dom";
import { UserRole, getEffectiveRole } from "@/types/user";
import CommandSearch from "@/components/search/CommandSearch";
import FreeAccountBanner from "./FreeAccountBanner";
import { useRoleBasedRedirect } from "@/hooks/useRoleBasedRedirect";
import { mapRoleForCompatibility, shouldShowUpgradeBanner } from "./utils/dashboardUtils";
import LanguageChangeListener from "./LanguageChangeListener";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: UserRole;
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  // Get sidebar toggle state and mobile detection
  const { isSidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebarToggle();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  
  // Fetch user profile data
  const { 
    profileData, 
    profileLoading, 
    userId, 
    isStaff, 
    userRole: detectedUserRole 
  } = useDashboardUserProfile();

  // Use provided role or detected role
  const accountType = profileData?.account_type || propUserRole || detectedUserRole || "free";
  
  // Check if user is super admin from localStorage first
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
  
  // Get effective user role with proper prioritization
  const userRoleValue: UserRole = isSuperAdmin 
    ? 'super-admin' 
    : getEffectiveRole(accountType as any, isStaff);

  // Determine if the banner should be shown (only for free individual accounts)
  const showUpgradeBanner = shouldShowUpgradeBanner(accountType, isStaff, userRoleValue);

  // Handle sidebar collapse state
  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Command search open function to pass to both Navbar and Sidebar
  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // Handle language change
  const handleLanguageChange = useCallback(() => {
    // Force re-render of components
    setSidebarCollapsed(prev => {
      setTimeout(() => setSidebarCollapsed(prev), 0);
      return !prev;
    });
  }, []);

  // Use our custom hook for role-based redirects
  useRoleBasedRedirect({
    profileLoading,
    userRoleValue,
    isStaff,
    isSuperAdmin
  });

  // For components that don't recognize super-admin yet, map it to business role
  const displayRole = mapRoleForCompatibility(userRoleValue);

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${isSidebarOpen && isMobile ? 'sidebar-open-body' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Language change listener component */}
      <LanguageChangeListener onLanguageChange={handleLanguageChange} />
      
      {/* Free Account Banner - Only shown for free individual accounts */}
      {showUpgradeBanner && <FreeAccountBanner />}
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Backdrop overlay - only visible on mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          userRole={displayRole}
          onCollapseChange={handleCollapseChange}
          closeSidebar={closeSidebar}
          openCommandSearch={openCommandSearch}
          showUpgradeButton={showUpgradeBanner}
        />
        
        <DashboardContent
          isLoading={profileLoading}
          isStaff={isStaff}
          userId={userId}
          isMobile={isMobile}
          currentPath={location.pathname}
          userRole={displayRole}
          sidebarCollapsed={sidebarCollapsed}
        >
          {/* Render the outlet for nested routes instead of children */}
          <Outlet />
        </DashboardContent>
      </div>

      {/* Global command search dialog */}
      <CommandSearch 
        open={commandSearchOpen} 
        setOpen={setCommandSearchOpen}
        userRole={displayRole}
      />
    </div>
  );
};

export default DashboardLayout;

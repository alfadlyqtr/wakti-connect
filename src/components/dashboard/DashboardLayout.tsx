
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import DashboardContent from "./DashboardContent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserRole, getEffectiveRole } from "@/types/user";
import CommandSearch from "@/components/search/CommandSearch";
import FreeAccountBanner from "./FreeAccountBanner";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: UserRole;
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  // Get sidebar toggle state and mobile detection
  const { isSidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebarToggle();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [lastRedirectTime, setLastRedirectTime] = useState(0);
  
  // Fetch user profile data
  const { 
    profileData, 
    profileLoading, 
    userId, 
    isStaff, 
    userRole: detectedUserRole,
    isSuperAdmin
  } = useDashboardUserProfile();

  // Use provided role or detected role
  const accountType = profileData?.account_type || propUserRole || detectedUserRole || "individual";
  
  // Get effective user role with proper prioritization
  const userRoleValue: UserRole = getEffectiveRole(
    accountType as any, 
    isStaff,
    isSuperAdmin
  );

  // Determine if the banner should be shown (only for accounts with limited features)
  // Only show the banner once loading is fully complete and we have a resolved non-loading account type
  const showUpgradeBanner = (
    !profileLoading &&
    !isStaff &&
    userRoleValue === 'individual'
  );

  // Handle sidebar collapse state
  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Command search open function to pass to both Navbar and Sidebar
  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // For components that don't recognize super-admin yet, map it to business role
  const mapRoleForCompatibility = (role: UserRole): "individual" | "business" | "staff" => {
    if (role === 'super-admin') return 'business';
    return role as "individual" | "business" | "staff";
  };

  // Get display role that's compatible with components expecting the old type
  const displayRole = mapRoleForCompatibility(userRoleValue);

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${isSidebarOpen && isMobile ? 'sidebar-open-body' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Free Account Banner - Only shown for accounts that need to upgrade */}
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

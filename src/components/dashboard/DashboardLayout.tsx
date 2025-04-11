
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import DashboardContent from "./DashboardContent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserRole, getEffectiveRole } from "@/types/user";
import CommandSearch from "@/components/search/CommandSearch";

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

  // Handle sidebar collapse state
  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Command search open function to pass to both Navbar and Sidebar
  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // Redirect to appropriate dashboard based on role if on main dashboard
  useEffect(() => {
    // Fix: Check for both "/dashboard" and "/dashboard/" paths
    const isMainDashboardPath = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    const isAnalyticsPath = location.pathname === "/dashboard/analytics";
    
    console.log("DashboardLayout user role check:", {
      userRoleValue,
      accountType: profileData?.account_type,
      isStaff,
      isMainDashboardPath,
      isSuperAdmin
    });
    
    if (!profileLoading && isMainDashboardPath) {
      // Prevent redirect floods by limiting frequency and number of attempts
      const now = Date.now();
      if (redirectAttempts > 5 || (now - lastRedirectTime < 2000 && redirectAttempts > 0)) {
        console.warn("Too many redirect attempts, stopping to prevent a loop");
        return;
      }
      
      // Super admin should be redirected to their special dashboard
      if (userRoleValue === 'super-admin' || isSuperAdmin) {
        console.log("Super admin detected, redirecting to super admin dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/gohabsgo', { replace: true });
        return;
      }
      
      // Only staff users (who are not also business owners) go to staff dashboard
      if (userRoleValue === 'staff') {
        console.log("Staff user detected, redirecting to staff dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/dashboard/staff-dashboard', { replace: true });
      } else {
        // All users (including business) go to the main dashboard
        // We're already on the main dashboard path, so no redirect needed
        console.log(`${userRoleValue} account detected, already on main dashboard`);
      }
    }
    
    // If business user is on analytics page but should be redirected to main dashboard
    if (!profileLoading && isAnalyticsPath && userRoleValue === 'business' && location.state?.fromInitialRedirect) {
      navigate('/dashboard');
    }
  }, [profileLoading, location.pathname, userRoleValue, isStaff, navigate, location.state, profileData?.account_type, accountType, isSuperAdmin, redirectAttempts, lastRedirectTime]);

  // For components that don't recognize super-admin yet, map it to business role
  const mapRoleForCompatibility = (role: UserRole): "free" | "individual" | "business" | "staff" => {
    if (role === 'super-admin') return 'business';
    return role as "free" | "individual" | "business" | "staff";
  };

  // Get display role that's compatible with components expecting the old type
  const displayRole = mapRoleForCompatibility(userRoleValue);

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${isSidebarOpen && isMobile ? 'sidebar-open-body' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
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

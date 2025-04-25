
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import DashboardContent from "./DashboardContent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommandSearch from "@/components/search/CommandSearch";
import FreeAccountBanner from "./FreeAccountBanner";
import { useAuth } from "@/features/auth";
import { UserRole } from "@/types/roles";
import { slugifyBusinessName } from "@/utils/authUtils";

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
  
  // Get auth data from unified auth system
  const { 
    user,
    userId,
    userRole, 
    isStaff, 
    isSuperAdmin,
    isAuthenticated,
    isLoading,
    theme_preference,
    business_name
  } = useAuth();
  
  // Use the profile data from the authenticated user
  const profileData = user ? {
    account_type: user.account_type || 'individual',
    display_name: user.displayName || null,
    business_name: business_name || null,
    full_name: user.full_name || null,
    theme_preference: theme_preference || 'light'
  } : null;

  // Use provided role or detected role
  const accountType = profileData?.account_type || propUserRole || userRole || "individual";
  
  // Determine if the banner should be shown (only for individual users)
  const showUpgradeBanner = (
    !isLoading &&
    !isStaff &&
    userRole === 'individual'
  );

  // Handle sidebar collapse state
  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Command search open function to pass to both Navbar and Sidebar
  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  // Redirect to appropriate dashboard based on role if on main dashboard
  useEffect(() => {
    // Fix: Check for both "/dashboard" and "/dashboard/" paths
    const isMainDashboardPath = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    const isAnalyticsPath = location.pathname === "/dashboard/analytics";
    
    if (!isLoading && isMainDashboardPath && isAuthenticated) {
      // Prevent redirect floods by limiting frequency and number of attempts
      const now = Date.now();
      if (redirectAttempts > 5 || (now - lastRedirectTime < 2000 && redirectAttempts > 0)) {
        console.warn("Too many redirect attempts, stopping to prevent a loop");
        return;
      }
      
      // Only super admins should be redirected to their special dashboard
      if (userRole === 'superadmin' && isSuperAdmin) {
        console.log("Super admin detected, redirecting to super admin dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/gohabsgo', { replace: true });
        return;
      }
      
      // Only staff users (who are not also business owners) go to staff dashboard
      if (userRole === 'staff') {
        console.log("Staff user detected, redirecting to staff dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/dashboard/staff-dashboard', { replace: true });
      } else {
        // All users (including business) go to the main dashboard
        // We're already on the main dashboard path, so no redirect needed
        console.log(`${userRole} account detected, already on main dashboard`);
      }
    }
    
    // If business user is on analytics page but should be redirected to main dashboard
    if (!isLoading && isAnalyticsPath && userRole === 'business' && location.state?.fromInitialRedirect) {
      navigate('/dashboard');
    }
  }, [isLoading, location.pathname, userRole, isStaff, navigate, location.state, profileData?.account_type, accountType, isSuperAdmin, redirectAttempts, lastRedirectTime, isAuthenticated]);

  // For components that don't recognize super-admin yet, map it to business role
  const mapRoleForCompatibility = (role: UserRole): "individual" | "business" | "staff" => {
    if (role === 'superadmin') return 'business';
    return role as "individual" | "business" | "staff";
  };

  // Get display role that's compatible with components expecting the old type
  const displayRole = mapRoleForCompatibility(userRole as UserRole);

  // Calculate business slug if applicable
  const businessSlug = profileData?.business_name 
    ? slugifyBusinessName(profileData.business_name) 
    : undefined;

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
          isLoading={isLoading}
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

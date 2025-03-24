
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "@/components/layout/sidebar/sidebar.css";
import { useDashboardUserProfile } from "@/hooks/useDashboardUserProfile";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import DashboardContent from "./DashboardContent";
import { useLocation, useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole: propUserRole }: DashboardLayoutProps) => {
  // Get sidebar toggle state and mobile detection
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebarToggle();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch user profile data
  const { 
    profileData, 
    profileLoading, 
    userId, 
    isStaff, 
    userRole: detectedUserRole 
  } = useDashboardUserProfile();

  // Use provided role or detected role
  // Fix: Make sure userRoleValue is strictly typed as one of the allowed types
  const userRoleValue = isStaff 
    ? 'staff' as const
    : ((propUserRole || detectedUserRole || "free") as "free" | "individual" | "business" | "staff");

  // Redirect to appropriate dashboard based on role if on main dashboard
  useEffect(() => {
    if (!profileLoading && location.pathname === "/dashboard") {
      if (isStaff) {
        // Staff users go to staff dashboard
        navigate('/dashboard/staff-dashboard');
      } else if (userRoleValue === 'business') {
        // Business users go to analytics dashboard
        navigate('/dashboard/analytics');
        console.log("Business account detected, redirecting to analytics dashboard");
      } else if (userRoleValue === 'individual') {
        // Individual users go to tasks dashboard
        navigate('/dashboard/tasks');
        console.log("Individual account detected, redirecting to tasks dashboard");
      } else if (userRoleValue === 'free') {
        // Free users go to tasks with limited functionality
        navigate('/dashboard/tasks');
        console.log("Free account detected, redirecting to tasks dashboard");
      }
    }
  }, [profileLoading, location.pathname, userRoleValue, isStaff, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          userRole={userRoleValue} 
        />
        
        <DashboardContent
          isLoading={profileLoading}
          isStaff={isStaff}
          userId={userId}
          isMobile={isMobile}
          currentPath={location.pathname}
          userRole={userRoleValue}
        >
          {children}
        </DashboardContent>
      </div>
    </div>
  );
};

export default DashboardLayout;

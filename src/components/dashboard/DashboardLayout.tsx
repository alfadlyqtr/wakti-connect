
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
  const userRoleValue = isStaff 
    ? 'staff' 
    : (propUserRole || detectedUserRole || "free");

  // Redirect to appropriate dashboard based on role if on main dashboard
  useEffect(() => {
    if (!profileLoading && location.pathname === "/dashboard") {
      if (isStaff) {
        navigate('/dashboard/staff-dashboard');
      } else if (userRoleValue === 'business') {
        // For business users, show them business-specific features
        console.log("Business account detected, showing business dashboard");
      }
    }
  }, [profileLoading, location.pathname, userRoleValue, isStaff, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          userRole={userRoleValue as "free" | "individual" | "business" | "staff"} 
        />
        
        <DashboardContent
          isLoading={profileLoading}
          isStaff={isStaff}
          userId={userId}
          isMobile={isMobile}
          currentPath={location.pathname}
        >
          {children}
        </DashboardContent>
      </div>
    </div>
  );
};

export default DashboardLayout;

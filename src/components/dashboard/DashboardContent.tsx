import React, { useEffect } from 'react';
import StaffDashboardHeader from './StaffDashboardHeader';
import DashboardLoading from './DashboardLoading';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';

interface DashboardContentProps {
  children: React.ReactNode;
  isLoading: boolean;
  isStaff: boolean;
  userId: string | null;
  isMobile: boolean;
  currentPath?: string;
  userRole?: UserRole;
  sidebarCollapsed?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  isLoading,
  isStaff,
  userId,
  isMobile,
  currentPath = '',
  userRole = 'free',
  sidebarCollapsed = true
}) => {
  const navigate = useNavigate();
  
  // Redirect users to their appropriate dashboards on login
  useEffect(() => {
    // Fix: Check for both "/dashboard" and "/dashboard/" paths
    const isMainDashboardPath = currentPath === '/dashboard' || currentPath === '/dashboard/';
    
    if (!isLoading && isMainDashboardPath && userId) {
      console.log("DashboardContent redirect - User role:", userRole, "Is staff:", isStaff);
      
      // Only redirect staff users who are not business owners
      if (isStaff && userRole === 'staff') {
        navigate('/dashboard/staff-dashboard');
      }
      // For business users we don't redirect them away from the main dashboard
      // For individual/free users, we keep them on the main dashboard too
    }
  }, [isStaff, isLoading, currentPath, userId, navigate, userRole]);
  
  // Calculate main content padding based on sidebar state and device
  const mainContentClass = isMobile 
    ? "pt-3 pb-16 px-3 transition-all duration-300" 
    : sidebarCollapsed 
      ? "lg:pl-[70px] pt-4 pb-12 px-4 transition-all duration-300" 
      : "lg:pl-52 pt-4 pb-12 px-4 transition-all duration-300";

  return (
    <main 
      className={`flex-1 overflow-y-auto ${mainContentClass}`}
      style={{
        background: "radial-gradient(circle at 10% 20%, rgba(0, 10, 30, 0.8) 0%, rgba(0, 10, 40, 0.95) 90%)",
        boxShadow: "inset 0 0 100px rgba(20, 50, 100, 0.15)",
        backgroundAttachment: "fixed"
      }}
    >
      <div 
        className="container mx-auto animate-in"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)",
          backgroundAttachment: "fixed"
        }}
      >
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <>
            {/* Only show staff header if user is staff AND not a business owner */}
            {isStaff && userId && userRole === 'staff' && (
              <div className="mb-5">
                <StaffDashboardHeader staffId={userId} />
              </div>
            )}
            {children}
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardContent;

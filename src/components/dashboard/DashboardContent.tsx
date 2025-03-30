
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
      
      // Only redirect staff who are NOT also business owners
      if (userRole === 'staff') {
        navigate('/dashboard/staff-dashboard');
      }
      // For business users we don't redirect them away from the main dashboard
      // For individual/free users, we keep them on the main dashboard too
    }
  }, [isStaff, isLoading, currentPath, userId, navigate, userRole]);
  
  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "pt-2 pb-16 transition-all duration-300" 
    : sidebarCollapsed 
      ? "lg:pl-[70px] pt-4 pb-12 transition-all duration-300" 
      : "lg:pl-52 pt-4 pb-12 transition-all duration-300";

  return (
    <main className={`flex-1 overflow-y-auto px-3 sm:px-4 ${mainContentClass}`}>
      <div className="container mx-auto animate-in">
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <>
            {/* Only show staff header if user is staff AND not a business owner */}
            {isStaff && userId && userRole === 'staff' && (
              <div className="mb-4">
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

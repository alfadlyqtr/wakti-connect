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
  
  useEffect(() => {
    const isMainDashboardPath = currentPath === '/dashboard' || currentPath === '/dashboard/';
    
    if (!isLoading && isMainDashboardPath && userId) {
      console.log("DashboardContent redirect - User role:", userRole, "Is staff:", isStaff);
      
      if (isStaff && userRole === 'staff') {
        navigate('/dashboard/staff-dashboard');
      }
    }
  }, [isStaff, isLoading, currentPath, userId, navigate, userRole]);
  
  const mainContentClass = isMobile 
    ? "pt-3 pb-16 px-3 transition-all duration-300" 
    : sidebarCollapsed 
      ? "lg:pl-[70px] pt-4 pb-12 px-4 transition-all duration-300" 
      : "lg:pl-52 pt-4 pb-12 px-4 transition-all duration-300";

  return (
    <main className={`flex-1 overflow-y-auto ${mainContentClass}`}>
      <div className="container mx-auto animate-in">
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <>
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

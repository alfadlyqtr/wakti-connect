
import React, { useEffect } from 'react';
import StaffDashboardHeader from './StaffDashboardHeader';
import DashboardLoading from './DashboardLoading';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import DashboardProfilePreview from './home/DashboardProfilePreview';
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

const getDashboardTypeHeading = (role: UserRole | undefined, isStaff: boolean): string => {
  if (role === 'business') return 'Business Dashboard';
  if (role === 'staff' || isStaff) return 'Staff Dashboard';
  if (role === 'super-admin') return 'Business Dashboard';
  return 'Individual Dashboard';
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  isLoading,
  isStaff,
  userId,
  isMobile,
  currentPath = '',
  userRole = 'individual',
  sidebarCollapsed = true
}) => {
  const navigate = useNavigate();
  const { data: profile } = useProfileSettings(); // For profile preview

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
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 mt-2 text-center">
              {getDashboardTypeHeading(userRole, isStaff)}
            </h1>

            <div className="max-w-md mx-auto mb-6">
              <DashboardProfilePreview />
            </div>

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

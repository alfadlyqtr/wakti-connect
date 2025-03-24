
import React, { useEffect } from 'react';
import StaffDashboardHeader from './StaffDashboardHeader';
import DashboardLoading from './DashboardLoading';
import { useNavigate } from 'react-router-dom';

interface DashboardContentProps {
  children: React.ReactNode;
  isLoading: boolean;
  isStaff: boolean;
  userId: string | null;
  isMobile: boolean;
  currentPath?: string;
  userRole?: "free" | "individual" | "business" | "staff";
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  isLoading,
  isStaff,
  userId,
  isMobile,
  currentPath = '',
  userRole = 'free'
}) => {
  const navigate = useNavigate();
  
  // Redirect users to their appropriate dashboards on login
  useEffect(() => {
    if (!isLoading && currentPath === '/dashboard' && userId) {
      if (isStaff) {
        navigate('/dashboard/staff-dashboard');
      } else if (userRole === 'business') {
        navigate('/dashboard/analytics');
      } else if (userRole === 'individual' || userRole === 'free') {
        navigate('/dashboard/tasks');
      }
    }
  }, [isStaff, isLoading, currentPath, userId, navigate, userRole]);
  
  // Calculate main content padding based on sidebar state
  const mainContentClass = isMobile 
    ? "transition-all duration-300" 
    : "lg:pl-[70px] transition-all duration-300";

  return (
    <main className={`flex-1 overflow-y-auto pt-4 px-4 pb-12 ${mainContentClass}`}>
      <div className="container mx-auto animate-in">
        {isLoading ? (
          <DashboardLoading />
        ) : (
          <>
            {isStaff && userId && (
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

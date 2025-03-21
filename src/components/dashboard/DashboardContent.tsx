
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
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  isLoading,
  isStaff,
  userId,
  isMobile,
  currentPath = ''
}) => {
  const navigate = useNavigate();
  
  // Redirect staff to staff dashboard on login, but only if they're on the main dashboard
  useEffect(() => {
    if (isStaff && !isLoading && currentPath === '/dashboard' && userId) {
      navigate('/dashboard/staff-dashboard');
    }
  }, [isStaff, isLoading, currentPath, userId, navigate]);
  
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


import React from 'react';
import DashboardLoading from './DashboardLoading';

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
  userId,
  isMobile,
  currentPath = ''
}) => {
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
            {children}
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardContent;

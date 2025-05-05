
import React, { useEffect } from 'react';
import StaffDashboardHeader from './StaffDashboardHeader';
import DashboardLoading from './DashboardLoading';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import DashboardProfilePreview from './home/DashboardProfilePreview';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';
import { useAuth } from '@/features/auth/context/AuthContext';

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
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("DashboardContent rendering:", { 
      isLoading, 
      isStaff, 
      userId, 
      userRole, 
      isAuthenticated,
      currentPath,
      user: user ? { 
        id: user.id, 
        email: user.email,
        role: user.role
      } : 'No user'
    });

    const isMainDashboardPath = currentPath === '/dashboard' || currentPath === '/dashboard/';
    
    if (!isLoading && isMainDashboardPath && userId) {
      console.log("DashboardContent redirect - User role:", userRole, "Is staff:", isStaff);
      
      if (isStaff && userRole === 'staff') {
        navigate('/dashboard/staff-dashboard');
      }
    }
  }, [isStaff, isLoading, currentPath, userId, navigate, userRole, isAuthenticated, user]);
  
  const mainContentClass = isMobile 
    ? "pt-3 pb-16 px-3 transition-all duration-300" 
    : sidebarCollapsed 
      ? "lg:pl-[70px] pt-4 pb-12 px-4 transition-all duration-300" 
      : "lg:pl-52 pt-4 pb-12 px-4 transition-all duration-300";

  // Show debugging message if there's no user but we're on the dashboard
  if (!isLoading && !userId && isAuthenticated === false) {
    return (
      <main className={`flex-1 overflow-y-auto ${mainContentClass}`}>
        <div className="container mx-auto animate-in">
          <div className="p-6 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <h2 className="text-xl font-bold mb-2 text-amber-800 dark:text-amber-300">Authentication Issue Detected</h2>
            <p className="text-amber-700 dark:text-amber-400 mb-4">
              You appear to be on the dashboard but aren't properly authenticated. This may be due to:
            </p>
            <ul className="list-disc pl-5 text-amber-600 dark:text-amber-400 space-y-1 mb-4">
              <li>Session expiration</li>
              <li>Authentication token issues</li>
              <li>Account access problems</li>
            </ul>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/auth/login')}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Go to Login
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

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

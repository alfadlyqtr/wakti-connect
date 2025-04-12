
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';

interface UseRoleBasedRedirectProps {
  profileLoading: boolean;
  userRoleValue: UserRole;
  isStaff: boolean;
  isSuperAdmin: boolean;
}

export function useRoleBasedRedirect({
  profileLoading,
  userRoleValue,
  isStaff,
  isSuperAdmin
}: UseRoleBasedRedirectProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [lastRedirectTime, setLastRedirectTime] = useState(0);

  useEffect(() => {
    // Fix: Check for both "/dashboard" and "/dashboard/" paths
    const isMainDashboardPath = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    const isAnalyticsPath = location.pathname === "/dashboard/analytics";
    
    console.log("DashboardLayout user role check:", {
      userRoleValue,
      isStaff,
      isMainDashboardPath,
      isSuperAdmin
    });
    
    if (!profileLoading && isMainDashboardPath) {
      // Prevent redirect floods by limiting frequency and number of attempts
      const now = Date.now();
      if (redirectAttempts > 5 || (now - lastRedirectTime < 2000 && redirectAttempts > 0)) {
        console.warn("Too many redirect attempts, stopping to prevent a loop");
        return;
      }
      
      // Super admin should be redirected to their special dashboard
      if (userRoleValue === 'super-admin' || isSuperAdmin) {
        console.log("Super admin detected, redirecting to super admin dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/gohabsgo', { replace: true });
        return;
      }
      
      // Only staff users (who are not also business owners) go to staff dashboard
      if (userRoleValue === 'staff') {
        console.log("Staff user detected, redirecting to staff dashboard");
        setRedirectAttempts(prev => prev + 1);
        setLastRedirectTime(now);
        navigate('/dashboard/staff-dashboard', { replace: true });
      } else {
        // All users (including business) go to the main dashboard
        // We're already on the main dashboard path, so no redirect needed
        console.log(`${userRoleValue} account detected, already on main dashboard`);
      }
    }
    
    // If business user is on analytics page but should be redirected to main dashboard
    if (!profileLoading && isAnalyticsPath && userRoleValue === 'business' && location.state?.fromInitialRedirect) {
      navigate('/dashboard');
    }
  }, [profileLoading, location.pathname, userRoleValue, isStaff, navigate, location.state, isSuperAdmin, redirectAttempts, lastRedirectTime]);
}

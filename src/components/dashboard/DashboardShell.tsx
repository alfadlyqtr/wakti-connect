
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthListener } from './useAuthListener';
import { useThemeSetter } from './useThemeSetter';
import ProfileLoader from './ProfileLoader';

/**
 * DashboardShell serves as the main wrapper for all dashboard pages
 * It handles authentication checks, profile data loading, and theme preferences
 */
const DashboardShell = () => {
  // Setup auth listener to monitor sign-in/sign-out events
  useAuthListener();
  
  // Fetch user profile data
  const { profileData, isLoading } = useProfileData();
  
  // Set theme based on user preference
  useThemeSetter(profileData);

  return (
    <DashboardLayout>
      {isLoading ? <ProfileLoader /> : <Outlet />}
    </DashboardLayout>
  );
};

export default DashboardShell;

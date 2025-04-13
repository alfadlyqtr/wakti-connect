
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './sidebar/MainSidebar';
import MainContainer from './MainContainer';
import Header from './Header';
import MobileNavBar from './navbar/MobileNavBar';
import { Toaster } from '@/components/ui/toaster';
import NotificationListener from '../notifications/NotificationListener';
import JobCardNotificationListener from '../job/JobCardNotificationListener';
import ProgressierInitializer from '../ProgressierInitializer';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Initialize Progressier notifications */}
      <ProgressierInitializer />
      
      {/* Listen for realtime notifications */}
      <NotificationListener />
      
      {/* Listen for job card notifications (business owners only) */}
      <JobCardNotificationListener />
      
      {/* Main sidebar (desktop only) */}
      <MainSidebar />
      
      {/* Main content area */}
      <MainContainer>
        <Header />
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24">
          <Outlet />
        </main>
      </MainContainer>
      
      {/* Mobile navigation bar */}
      <MobileNavBar />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;

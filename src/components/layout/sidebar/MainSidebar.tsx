
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';
import { UserRole } from '@/types/user';

const MainSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isSidebarOpen } = useSidebarToggle();
  
  // Check for saved sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  // Save state when it changes
  const handleCollapseChange = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', String(newCollapsed));
  };
  
  return (
    <div className="hidden lg:block">
      <Sidebar 
        userRole={localStorage.getItem('userRole') as UserRole || 'free'}
        collapsed={collapsed}
        onCollapseChange={handleCollapseChange}
        isOpen={isSidebarOpen}
      />
    </div>
  );
};

export default MainSidebar;

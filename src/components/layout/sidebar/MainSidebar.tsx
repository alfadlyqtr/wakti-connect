
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

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
  
  return (
    <div className="hidden lg:block">
      <Sidebar 
        userRole={localStorage.getItem('userRole') as any || 'free'}
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        isOpen={isSidebarOpen}
      />
    </div>
  );
};

export default MainSidebar;

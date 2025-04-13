
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const MainSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
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
      />
    </div>
  );
};

export default MainSidebar;

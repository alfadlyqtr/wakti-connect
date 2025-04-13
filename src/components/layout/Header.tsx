
import React from 'react';
import Navbar from './Navbar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

const Header: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();
  
  return (
    <div className="sticky top-0 z-40 w-full">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Header;

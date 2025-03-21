
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SidebarContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  collapsed: boolean;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ 
  children, 
  isOpen, 
  collapsed 
}) => {
  const location = useLocation();
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.add('sidebar-closed');
        sidebar.classList.remove('sidebar-open');
      }
    };
    
    handleRouteChange();
  }, [location.pathname]);

  return (
    <aside 
      id="sidebar"
      className={`fixed top-[70px] left-0 z-40 h-[calc(100vh-70px)] bg-card border-r shadow-sm pt-5 transition-all duration-300 lg:translate-x-0 ${
        isOpen ? 'sidebar-open' : 'sidebar-closed'
      } ${collapsed ? 'w-[70px]' : 'w-52'}`}
    >
      <div className="h-full flex flex-col relative">
        {children}
      </div>
    </aside>
  );
};

export default SidebarContainer;

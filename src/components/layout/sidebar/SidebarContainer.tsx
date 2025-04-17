
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  collapsed: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ 
  children, 
  isOpen, 
  collapsed,
  onCollapseChange
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && isMobile) {
        sidebar.classList.add('sidebar-closed');
        sidebar.classList.remove('sidebar-open');
      }
    };
    
    handleRouteChange();
  }, [location.pathname, isMobile]);

  // Call the onCollapseChange handler when collapsed state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  return (
    <aside 
      id="sidebar"
      className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] bg-card/95 backdrop-blur-sm border-r shadow-sm pt-5 transition-all duration-300 lg:translate-x-0 ${
        isOpen ? 'sidebar-open shadow-lg' : 'sidebar-closed'
      } ${collapsed && !isMobile ? 'w-[70px]' : 'w-52'}`}
    >
      <div className="h-full flex flex-col relative">
        {children}
      </div>
    </aside>
  );
};

export default SidebarContainer;

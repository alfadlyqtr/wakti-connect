
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

  // Call the onCollapseChange handler when collapsed state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  return (
    <aside
      id="sidebar"
      className={`
        fixed top-[70px] left-0 h-[calc(100vh-70px)] bg-card/95 backdrop-blur-sm border-r shadow-sm pt-5 transition-all duration-300
        lg:translate-x-0
        ${isOpen ? 'sidebar-open shadow-lg' : 'sidebar-closed'}
        ${collapsed ? 'w-[70px]' : 'w-52'}
        z-50
      `}
      style={{ position: "sticky", top: 0, height: "100vh" }}
    >
      <div className="h-full flex flex-col relative">
        {children}
      </div>
    </aside>
  );
};

export default SidebarContainer;

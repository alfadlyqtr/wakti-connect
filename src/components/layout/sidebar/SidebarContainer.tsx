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

  // Keep sidebar height fixed regardless of its content, remove growing/shrinking.
  // Also, we add min-h-screen for safety in edge cases.
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

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  return (
    <aside
      id="sidebar"
      className={`fixed top-[70px] left-0 min-h-[calc(100vh-70px)] h-[calc(100vh-70px)] bg-card/95 backdrop-blur-sm border-r shadow-sm pt-5 transition-all duration-300 lg:translate-x-0 z-50
        ${isOpen ? 'sidebar-open shadow-lg' : 'sidebar-closed'}
        ${collapsed ? 'w-[70px]' : 'w-52'}
      `}
      style={{ height: "calc(100vh - 70px)", minHeight: "calc(100vh - 70px)" }}
    >
      <div className="h-full flex flex-col relative">
        {children}
      </div>
    </aside>
  );
};

export default SidebarContainer;

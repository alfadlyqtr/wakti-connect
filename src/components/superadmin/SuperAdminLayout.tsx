
import React, { useState } from "react";
import { Shield, AlertTriangle, Activity, Bell, ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

interface SuperAdminLayoutProps {
  children?: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEmergencyPanelOpen, setIsEmergencyPanelOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleEmergencyPanel = () => {
    setIsEmergencyPanelOpen(!isEmergencyPanelOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#800020]">
      {/* Top bar - dark with red accents for super admin */}
      <header className="bg-[#0a0a0a] border-b border-red-900 py-2 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-4">
            <Shield className="h-5 w-5 text-red-500 mr-2" />
            <h1 className="text-white font-bold">WAKTI SUPER ADMIN</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-gray-400">
            <Activity className="h-4 w-4 text-green-500 mr-1" />
            <span>System: Online</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-gray-700" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 flex items-center gap-1 text-xs"
            onClick={toggleEmergencyPanel}
          >
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Emergency Controls</span>
          </Button>
          <Separator orientation="vertical" className="h-6 bg-gray-700" />
          <Button variant="ghost" size="icon" className="relative text-gray-400">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="text-sm text-gray-300">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <SuperAdminSidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
        />

        {/* Main content area - maroon background now */}
        <main className={cn(
          "flex-1 p-4 transition-all duration-300 ease-in-out text-white",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}>
          {/* Emergency panel */}
          {isEmergencyPanelOpen && (
            <div className="mb-4 p-4 border border-red-500 bg-red-950 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-red-400 font-semibold flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" /> Emergency Controls
                </h2>
                <Button variant="ghost" size="sm" onClick={toggleEmergencyPanel}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="destructive" size="sm" className="bg-red-800 hover:bg-red-700">
                  Shutdown
                </Button>
                <Button variant="destructive" size="sm" className="bg-red-800 hover:bg-red-700">
                  Maintenance Mode
                </Button>
                <Button variant="destructive" size="sm" className="bg-red-800 hover:bg-red-700">
                  Force Logout All
                </Button>
                <Button variant="destructive" size="sm" className="bg-red-800 hover:bg-red-700">
                  Emergency Broadcast
                </Button>
              </div>
            </div>
          )}
          
          {/* Content from child routes - render Outlet first, then children if provided */}
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

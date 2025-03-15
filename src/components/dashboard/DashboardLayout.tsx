
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "free" | "individual" | "business";
}

const DashboardLayout = ({ children, userRole = "free" }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} userRole={userRole} />
        
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-12 lg:pl-64 transition-all duration-300">
          <div className="container mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

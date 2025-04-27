
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, Calendar, Settings,
  Briefcase, CheckSquare, BookOpen, FileText, Bot
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-lg mb-1 transition-colors ${
      isActive 
        ? 'bg-wakti-blue-800/80 text-white font-medium' 
        : 'text-gray-300 hover:bg-wakti-blue-800/40 hover:text-white'
    }`}
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{label}</span>
  </Link>
);

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="h-screen w-64 bg-wakti-blue-900/95 text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo Area */}
      <div className="p-4">
        <Link to="/dashboard" className="flex items-center">
          <img src="/logo-light.svg" alt="WAKTI" className="h-8" />
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <SidebarLink 
          to="/dashboard" 
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={isActive('/dashboard')}
        />
        
        <SidebarLink 
          to="/tasks" 
          icon={CheckSquare}
          label="Tasks"
          isActive={isActive('/tasks')}
        />
        
        <SidebarLink 
          to="/staff" 
          icon={Users}
          label="Staff"
          isActive={isActive('/staff')}
        />
        
        <SidebarLink 
          to="/messages" 
          icon={MessageSquare}
          label="Messages"
          isActive={isActive('/messages')}
        />
        
        <SidebarLink 
          to="/contacts" 
          icon={BookOpen}
          label="Contacts"
          isActive={isActive('/contacts')}
        />
        
        <SidebarLink 
          to="/booking" 
          icon={Calendar}
          label="Booking"
          isActive={isActive('/booking')}
        />
        
        <SidebarLink 
          to="/services" 
          icon={Briefcase}
          label="Services"
          isActive={isActive('/services')}
        />
        
        <SidebarLink 
          to="/job-cards" 
          icon={FileText}
          label="Job Cards"
          isActive={isActive('/job-cards')}
        />
        
        <SidebarLink 
          to="/ai-assistant" 
          icon={Bot}
          label="AI Assistant"
          isActive={isActive('/ai-assistant')}
        />
        
        <SidebarLink 
          to="/settings" 
          icon={Settings}
          label="Settings"
          isActive={isActive('/settings')}
        />
      </nav>
      
      {/* Version Info */}
      <div className="p-4 text-xs text-gray-400">
        <p>WAKTI v1.0</p>
      </div>
    </div>
  );
};

export default DashboardSidebar;

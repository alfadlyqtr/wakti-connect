
import React, { useState, useEffect } from 'react';
import AppleStyleHeader from './AppleStyleHeader';
import AppleStyleCard from './AppleStyleCard';
import ThemeCustomizer from './ThemeCustomizer';
import { UserRole } from '@/types/user';
import CommandSearch from '@/components/search/CommandSearch';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  MessageSquare, 
  Calendar, 
  CheckSquare, 
  Users, 
  BriefcaseBusiness,
  Settings,
  HelpCircle,
  Bell,
  Bot,
  FileText,
  Contact,
  Briefcase,
  Wallet,
  Shield
} from 'lucide-react';

// Dashboard theme configuration
const getThemeBackground = (theme: string): string => {
  switch(theme) {
    case 'blue-dark': 
      return 'bg-gradient-to-br from-blue-950 to-indigo-950';
    case 'purple-dark': 
      return 'bg-gradient-to-br from-purple-950 to-indigo-950';
    case 'blue-light': 
      return 'bg-gradient-to-br from-blue-50 to-indigo-100';
    case 'green-light': 
      return 'bg-gradient-to-br from-green-50 to-teal-100';
    default: 
      return 'bg-gradient-to-br from-blue-950 to-indigo-950';
  }
};

const getThemeTextColor = (theme: string): string => {
  return theme.includes('light') ? 'text-gray-800' : 'text-white';
};

interface AppleStyleDashboardProps {
  userRole: "free" | "individual" | "business" | "staff" | "super-admin";
}

const AppleStyleDashboard: React.FC<AppleStyleDashboardProps> = ({ userRole }) => {
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const [dashboardTheme, setDashboardTheme] = useState(localStorage.getItem('dashboardTheme') || 'blue-dark');
  const bgClass = getThemeBackground(dashboardTheme);
  const textClass = getThemeTextColor(dashboardTheme);

  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // Define cards based on user role
  const getDashboardCards = () => {
    const commonCards = [
      { 
        title: 'Tasks', 
        icon: <CheckSquare className="h-5 w-5 text-white" />, 
        path: '/dashboard/tasks',
        color: 'bg-green-600',
        gradient: 'from-green-700/90 to-emerald-900/90',
        description: 'Manage your personal and team tasks'
      },
      { 
        title: 'Messages', 
        icon: <MessageSquare className="h-5 w-5 text-white" />, 
        path: '/dashboard/messages',
        color: 'bg-blue-600',
        gradient: 'from-blue-700/90 to-blue-900/90',
        description: 'Check your conversations and messages'
      },
      { 
        title: 'Notifications', 
        icon: <Bell className="h-5 w-5 text-white" />, 
        path: '/dashboard/notifications',
        color: 'bg-yellow-600',
        gradient: 'from-yellow-700/90 to-amber-900/90',
        description: 'View your recent notifications'
      },
      { 
        title: 'AI Assistant', 
        icon: <Bot className="h-5 w-5 text-white" />, 
        path: '/dashboard/ai-assistant',
        color: 'bg-purple-600',
        gradient: 'from-purple-700/90 to-purple-900/90',
        description: 'Get help from the WAKTI AI assistant'
      },
      { 
        title: 'Events', 
        icon: <Calendar className="h-5 w-5 text-white" />, 
        path: '/dashboard/events',
        color: 'bg-orange-600',
        gradient: 'from-orange-700/90 to-red-800/90',
        description: 'Manage your calendar and events'
      },
      { 
        title: 'Contacts', 
        icon: <Contact className="h-5 w-5 text-white" />, 
        path: '/dashboard/contacts',
        color: 'bg-cyan-600',
        gradient: 'from-cyan-700/90 to-blue-800/90',
        description: 'View and manage your contacts'
      }
    ];
    
    // Business-specific cards
    const businessCards = [
      { 
        title: 'Staff Management', 
        icon: <Users className="h-5 w-5 text-white" />, 
        path: '/dashboard/staff',
        color: 'bg-indigo-600',
        gradient: 'from-indigo-700/90 to-indigo-900/90',
        description: 'Manage your staff members and teams'
      },
      { 
        title: 'Bookings', 
        icon: <Calendar className="h-5 w-5 text-white" />, 
        path: '/dashboard/bookings',
        color: 'bg-pink-600',
        gradient: 'from-pink-700/90 to-pink-900/90',
        description: 'View and manage your booking calendar'
      },
      { 
        title: 'Services', 
        icon: <BriefcaseBusiness className="h-5 w-5 text-white" />, 
        path: '/dashboard/services',
        color: 'bg-teal-600',
        gradient: 'from-teal-700/90 to-teal-900/90',
        description: 'Configure your business services'
      }
    ];
    
    // Staff-specific cards
    const staffCards = [
      { 
        title: 'Job Cards', 
        icon: <FileText className="h-5 w-5 text-white" />, 
        path: '/dashboard/job-cards',
        color: 'bg-amber-600',
        gradient: 'from-amber-700/90 to-amber-900/90',
        description: 'Track your work with job cards'
      },
      { 
        title: 'Jobs', 
        icon: <Briefcase className="h-5 w-5 text-white" />, 
        path: '/dashboard/jobs',
        color: 'bg-rose-600',
        gradient: 'from-rose-700/90 to-rose-900/90',
        description: 'View your assigned jobs'
      }
    ];
    
    // Super-admin-specific cards
    const superAdminCards = [
      { 
        title: 'Admin Panel', 
        icon: <Shield className="h-5 w-5 text-white" />, 
        path: '/gohabsgo',
        color: 'bg-red-600',
        gradient: 'from-red-700/90 to-red-900/90',
        description: 'Access the super admin dashboard'
      }
    ];
    
    // Settings and Help cards for all users
    const utilityCards = [
      { 
        title: 'Settings', 
        icon: <Settings className="h-5 w-5 text-white" />, 
        path: '/dashboard/settings',
        color: 'bg-gray-600',
        gradient: 'from-gray-700/90 to-gray-900/90',
        description: 'Configure your account settings'
      },
      { 
        title: 'Help', 
        icon: <HelpCircle className="h-5 w-5 text-white" />, 
        path: '/dashboard/help',
        color: 'bg-sky-600',
        gradient: 'from-sky-700/90 to-sky-900/90',
        description: 'Get help and support'
      }
    ];
    
    let cards = [...commonCards];
    
    // Add role-specific cards
    if (userRole === 'business') {
      cards = [...cards, ...businessCards];
    } else if (userRole === 'staff') {
      cards = [...cards, ...staffCards];
    } else if (userRole === 'super-admin') {
      cards = [...cards, ...superAdminCards];
    }
    
    // Add utility cards to all users
    cards = [...cards, ...utilityCards];
    
    return cards;
  };

  return (
    <div className={`min-h-screen pb-8 ${bgClass} ${textClass}`}>
      <div className="p-4 sm:p-6">
        {/* Top search bar (like Apple's 'Get the App') */}
        <div className="mb-6 bg-gray-800/60 rounded-xl backdrop-blur-md p-4 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-white" />
            <p className="text-white">Search your WAKTI dashboard</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={openCommandSearch}
          >
            Search
          </Button>
        </div>
        
        {/* Dashboard header with profile info */}
        <AppleStyleHeader userRole={userRole} />
        
        {/* Dashboard cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {getDashboardCards().map((card, index) => (
            <AppleStyleCard 
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
              color={card.color}
              gradient={card.gradient}
            />
          ))}
        </div>
        
        {/* Theme customizer */}
        <ThemeCustomizer onThemeChange={setDashboardTheme} />
      </div>
      
      {/* Command search dialog */}
      <CommandSearch 
        open={commandSearchOpen} 
        setOpen={setCommandSearchOpen}
        userRole={userRole === 'super-admin' ? 'business' : userRole}
      />
    </div>
  );
};

export default AppleStyleDashboard;

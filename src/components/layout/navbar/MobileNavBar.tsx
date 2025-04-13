
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, MessageCircle, Settings, Users } from 'lucide-react';

const MobileNavBar: React.FC = () => {
  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: CalendarDays, path: '/dashboard/tasks', label: 'Tasks' },
    { icon: MessageCircle, path: '/dashboard/messages', label: 'Messages' },
    { icon: Users, path: '/dashboard/contacts', label: 'Contacts' },
    { icon: Settings, path: '/dashboard/settings', label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t lg:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;

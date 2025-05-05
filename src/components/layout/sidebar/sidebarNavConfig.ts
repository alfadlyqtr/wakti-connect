
import { 
  CalendarDays, 
  CheckSquare, 
  Home, 
  LayoutDashboard, 
  Mail, 
  MessageSquare, 
  Settings, 
  User, 
  Users,
  Bell,
  HeartHandshake
} from 'lucide-react';

// Define user type for sidebar
export type UserType = 'all' | 'individual' | 'business' | 'staff';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  forUsers?: UserType[];
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// Item type used by SidebarNavItems component
export interface NavItemType {
  label: string;
  path: string;
  icon: any;
  showFor: string[];
  badge?: number;
}

// Nav items for the sidebar
export const navItems: NavItemType[] = [
  {
    label: 'Dashboard',
    path: '',
    icon: LayoutDashboard,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  },
  {
    label: 'Calendar',
    path: 'calendar',
    icon: CalendarDays,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  },
  {
    label: 'Tasks',
    path: 'tasks',
    icon: CheckSquare,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  }
];

// Nav items for the user dropdown menu
export const dropdownNavItems: NavItemType[] = [
  {
    label: 'Messages',
    path: 'messages',
    icon: MessageSquare,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  },
  {
    label: 'Notifications',
    path: 'notifications',
    icon: Bell,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  },
  {
    label: 'Profile',
    path: 'profile',
    icon: User,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  },
  {
    label: 'Staff',
    path: 'staff-management',
    icon: Users,
    showFor: ['business', 'super-admin']
  },
  {
    label: 'Settings',
    path: 'settings',
    icon: Settings,
    showFor: ['individual', 'business', 'staff', 'super-admin']
  }
];

export const sidebarNavConfig: NavSection[] = [
  {
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        forUsers: ['all'],
      },
      {
        title: 'Calendar',
        href: '/dashboard/calendar',
        icon: CalendarDays,
        forUsers: ['all'],
      },
      {
        title: 'Tasks',
        href: '/dashboard/tasks',
        icon: CheckSquare,
        forUsers: ['all'],
      },
      {
        title: 'Invitations',
        href: '/dashboard/invitations',
        icon: Mail,
        forUsers: ['all'],
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare,
        forUsers: ['all'],
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Profile',
        href: '/dashboard/profile',
        icon: User,
        forUsers: ['all'],
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        forUsers: ['all'],
      },
    ],
  },
  {
    title: 'Business',
    items: [
      {
        title: 'Staff',
        href: '/dashboard/staff',
        icon: Users,
        forUsers: ['business'],
      },
    ],
  },
];


import { 
  CalendarDays, 
  CheckSquare, 
  Home, 
  LayoutDashboard, 
  Mail, 
  MessageSquare, 
  Settings, 
  User, 
  Users
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

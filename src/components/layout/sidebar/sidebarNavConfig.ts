import { Home, MessageSquare, Calendar, Users, Bell, Clock, Settings, HeartHandshake } from "lucide-react";
import { UserRole } from "@/types/user";

type NavItem = {
  icon: any; 
  label: string;
  path: string;
  showFor: UserRole[];
  badge?: number | null;
};

export const dropdownNavItems: NavItem[] = [
  {
    icon: MessageSquare,
    label: 'Messages',
    path: 'messages',
    showFor: ['individual', 'business', 'staff'],
    badge: 0
  },
  {
    icon: Calendar,
    label: 'Calendar',
    path: 'calendar',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: Clock,
    label: 'Time Tracking',
    path: 'time-tracking',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: Settings,
    label: 'Settings',
    path: 'settings',
    showFor: ['individual', 'business', 'staff']
  },
];

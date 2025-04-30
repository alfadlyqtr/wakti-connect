import {
  Home,
  CalendarDays,
  Briefcase,
  Users,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  Brain,
  Mic,
  CheckSquare,
  Building2,
  ScrollText,
  Headphones,
  Bell,
  MessageSquare,
} from "lucide-react";
import { UserRole } from "@/types/roles";

export const navItems = [
  {
    path: "",
    label: "Dashboard",
    icon: Home,
    showFor: ["individual", "business", "staff", "super-admin"],
  },
  {
    path: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    showFor: ["individual", "business"],
  },
  {
    path: "bookings",
    label: "Bookings",
    icon: CalendarDays,
    showFor: ["business", "staff"],
  },
  {
    path: "jobs",
    label: "Jobs",
    icon: Briefcase, 
    showFor: ["business", "staff"],
  },
  {
    path: "services",
    label: "Services",
    icon: Headphones,
    showFor: ["business"],
  },
  {
    path: "staff",
    label: "Staff",
    icon: Users,
    showFor: ["business"],
  },
  {
    path: "business-page",
    label: "Business Page",
    icon: Building2,
    showFor: ["business"],
  },
  {
    path: "analytics",
    label: "Analytics",
    icon: BarChart2,
    showFor: ["business"],
  },
  {
    path: "reports",
    label: "Reports",
    icon: ScrollText,
    showFor: ["business"],
  },
  {
    path: "ai-assistant",
    label: "WAKTI AI",
    icon: Brain,
    showFor: ["individual", "business"],
  },
  {
    path: "meeting-summary",
    label: "Voice Recorder & Transcription",
    icon: Mic,
    showFor: ["individual", "business"],
  },
  {
    path: "settings",
    label: "Settings",
    icon: Settings,
    showFor: ["individual", "business", "staff"],
  },
  {
    path: "help",
    label: "Help",
    icon: HelpCircle,
    showFor: ["individual", "business", "staff"],
  },
];

export const dropdownNavItems = [
  {
    path: "notifications",
    label: "Notifications",
    icon: Bell,
    showFor: ["individual", "business", "staff"],
    badge: 0,
  },
  {
    path: "messages",
    label: "Messages",
    icon: MessageSquare,
    showFor: ["individual", "business", "staff"],
    badge: 0,
  },
  {
    path: "contacts",
    label: "Contacts",
    icon: Users,
    showFor: ["individual", "business", "staff"],
    badge: 0,
  },
  {
    path: "settings",
    label: "Settings",
    icon: Settings,
    showFor: ["individual", "business", "staff"],
  },
];

export type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  showFor: string[];
  badge?: number;
};

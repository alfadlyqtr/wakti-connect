
import React from "react";
import { 
  ClipboardCheck, 
  Calendar, 
  MessageSquare, 
  Users, 
  Bell, 
  BarChart4, 
  Briefcase, 
  Clock,
  Share2,
  Search,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import FeatureSection from "./FeatureSection";

const FeatureGrid = () => {
  const features = [
    {
      icon: <ClipboardCheck size={24} />,
      title: "Task Management",
      description: "Create, edit, prioritize, and share tasks with teammates. Track progress with status updates and to-do lists.",
      color: "bg-wakti-blue/10 text-wakti-blue"
    },
    {
      icon: <Calendar size={24} />,
      title: "Appointment Booking",
      description: "Schedule personal appointments or offer bookable services to clients with a customizable booking system.",
      color: "bg-green-500/10 text-green-500"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Messaging System",
      description: "Communicate with team members, clients, and contacts through our secure messaging platform.",
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      icon: <Users size={24} />,
      title: "Contact Management",
      description: "Organize your contacts and connections with comprehensive contact management tools.",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Business Dashboard",
      description: "Manage your business with a customizable mini landing page and business management tools.",
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: "Role-Based Access",
      description: "Different dashboard views and permissions for free users, individuals, and businesses.",
      color: "bg-cyan-500/10 text-cyan-500"
    },
    {
      icon: <Bell size={24} />,
      title: "Notifications & Alerts",
      description: "Stay updated with real-time notifications for tasks, messages, and appointment changes.",
      color: "bg-rose-500/10 text-rose-500"
    },
    {
      icon: <BarChart4 size={24} />,
      title: "Business Analytics",
      description: "Track performance, engagement, and growth with comprehensive business analytics.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: <Clock size={24} />,
      title: "Work Hour Tracking",
      description: "Monitor staff working hours and track daily earnings for better business management.",
      color: "bg-teal-500/10 text-teal-500"
    },
    {
      icon: <Share2 size={24} />,
      title: "Sharing Capabilities",
      description: "Share tasks, events, and appointments with team members or contacts easily.",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      icon: <Search size={24} />,
      title: "Powerful Search",
      description: "Find tasks, appointments, contacts, and messages quickly with our advanced search feature.",
      color: "bg-violet-500/10 text-violet-500"
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Task Status Tracking",
      description: "Track task progress with custom statuses: Pending, Completed, and In Progress.",
      color: "bg-emerald-500/10 text-emerald-500"
    }
  ];

  return (
    <SectionContainer className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-12">All Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureSection
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </div>
    </SectionContainer>
  );
};

export default FeatureGrid;

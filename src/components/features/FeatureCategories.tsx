
import React from "react";
import { ClipboardCheck, Calendar, LayoutDashboard } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import FeatureDetail from "./FeatureDetail";

const FeatureCategories = () => {
  const taskManagementFeatures = [
    "Daily, Weekly, Monthly, and Quarterly Task Views",
    "Drag & Drop Sorting Between Categories",
    "Priority-Based Task Colors (High, Urgent, Medium, Normal)",
    "To-Do List (Subtasks for Each Task)",
    "Team Task Assignment",
    "Task History & Visual Charts"
  ];

  const appointmentFeatures = [
    "Create and Manage Services",
    "Shareable Booking Pages (Custom Branding, Logo, Colors, Fonts)",
    "Manage & Assign Appointments",
    "Automatic Appointment Reminders"
  ];

  const dashboardFeatures = [
    "Dashboard with Task & Appointment Summary",
    "User Role Management (Individuals, Businesses, Staff)",
    "Dark Mode & Light Mode Switcher",
    "Bilingual Support (Arabic & English)"
  ];

  return (
    <SectionContainer className="bg-muted/30 mb-12">
      <h2 className="text-3xl font-bold mb-8">Core Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-wakti-blue/10 p-3 rounded-full text-wakti-blue">
              <ClipboardCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold">Task Management</h2>
          </div>
          <FeatureDetail features={taskManagementFeatures} />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 p-3 rounded-full text-green-500">
              <Calendar size={28} />
            </div>
            <h2 className="text-2xl font-bold">Appointment Scheduling</h2>
          </div>
          <FeatureDetail features={appointmentFeatures} />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/10 p-3 rounded-full text-purple-500">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="text-2xl font-bold">Dashboard & User Management</h2>
          </div>
          <FeatureDetail features={dashboardFeatures} />
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeatureCategories;

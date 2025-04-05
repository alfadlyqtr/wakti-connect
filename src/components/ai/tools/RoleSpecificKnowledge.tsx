
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Graduation, Briefcase, Pen, Bot, Info, Star, Clock } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Badge } from "@/components/ui/badge";

interface RoleSpecificKnowledgeProps {
  selectedRole: AIAssistantRole;
  canAccess: boolean;
}

export const RoleSpecificKnowledge: React.FC<RoleSpecificKnowledgeProps> = ({
  selectedRole,
  canAccess
}) => {
  // WAKTI role-specific knowledge
  const roleKnowledge = {
    student: [
      { title: "WAKTI for Students", content: "WAKTI helps students organize assignments, track deadlines, and manage study schedules." },
      { title: "Task Management for Academics", content: "Use WAKTI to categorize assignments by subject and prioritize your study tasks." },
      { title: "Group Projects", content: "Share tasks and events with classmates to coordinate group projects efficiently." }
    ],
    employee: [
      { title: "WAKTI for Professionals", content: "WAKTI helps employees manage work tasks, track deadlines, and coordinate with team members." },
      { title: "Daily Work Planning", content: "Use WAKTI to organize your workday with prioritized tasks and time blocking." },
      { title: "Team Coordination", content: "Share tasks and events with colleagues for better team coordination." }
    ],
    writer: [
      { title: "WAKTI for Creators", content: "WAKTI helps writers and creators organize projects, track deadlines, and manage creative workflows." },
      { title: "Project Milestones", content: "Break down creative projects into manageable tasks with deadlines in WAKTI." },
      { title: "Client Management", content: "Use WAKTI to schedule client meetings and track deliverables." }
    ],
    business_owner: [
      { title: "WAKTI for Business", content: "WAKTI helps business owners manage operations, staff, and customer appointments." },
      { title: "Staff Management", content: "Assign tasks to staff members and track their productivity with WAKTI." },
      { title: "Service Booking", content: "Allow customers to book your services through a customizable booking page." },
      { title: "Business Analytics", content: "Track business performance with integrated analytics and reporting tools." }
    ],
    general: [
      { title: "WAKTI Overview", content: "WAKTI is an all-in-one productivity and business management platform." },
      { title: "Task & Events", content: "Organize your personal and work life with WAKTI's task and event management." },
      { title: "Plans & Features", content: "WAKTI offers Free, Individual (QAR 20/month), and Business (QAR 45/month) plans with different features." }
    ]
  };

  // Get knowledge items for the selected role
  const knowledgeItems = roleKnowledge[selectedRole] || roleKnowledge.general;
  
  // WAKTI general information to show for all roles
  const waktiInfo = [
    { 
      title: "About WAKTI", 
      content: "WAKTI is an all-in-one productivity and business management platform developed in Qatar for the MENA region.",
      icon: <Info className="h-4 w-4 text-indigo-500" />
    },
    { 
      title: "Key Features", 
      content: "Task management, appointment booking, messaging, business dashboard, and AI assistant integration.",
      icon: <Star className="h-4 w-4 text-amber-500" />
    },
    { 
      title: "Plans & Pricing", 
      content: "Free, Individual (QAR 20/month), and Business (QAR 45/month) plans available with different features.",
      icon: <Briefcase className="h-4 w-4 text-emerald-500" />
    }
  ];

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "student": return <Graduation className="h-5 w-5 text-blue-500" />;
      case "business_owner": return <Briefcase className="h-5 w-5 text-amber-500" />;
      case "employee": return <Clock className="h-5 w-5 text-purple-500" />;
      case "writer": return <Pen className="h-5 w-5 text-green-500" />;
      default: return <Bot className="h-5 w-5 text-wakti-blue" />;
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case "student": return "Student";
      case "business_owner": return "Business";
      case "employee": return "Professional";
      case "writer": return "Creative";
      default: return "General";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {getRoleIcon()}
          <span>WAKTI for {getRoleTitle()}</span>
          <Badge variant="outline" className="ml-auto">Knowledge</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            {knowledgeItems.map((item, index) => (
              <div 
                key={index} 
                className="border rounded-md p-3 hover:bg-accent transition-colors"
              >
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.content}</p>
              </div>
            ))}
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">General WAKTI Information</h4>
            <div className="space-y-2">
              {waktiInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 border rounded-md p-2 text-xs"
                >
                  {item.icon}
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

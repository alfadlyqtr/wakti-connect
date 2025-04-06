
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Briefcase, Pen, Bot, Info, Star, Clock } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface RoleSpecificKnowledgeProps {
  selectedRole: AIAssistantRole;
  canAccess: boolean;
}

export const RoleSpecificKnowledge: React.FC<RoleSpecificKnowledgeProps> = ({
  selectedRole,
  canAccess
}) => {
  const { t } = useTranslation();
  
  // WAKTI role-specific knowledge
  const roleKnowledge = {
    student: [
      { title: t("ai.knowledge.waktiForStudents"), content: "WAKTI helps students organize assignments, track deadlines, and manage study schedules." },
      { title: t("ai.knowledge.taskManagement"), content: "Use WAKTI to categorize assignments by subject and prioritize your study tasks." },
      { title: t("ai.knowledge.groupProjects"), content: "Share tasks and events with classmates to coordinate group projects efficiently." }
    ],
    employee: [
      { title: t("ai.knowledge.waktiForProfessionals"), content: "WAKTI helps employees manage work tasks, track deadlines, and coordinate with team members." },
      { title: t("ai.knowledge.dailyWorkPlanning"), content: "Use WAKTI to organize your workday with prioritized tasks and time blocking." },
      { title: t("ai.knowledge.teamCoordination"), content: "Share tasks and events with colleagues for better team coordination." }
    ],
    writer: [
      { title: t("ai.knowledge.waktiForCreators"), content: "WAKTI helps writers and creators organize projects, track deadlines, and manage creative workflows." },
      { title: t("ai.knowledge.projectMilestones"), content: "Break down creative projects into manageable tasks with deadlines in WAKTI." },
      { title: t("ai.knowledge.clientManagement"), content: "Use WAKTI to schedule client meetings and track deliverables." }
    ],
    business_owner: [
      { title: t("ai.knowledge.waktiForBusiness"), content: "WAKTI helps business owners manage operations, staff, and customer appointments." },
      { title: t("ai.knowledge.staffManagement"), content: "Assign tasks to staff members and track their productivity with WAKTI." },
      { title: t("ai.knowledge.serviceBooking"), content: "Allow customers to book your services through a customizable booking page." },
      { title: t("ai.knowledge.businessAnalytics"), content: "Track business performance with integrated analytics and reporting tools." }
    ],
    general: [
      { title: t("ai.knowledge.waktiOverview"), content: "WAKTI is an all-in-one productivity and business management platform." },
      { title: t("ai.knowledge.taskAndEvents"), content: "Organize your personal and work life with WAKTI's task and event management." },
      { title: t("ai.knowledge.plansAndFeatures"), content: "WAKTI offers Free, Individual (QAR 20/month), and Business (QAR 45/month) plans with different features." }
    ]
  };

  // Get knowledge items for the selected role
  const knowledgeItems = roleKnowledge[selectedRole] || roleKnowledge.general;
  
  // WAKTI general information to show for all roles
  const waktiInfo = [
    { 
      title: t("ai.knowledge.aboutWakti"), 
      content: "WAKTI is an all-in-one productivity and business management platform developed in Qatar for the MENA region.",
      icon: <Info className="h-4 w-4 text-indigo-500" />
    },
    { 
      title: t("ai.knowledge.keyFeatures"), 
      content: "Task management, appointment booking, messaging, business dashboard, and AI assistant integration.",
      icon: <Star className="h-4 w-4 text-amber-500" />
    },
    { 
      title: t("ai.knowledge.plansAndPricing"), 
      content: "Free, Individual (QAR 20/month), and Business (QAR 45/month) plans available with different features.",
      icon: <Briefcase className="h-4 w-4 text-emerald-500" />
    }
  ];

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "student": return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case "business_owner": return <Briefcase className="h-5 w-5 text-amber-500" />;
      case "employee": return <Clock className="h-5 w-5 text-purple-500" />;
      case "writer": return <Pen className="h-5 w-5 text-green-500" />;
      default: return <Bot className="h-5 w-5 text-wakti-blue" />;
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case "student": return t("ai.knowledge.student");
      case "business_owner": return t("ai.knowledge.business");
      case "employee": return t("ai.knowledge.professional");
      case "writer": return t("ai.knowledge.creative");
      default: return t("ai.knowledge.general");
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

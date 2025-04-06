
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { AIUpgradeRequired } from "../AIUpgradeRequired";
import { BookOpen, Briefcase, Pen, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  
  if (!canAccess) {
    return <AIUpgradeRequired />;
  }
  
  const getIcon = () => {
    switch (selectedRole) {
      case 'student':
        return <BookOpen className="h-5 w-5 mr-2 text-wakti-blue" />;
      case 'business_owner':
        return <Briefcase className="h-5 w-5 mr-2 text-wakti-blue" />;
      case 'writer':
      case 'employee':
        return <Pen className="h-5 w-5 mr-2 text-wakti-blue" />;
      default:
        return <Bot className="h-5 w-5 mr-2 text-wakti-blue" />;
    }
  };
  
  const getTitle = () => {
    switch (selectedRole) {
      case 'student':
        return t("ai.knowledge.waktiForStudents");
      case 'business_owner':
        return t("ai.knowledge.waktiForBusiness");
      case 'writer':
        return t("ai.knowledge.waktiForCreators");
      case 'employee':
        return t("ai.knowledge.waktiForProfessionals");
      default:
        return t("ai.knowledge.waktiOverview");
    }
  };
  
  const getKnowledgeItems = () => {
    switch (selectedRole) {
      case 'student':
        return [
          { title: t("ai.knowledge.taskManagement"), id: 'study-tasks' },
          { title: t("ai.knowledge.groupProjects"), id: 'study-groups' }
        ];
      case 'business_owner':
        return [
          { title: t("ai.knowledge.staffManagement"), id: 'staff-management' },
          { title: t("ai.knowledge.serviceBooking"), id: 'service-booking' },
          { title: t("ai.knowledge.businessAnalytics"), id: 'business-analytics' }
        ];
      case 'writer':
        return [
          { title: t("ai.knowledge.projectMilestones"), id: 'creative-milestones' },
          { title: t("ai.knowledge.clientManagement"), id: 'creative-clients' }
        ];
      case 'employee':
        return [
          { title: t("ai.knowledge.dailyWorkPlanning"), id: 'work-planning' },
          { title: t("ai.knowledge.teamCoordination"), id: 'team-coordination' }
        ];
      default:
        return [
          { title: t("ai.knowledge.taskAndEvents"), id: 'general-tasks' },
          { title: t("ai.knowledge.plansAndFeatures"), id: 'general-features' }
        ];
    }
  };
  
  const knowledgeItems = getKnowledgeItems();
  
  const getRoleBadgeColor = () => {
    switch (selectedRole) {
      case 'student':
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case 'business_owner':
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case 'writer':
      case 'employee':
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-wakti-blue/10 text-wakti-blue hover:bg-wakti-blue/20";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 py-1">
          <Badge variant="outline" className={cn(getRoleBadgeColor())}>
            {t(`aiSettings.roles.${selectedRole}`)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {knowledgeItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between border rounded-md p-2 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm">{item.title}</span>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                {t("aiSettings.knowledge.selectRole")}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            {t("aiSettings.knowledge.addInfo")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

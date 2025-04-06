
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Info, BookOpen, Briefcase, Pen, Bot } from "lucide-react";
import { RoleProfileDialog } from "./RoleProfileDialog";
import { useTranslation } from "react-i18next";

interface KnowledgeProfileToolCardProps {
  selectedRole: AIAssistantRole;
}

export const KnowledgeProfileToolCard: React.FC<KnowledgeProfileToolCardProps> = ({
  selectedRole
}) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRole, setDialogRole] = useState<AIAssistantRole>(selectedRole);
  
  const handleOpenDialog = (role: AIAssistantRole) => {
    setDialogRole(role);
    setDialogOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Info className="h-5 w-5 mr-2 text-wakti-blue" />
            {t("ai.knowledge.keyFeatures")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-4">
              <TabsTrigger 
                value="general" 
                onClick={() => {}}
                className="flex items-center justify-center py-2 px-0"
              >
                <Bot className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="student" 
                onClick={() => {}}
                className="flex items-center justify-center py-2 px-0"
              >
                <BookOpen className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="business_owner" 
                onClick={() => {}}
                className="flex items-center justify-center py-2 px-0"
              >
                <Briefcase className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="employee" 
                onClick={() => {}}
                className="flex items-center justify-center py-2 px-0"
              >
                <Pen className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="writer" 
                onClick={() => {}}
                className="flex items-center justify-center py-2 px-0"
              >
                <Pen className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            
            <div className="h-40 overflow-y-auto border rounded-md p-3">
              <TabsContent value="general">
                <div 
                  className="cursor-pointer space-y-2" 
                  onClick={() => handleOpenDialog('general')}
                >
                  <h3 className="font-medium text-sm">{t("ai.knowledge.aboutWakti")}</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                    <li>{t("ai.knowledge.keyFeatures")}</li>
                    <li>{t("ai.knowledge.plansAndPricing")}</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="student">
                <div 
                  className="cursor-pointer space-y-2" 
                  onClick={() => handleOpenDialog('student')}
                >
                  <h3 className="font-medium text-sm">{t("ai.knowledge.waktiForStudents")}</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                    <li>{t("ai.knowledge.taskManagement")}</li>
                    <li>{t("ai.knowledge.groupProjects")}</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="business_owner">
                <div 
                  className="cursor-pointer space-y-2" 
                  onClick={() => handleOpenDialog('business_owner')}
                >
                  <h3 className="font-medium text-sm">{t("ai.knowledge.waktiForBusiness")}</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                    <li>{t("ai.knowledge.staffManagement")}</li>
                    <li>{t("ai.knowledge.serviceBooking")}</li>
                    <li>{t("ai.knowledge.businessAnalytics")}</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="employee">
                <div 
                  className="cursor-pointer space-y-2" 
                  onClick={() => handleOpenDialog('employee')}
                >
                  <h3 className="font-medium text-sm">{t("ai.knowledge.waktiForProfessionals")}</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                    <li>{t("ai.knowledge.dailyWorkPlanning")}</li>
                    <li>{t("ai.knowledge.teamCoordination")}</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="writer">
                <div 
                  className="cursor-pointer space-y-2" 
                  onClick={() => handleOpenDialog('writer')}
                >
                  <h3 className="font-medium text-sm">{t("ai.knowledge.waktiForCreators")}</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                    <li>{t("ai.knowledge.projectMilestones")}</li>
                    <li>{t("ai.knowledge.clientManagement")}</li>
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <RoleProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={dialogRole}
      />
    </>
  );
};

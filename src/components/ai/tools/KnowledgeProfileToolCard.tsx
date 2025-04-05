
import React from "react";
import { Database } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { 
  waktiOverview,
  waktiFeatures,
  waktiRoles,
  waktiPlans,
  waktiCreation,
  waktiCompanyInfo
} from "@/data/wakti-knowledge";

interface KnowledgeProfileToolCardProps {
  selectedRole: AIAssistantRole;
}

export const KnowledgeProfileToolCard: React.FC<KnowledgeProfileToolCardProps> = ({ 
  selectedRole 
}) => {
  const getRelevantWaktiInfo = () => {
    // Information tailored to the selected role
    switch (selectedRole) {
      case "business_owner":
        return {
          title: "WAKTI Business Features",
          description: "WAKTI's business management capabilities include staff management, service booking, and business analytics.",
          info: waktiFeatures.businessDashboard + "\n\n" + waktiFeatures.businessManagement,
          iconColor: "text-amber-500"
        };
      case "student":
        return {
          title: "WAKTI for Students",
          description: "WAKTI helps students organize tasks, track assignments, and manage study schedules.",
          info: waktiFeatures.taskManagement + "\n\n" + waktiFeatures.appointmentSystem,
          iconColor: "text-blue-500"
        };
      case "employee":
      case "writer":
        return {
          title: "WAKTI for Professionals",
          description: "WAKTI helps professionals manage tasks, schedule appointments, and collaborate with teams.",
          info: waktiFeatures.taskManagement + "\n\n" + waktiFeatures.appointmentSystem,
          iconColor: "text-purple-500"
        };
      default:
        return {
          title: "About WAKTI",
          description: "WAKTI is an all-in-one productivity and business management platform.",
          info: waktiOverview + "\n\n" + waktiPlans,
          iconColor: "text-wakti-blue"
        };
    }
  };
  
  const waktiInfo = getRelevantWaktiInfo();
  
  return (
    <AIToolCard
      icon={Database}
      title={waktiInfo.title}
      description={waktiInfo.description}
      iconColor={waktiInfo.iconColor}
    >
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground text-xs">{waktiInfo.info.substring(0, 200)}...</p>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open("/help", "_blank")}
        >
          View WAKTI Guide
        </Button>
      </div>
    </AIToolCard>
  );
};

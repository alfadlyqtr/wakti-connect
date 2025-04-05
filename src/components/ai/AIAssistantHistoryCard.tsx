
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AIAssistantHistoryCardProps {
  canAccess: boolean;
  compact?: boolean;
}

export const AIAssistantHistoryCard: React.FC<AIAssistantHistoryCardProps> = ({ 
  canAccess,
  compact = false
}) => {
  const { t } = useTranslation();
  
  if (!canAccess) {
    return null;
  }

  // Sample history data - would be replaced with actual data in a real implementation
  const sampleHistory = [
    { id: "1", title: t("ai.sampleHistory.efficiency"), date: t("ai.timeAgo.days", { count: 2 }) },
    { id: "2", title: t("ai.sampleHistory.marketing"), date: t("ai.timeAgo.week", { count: 1 }) },
    { id: "3", title: t("ai.sampleHistory.studyPlan"), date: t("ai.timeAgo.weeks", { count: 2 }) }
  ];

  // Adjust styling for compact mode
  const getHeaderClasses = () => {
    return compact 
      ? "pb-2" 
      : "pb-2 sm:pb-3";
  };

  const getIconClasses = () => {
    return compact
      ? "h-4 w-4 mr-1.5"
      : "h-5 w-5 mr-2";
  };

  const getTitleClasses = () => {
    return compact
      ? "text-base"
      : "text-xl";
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm mb-1">
          <History className="h-4 w-4 mr-1.5" />
          <span className="font-medium">{t("ai.recentConversations")}</span>
        </div>
        <div className="space-y-2">
          {sampleHistory.map((item) => (
            <div 
              key={item.id}
              className="text-sm p-2 rounded-md border border-border hover:bg-accent cursor-pointer flex items-center justify-between"
            >
              <div className="truncate flex-1">{item.title}</div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className={getHeaderClasses()}>
        <CardTitle className={`flex items-center ${getTitleClasses()}`}>
          <History className={getIconClasses()} />
          {t("ai.conversationHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sampleHistory.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-md border border-border hover:bg-accent cursor-pointer"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

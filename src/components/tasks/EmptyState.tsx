
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, CalendarPlus, ClipboardList, Share } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  activeTab: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ activeTab }) => {
  const { t } = useTranslation();
  
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "my-tasks":
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: t('tasks.empty.myTasks.title'),
          description: t('tasks.empty.myTasks.description'),
          actionText: t('tasks.empty.myTasks.action'),
          actionIcon: <Plus className="h-4 w-4 mr-2" />,
        };
      case "delegated":
        return {
          icon: <Share className="h-12 w-12 text-muted-foreground" />,
          title: t('tasks.empty.delegated.title'),
          description: t('tasks.empty.delegated.description'),
          actionText: t('tasks.empty.delegated.action'),
          actionIcon: <Plus className="h-4 w-4 mr-2" />,
        };
      case "completed":
        return {
          icon: <CalendarPlus className="h-12 w-12 text-muted-foreground" />,
          title: t('tasks.empty.completed.title'),
          description: t('tasks.empty.completed.description'),
          actionText: t('tasks.empty.completed.action'),
          actionIcon: <Plus className="h-4 w-4 mr-2" />,
        };
      case "shared":
        return {
          icon: <Share className="h-12 w-12 text-muted-foreground" />,
          title: t('tasks.empty.shared.title'),
          description: t('tasks.empty.shared.description'),
          actionText: t('tasks.empty.shared.action'),
          actionIcon: <Share className="h-4 w-4 mr-2" />,
        };
      default:
        return {
          icon: <ClipboardList className="h-12 w-12 text-muted-foreground" />,
          title: t('tasks.empty.default.title'),
          description: t('tasks.empty.default.description'),
          actionText: t('tasks.empty.default.action'),
          actionIcon: <Plus className="h-4 w-4 mr-2" />,
        };
    }
  };
  
  const content = getEmptyStateContent();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {content.icon}
      <h3 className="mt-4 text-lg font-medium">{content.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {content.description}
      </p>
      <Button className="mt-6 flex items-center" onClick={() => {}}>
        {content.actionIcon}
        {content.actionText}
      </Button>
    </div>
  );
};

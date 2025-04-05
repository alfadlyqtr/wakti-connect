
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyTasksProps {
  isPaidAccount: boolean;
  onCreateTask: () => void;
}

export const EmptyTasks: React.FC<EmptyTasksProps> = ({ 
  isPaidAccount,
  onCreateTask
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{t('task.noTasksYet')}</h3>
      <p className="text-muted-foreground max-w-md mt-2 mb-4">
        {isPaidAccount
          ? t('task.createFirstTaskPaid')
          : t('task.createFirstTaskFree')}
      </p>
      <Button onClick={onCreateTask}>
        {t('task.createTask')}
      </Button>
    </div>
  );
};

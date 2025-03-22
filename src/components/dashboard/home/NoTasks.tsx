
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NoTasksProps {
  message: string;
  onCreateTask: () => void;
}

export const NoTasks: React.FC<NoTasksProps> = ({ message, onCreateTask }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <PlusCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{message}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {t('dashboard.noTasks')}
      </p>
      <Button onClick={onCreateTask}>
        {t('task.createTask')}
      </Button>
    </div>
  );
};

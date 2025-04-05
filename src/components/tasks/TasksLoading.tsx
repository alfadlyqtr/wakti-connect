
import React from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const TasksLoading: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.tasks')}</h1>
        <p className="text-muted-foreground">
          {t('task.userDescription')}
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
          <span className="ml-2">{t('common.loading')} {t('dashboard.tasks').toLowerCase()}...</span>
        </div>
      </div>
    </div>
  );
};

export default TasksLoading;

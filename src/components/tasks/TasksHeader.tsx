
import React from "react";
import { useTranslation } from "react-i18next";

interface TasksHeaderProps {
  isStaffMember: boolean;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ isStaffMember }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.tasks')}</h1>
      <p className="text-muted-foreground">
        {isStaffMember 
          ? t('task.staffDescription')
          : t('task.userDescription')}
      </p>
    </div>
  );
};

export default TasksHeader;

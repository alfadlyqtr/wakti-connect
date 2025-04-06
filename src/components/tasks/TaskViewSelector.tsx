
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, LayoutGrid, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskViewSelectorProps {
  viewType: "table" | "kanban" | "calendar";
  setViewType: (viewType: "table" | "kanban" | "calendar") => void;
}

export const TaskViewSelector: React.FC<TaskViewSelectorProps> = ({
  viewType,
  setViewType,
}) => {
  const { t } = useTranslation();
  
  return (
    <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as any)}>
      <ToggleGroupItem value="table" aria-label={t('tasks.views.table')} title={t('tasks.views.table')}>
        <Table2 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="kanban" aria-label={t('tasks.views.kanban')} title={t('tasks.views.kanban')}>
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" aria-label={t('tasks.views.calendar')} title={t('tasks.views.calendar')}>
        <Calendar className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

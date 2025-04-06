
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { TaskFilterType } from "@/pages/dashboard/DashboardTasks";
import { useTranslation } from "react-i18next";

interface TaskFilterMenuProps {
  currentFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
}

export const TaskFilterMenu: React.FC<TaskFilterMenuProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          {t('tasks.filter')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentFilter}
          onValueChange={(value) => onFilterChange(value as TaskFilterType)}
        >
          <DropdownMenuRadioItem value="all">
            {t('tasks.filters.all')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="priority">
            {t('tasks.filters.byPriority')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="status">
            {t('tasks.filters.byStatus')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

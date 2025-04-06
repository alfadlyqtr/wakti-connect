
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskSortMenuProps {
  currentOrder: "asc" | "desc";
  onOrderChange: (order: "asc" | "desc") => void;
}

export const TaskSortMenu: React.FC<TaskSortMenuProps> = ({
  currentOrder,
  onOrderChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ArrowDownUp className="h-4 w-4" />
          {t('tasks.sort')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentOrder}
          onValueChange={(value) => onOrderChange(value as "asc" | "desc")}
        >
          <DropdownMenuRadioItem value="asc">
            {t('tasks.sortOrder.asc')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">
            {t('tasks.sortOrder.desc')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

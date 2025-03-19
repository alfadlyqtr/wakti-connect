
import React from "react";
import { MoreVertical, Check, Clock, Share, UserPlus, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { TaskStatus } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";

interface TaskActionsMenuProps {
  status: TaskStatus;
  userRole: "free" | "individual" | "business";
  isShared?: boolean;
  isAssigned?: boolean;
  onEdit?: () => void;
  onAddSubtask?: () => void;
  onMarkComplete?: () => void;
  onMarkPending?: () => void;
  onShare?: () => void;
  onAssign?: () => void;
  onDelete?: () => void;
}

const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({ 
  status, 
  userRole, 
  isShared = false, 
  isAssigned = false,
  onEdit,
  onAddSubtask,
  onMarkComplete,
  onMarkPending,
  onShare,
  onAssign,
  onDelete
}) => {
  const { t } = useTranslation();

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action();
    } else {
      // If no handler is provided, show a toast indicating the feature is coming soon
      toast({
        title: t('common.comingSoon'),
        description: t('task.actionComingSoon'),
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{t('task.menu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction(onEdit)}>
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleAction(onAddSubtask)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('task.addSubtask')}
        </DropdownMenuItem>
        
        {status !== "completed" ? (
          <DropdownMenuItem onClick={() => handleAction(onMarkComplete)}>
            <Check className="h-4 w-4 mr-2" />
            {t('task.markComplete')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleAction(onMarkPending)}>
            <Clock className="h-4 w-4 mr-2" />
            {t('task.markPending')}
          </DropdownMenuItem>
        )}
        
        {userRole === "individual" && !isShared && !isAssigned && (
          <DropdownMenuItem onClick={() => handleAction(onShare)}>
            <Share className="h-4 w-4 mr-2" />
            {t('task.shareTask')}
          </DropdownMenuItem>
        )}
        
        {userRole === "business" && !isAssigned && (
          <DropdownMenuItem onClick={() => handleAction(onAssign)}>
            <UserPlus className="h-4 w-4 mr-2" />
            {t('task.assignToStaff')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={() => handleAction(onDelete)}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t('common.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsMenu;


import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus, TaskPriority } from '@/types/task.types';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import TaskActionsMenu from './TaskActionsMenu';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  userRole: "free" | "individual" | "business";
  tab: "my-tasks" | "shared-tasks" | "assigned-tasks";
  onAction: (action: string, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, userRole, tab, onAction }) => {
  // Calculate completed subtasks
  const completedSubtasks = task.subtasks ? task.subtasks.filter(subtask => subtask.is_completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  
  // Determine if the task is shared or assigned
  const isShared = tab === "shared-tasks";
  const isAssigned = tab === "assigned-tasks" || (tab === "my-tasks" && task.assignee_id !== null);
  
  // Format the due date (if exists)
  const formattedDueDate = task.due_date ? format(new Date(task.due_date), 'PPP') : 'No due date';
  
  const handleMarkComplete = () => {
    onAction('mark-complete', task.id);
  };
  
  const handleMarkPending = () => {
    onAction('mark-pending', task.id);
  };
  
  const handleShare = () => {
    onAction('share', task.id);
  };
  
  const handleAssign = () => {
    onAction('assign', task.id);
  };
  
  const handleEdit = () => {
    onAction('edit', task.id);
  };
  
  const handleDelete = () => {
    onAction('delete', task.id);
  };
  
  const handleAddSubtask = () => {
    onAction('add-subtask', task.id);
  };
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow group">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge 
            variant={task.status === 'completed' ? "success" : "outline"}
            className={cn(
              task.status === 'in-progress' && "bg-blue-100 text-blue-800",
              task.status === 'pending' && "bg-amber-100 text-amber-800",
              task.status === 'late' && "bg-red-100 text-red-800"
            )}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
          </Badge>
          
          <TaskActionsMenu 
            status={task.status as TaskStatus}
            userRole={userRole}
            isShared={isShared}
            isAssigned={isAssigned}
            onEdit={handleEdit}
            onMarkComplete={task.status !== 'completed' ? handleMarkComplete : undefined}
            onMarkPending={task.status === 'completed' ? handleMarkPending : undefined}
            onShare={userRole === 'individual' && !isShared && !isAssigned ? handleShare : undefined}
            onAssign={userRole === 'business' && !isAssigned ? handleAssign : undefined}
            onDelete={handleDelete}
            onAddSubtask={handleAddSubtask}
          />
        </div>
        <h3 className="text-lg font-semibold line-clamp-2 mt-1">{task.title}</h3>
      </CardHeader>
      
      <CardContent className="pb-2">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}
        
        {totalSubtasks > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {completedSubtasks} of {totalSubtasks} subtasks completed
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span>{formattedDueDate}</span>
        </div>
        
        <Badge className={cn(
          "text-xs",
          task.priority === "urgent" && "bg-red-500",
          task.priority === "high" && "bg-orange-500",
          task.priority === "medium" && "bg-amber-500",
          task.priority === "normal" && "bg-green-500"
        )}>
          {task.priority}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;


import React, { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle2Icon, Plus, Loader2 } from "lucide-react";
import { SubTask } from "@/types/task.types";
import { format, parseISO, isValid } from "date-fns";
import { formatTimeString } from "@/utils/dateTimeFormatter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TaskSubtasksProps {
  taskId: string;
  subtasks: SubTask[];
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  taskId,
  subtasks,
  onSubtaskToggle,
  refetch
}) => {
  const [showAllSubtasks, setShowAllSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isSubmittingSubtask, setIsSubmittingSubtask] = useState(false);
  
  const hasSubtasks = subtasks && subtasks.length > 0;
  const completedSubtasks = subtasks.filter(subtask => subtask.is_completed).length;
  const subtaskCompletionPercentage = hasSubtasks 
    ? Math.round((completedSubtasks / subtasks.length) * 100) 
    : 0;

  const formatSubtaskDueDate = (dueDate: string | null | undefined, dueTime: string | null | undefined) => {
    if (!dueDate) return null;
    
    try {
      const date = parseISO(dueDate);
      if (!isValid(date)) return null;
      
      const formattedDate = format(date, 'MMM d');
      
      if (dueTime) {
        return `${formattedDate}, ${formatTimeString(dueTime)}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error("Error formatting subtask due date:", error, dueDate);
      return null;
    }
  };
  
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    try {
      setIsSubmittingSubtask(true);
      
      const { data, error } = await supabase
        .from('todo_items')
        .insert({
          task_id: taskId,
          content: newSubtask.trim(),
          is_completed: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Subtask added",
        description: "Your subtask has been added successfully."
      });
      
      setNewSubtask("");
      setIsAddingSubtask(false);
      
      setTimeout(() => {
        if (refetch) {
          refetch();
        } else {
          window.location.reload();
        }
      }, 300);
      
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast({
        title: "Error",
        description: "Failed to add subtask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingSubtask(false);
    }
  };

  const SubtaskItem = ({ subtask, index }: { subtask: SubTask; index: number }) => (
    <div className="flex items-start gap-2 text-sm">
      <Checkbox 
        checked={subtask.is_completed} 
        onCheckedChange={(checked) => 
          onSubtaskToggle && onSubtaskToggle(taskId, index, checked as boolean)
        }
        className="mt-0.5"
      />
      <div className="flex-1">
        <div className={`${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}>
          {subtask.content}
          {(subtask.due_date || subtask.due_time) && (
            <span className="text-xs text-muted-foreground ml-2">
              {formatSubtaskDueDate(subtask.due_date, subtask.due_time)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const AddSubtaskForm = () => (
    <div className="space-y-2">
      <Input 
        placeholder="Enter subtask"
        value={newSubtask}
        onChange={(e) => setNewSubtask(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAddingSubtask(false)}
          className="text-xs h-8"
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={handleAddSubtask}
          disabled={isSubmittingSubtask || !newSubtask.trim()}
          className="text-xs h-8"
        >
          {isSubmittingSubtask ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );

  if (!hasSubtasks) {
    return (
      <div className="mt-4 border rounded-md p-3">
        {!isAddingSubtask ? (
          <button 
            onClick={() => setIsAddingSubtask(true)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-full"
          >
            <Plus className="h-4 w-4" /> Add subtask
          </button>
        ) : (
          <AddSubtaskForm />
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Collapsible
        open={showAllSubtasks}
        onOpenChange={setShowAllSubtasks}
        className="border rounded-md p-2"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Subtasks ({completedSubtasks}/{subtasks.length})
            </span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              {showAllSubtasks ? "Hide" : "Show All"}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{subtaskCompletionPercentage}%</span>
          </div>
          <Progress value={subtaskCompletionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {subtasks.slice(0, 2).map((subtask, index) => (
            <SubtaskItem key={subtask.id || index} subtask={subtask} index={index} />
          ))}
        </div>
        
        <CollapsibleContent className="space-y-2 mt-2">
          {subtasks.slice(2).map((subtask, index) => (
            <SubtaskItem key={subtask.id || (index + 2)} subtask={subtask} index={index + 2} />
          ))}
        </CollapsibleContent>
        
        {!isAddingSubtask ? (
          <button 
            onClick={() => setIsAddingSubtask(true)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-3 w-full"
          >
            <Plus className="h-4 w-4" /> Add subtask
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <AddSubtaskForm />
          </div>
        )}
      </Collapsible>
    </div>
  );
};

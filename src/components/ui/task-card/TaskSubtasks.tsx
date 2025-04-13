
import React, { useState } from "react";
import { SubTask } from "@/types/task.types";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NestedSubtask } from "@/services/ai/aiTaskParserService";

interface TaskSubtasksProps {
  taskId: string;
  subtasks?: SubTask[] | (string | NestedSubtask)[];
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  taskId,
  subtasks = [],
  onSubtaskToggle,
  refetch
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  if (!subtasks || subtasks.length === 0) return null;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if we have the nested structure from AI parser
  const hasNestedStructure = subtasks.some(st => 
    typeof st === 'object' && st !== null && 
    (
      (st as NestedSubtask).subtasks || 
      (st as NestedSubtask).title || 
      (st as any).is_group
    )
  );

  const handleSubtaskToggle = async (index: number, subtaskId?: string) => {
    if (!hasNestedStructure) {
      const subtask = subtasks[index] as SubTask;
      const newStatus = !subtask.is_completed;
      
      try {
        if (subtaskId) {
          const { error } = await supabase
            .from('todo_items')
            .update({ 
              is_completed: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', subtaskId);
            
          if (error) throw error;
        }
        
        if (onSubtaskToggle) {
          onSubtaskToggle(taskId, index, newStatus);
        }
        
        if (refetch) {
          refetch();
        }
      } catch (error) {
        console.error("Error toggling subtask:", error);
        toast({
          title: "Failed to update subtask",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    }
  };

  const renderSubtaskItem = (item: string | NestedSubtask, index: number, parentPath: string = ''): React.ReactNode => {
    if (typeof item === 'string') {
      return (
        <li key={`${parentPath}-${index}`} className="flex items-start gap-2 ml-6">
          <Checkbox 
            id={`subtask-${taskId}-${parentPath}-${index}`}
            checked={false}
            onCheckedChange={() => {}}
            className="mt-0.5"
          />
          <label 
            htmlFor={`subtask-${taskId}-${parentPath}-${index}`}
            className="text-sm"
          >
            {item}
          </label>
        </li>
      );
    }
    
    if (item.subtasks && item.subtasks.length > 0) {
      const groupId = `${parentPath}-${index}`;
      const isExpanded = expandedGroups[groupId] !== false; // Default to expanded
      
      return (
        <li key={groupId} className="space-y-1">
          <div 
            className="flex items-start gap-2 cursor-pointer" 
            onClick={() => toggleGroup(groupId)}
          >
            <button 
              className="w-4 h-4 mt-1 flex items-center justify-center flex-shrink-0"
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse group" : "Expand group"}
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            <span className="text-sm font-medium">
              {item.title || item.content || "Group"}
            </span>
          </div>
          
          {isExpanded && item.subtasks && (
            <ul className="ml-4 space-y-1.5 mt-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
              {item.subtasks.map((subtask, i) => 
                renderSubtaskItem(subtask, i, `${groupId}`)
              )}
            </ul>
          )}
        </li>
      );
    }
    
    return (
      <li key={`${parentPath}-${index}`} className="flex items-start gap-2">
        <Checkbox 
          id={`subtask-${taskId}-${parentPath}-${index}`}
          checked={item.is_completed}
          onCheckedChange={() => {}}
          className="mt-0.5"
        />
        <label 
          htmlFor={`subtask-${taskId}-${parentPath}-${index}`}
          className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}
        >
          {item.content || item.title}
        </label>
      </li>
    );
  };

  if (!hasNestedStructure) {
    // Standard flat subtasks rendering (for backward compatibility)
    return (
      <div className="space-y-2 mt-3">
        <h4 className="text-sm font-medium">
          Subtasks ({(subtasks as SubTask[]).filter(st => st.is_completed).length}/{subtasks.length})
        </h4>
        <ul className="space-y-1.5">
          {(subtasks as SubTask[]).map((subtask, index) => (
            <li key={subtask.id || index} className="flex items-start gap-2">
              <Checkbox 
                id={`subtask-${taskId}-${index}`}
                checked={subtask.is_completed}
                onCheckedChange={() => handleSubtaskToggle(index, subtask.id)}
                className="mt-0.5"
              />
              <label 
                htmlFor={`subtask-${taskId}-${index}`}
                className={`text-sm ${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {subtask.content}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Enhanced rendering for nested subtasks with improved styling
  return (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium">
        Subtasks ({subtasks.length})
      </h4>
      <ul className="space-y-2">
        {subtasks.map((item, index) => 
          renderSubtaskItem(item, index)
        )}
      </ul>
    </div>
  );
};

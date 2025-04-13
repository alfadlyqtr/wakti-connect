import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, ListTodo, CalendarClock, AlertTriangle, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NestedSubtask } from "@/services/ai/aiTaskParserService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TaskConfirmationCardProps {
  taskInfo: ParsedTaskInfo;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskConfirmationCard: React.FC<TaskConfirmationCardProps> = ({
  taskInfo,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  // Store expanded state for groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/20 text-red-600";
      case "high": return "bg-orange-500/20 text-orange-600";
      case "medium": return "bg-yellow-500/20 text-yellow-600";
      case "normal": return "bg-blue-500/20 text-blue-600";
      default: return "bg-blue-500/20 text-blue-600";
    }
  };

  const formatDate = (dateValue?: string | Date | null) => {
    if (!dateValue) return "No due date";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let date: Date;
    
    if (dateValue instanceof Date) {
      date = new Date(dateValue);
    } else {
      date = new Date(dateValue);
    }
    
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
    
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const toggleGroupExpanded = (itemId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Render a subtask item with proper indentation and grouping
  const renderSubtaskItem = (item: string | NestedSubtask, index: number, parentPath: string = ''): React.ReactNode => {
    const itemId = `${parentPath}-${index}`;
    
    // Handle string type subtasks (simplest case)
    if (typeof item === 'string') {
      return (
        <li key={itemId} className="text-sm flex gap-2 items-start">
          <div className="h-4 w-4 mt-0.5 rounded-full border flex items-center justify-center flex-shrink-0">
            <Check className="h-2.5 w-2.5 text-muted-foreground/50" />
          </div>
          <span>{item}</span>
        </li>
      );
    }
    
    // Check if this is a group or has nested subtasks
    const isGroup = !!(item.subtasks && item.subtasks.length > 0);
    const isExpanded = expandedGroups[itemId] !== false; // Default to expanded
    
    if (isGroup) {
      return (
        <li key={itemId} className="space-y-1">
          <Collapsible 
            open={isExpanded} 
            onOpenChange={(open) => {
              setExpandedGroups(prev => ({
                ...prev,
                [itemId]: open
              }));
            }}
          >
            <div className="flex items-start gap-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0"
                  onClick={() => toggleGroupExpanded(itemId)}
                >
                  {isExpanded ? 
                    <ChevronDown className="h-3.5 w-3.5" /> : 
                    <ChevronRight className="h-3.5 w-3.5" />
                  }
                </Button>
              </CollapsibleTrigger>
              <span className="text-sm font-medium">{item.title || item.content || 'Group'}</span>
            </div>
            
            <CollapsibleContent>
              <ul className="ml-5 space-y-1.5 mt-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                {item.subtasks && item.subtasks.map((subtask, i) => 
                  renderSubtaskItem(subtask, i, itemId)
                )}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </li>
      );
    }
    
    // Regular subtask (not a group)
    return (
      <li key={itemId} className="text-sm flex gap-2 items-start">
        <div className="h-4 w-4 mt-0.5 rounded-full border flex items-center justify-center flex-shrink-0">
          <Check className="h-2.5 w-2.5 text-muted-foreground/50" />
        </div>
        <span>{item.content || item.title || 'Subtask'}</span>
      </li>
    );
  };

  // Count total number of subtasks (including nested ones)
  const countAllSubtasks = (items: (string | NestedSubtask)[]): number => {
    let count = 0;
    
    items.forEach(item => {
      if (typeof item === 'string') {
        count += 1;
      } else {
        count += 1;
        
        if (item.subtasks && item.subtasks.length > 0) {
          count += countAllSubtasks(item.subtasks);
        }
      }
    });
    
    return count;
  };

  const totalSubtasksCount = countAllSubtasks(taskInfo.subtasks);

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 animate-in fade-in-50 duration-300 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Ready to Create This Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <h3 className="font-semibold text-base">{taskInfo.title}</h3>
          {taskInfo.description && (
            <p className="text-sm text-muted-foreground mt-1">{taskInfo.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <Badge variant="outline" className={cn("py-1", getPriorityColor(taskInfo.priority || 'normal'))}>
            {(taskInfo.priority || 'normal').charAt(0).toUpperCase() + (taskInfo.priority || 'normal').slice(1)} Priority
          </Badge>
          
          <Badge variant="outline" className="py-1 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {formatDate(taskInfo.due_date)}
            {taskInfo.dueTime && ` at ${taskInfo.dueTime}`}
          </Badge>
          
          {taskInfo.location && (
            <Badge variant="outline" className="py-1 flex items-center gap-1 bg-blue-50">
              <MapPin className="h-3 w-3" />
              {taskInfo.location}
            </Badge>
          )}
        </div>
        
        {taskInfo.subtasks && taskInfo.subtasks.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Subtasks ({totalSubtasksCount})</h4>
              <ScrollArea className="max-h-40 pr-2">
                <ul className="space-y-2">
                  {taskInfo.subtasks.map((subtask, index) => renderSubtaskItem(subtask, index))}
                </ul>
              </ScrollArea>
            </div>
          </>
        )}
        
        {taskInfo.hasTimeConstraint && (
          <div className="flex items-center gap-2 text-xs text-amber-500 mt-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>This task has a time constraint</span>
          </div>
        )}
        
        {taskInfo.needsReview && (
          <div className="flex items-center gap-2 text-xs text-blue-500 mt-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Priority may need review</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onConfirm}
          disabled={isLoading}
          className="gap-1 flex-1"
        >
          {isLoading ? (
            <>
              <Clock className="h-3.5 w-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              Create Task
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

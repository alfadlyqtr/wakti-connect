
import React, { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FolderPlus, ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerField } from "./TimePickerField";
import { toast } from "@/components/ui/use-toast";
import { SubTask } from "@/types/task.types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubtasksSectionProps {
  form: UseFormReturn<TaskFormValues>;
  enableSubtasks: boolean;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({ 
  form, 
  enableSubtasks 
}) => {
  // Store expanded state for groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  // Function to add a new subtask group
  const addSubtaskGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for the subtask group",
        variant: "destructive"
      });
      return;
    }

    // Add the group as a special subtask with is_group=true
    append({ 
      content: newGroupName.trim(), 
      title: newGroupName.trim(),
      isCompleted: false, 
      dueDate: "", 
      dueTime: "",
      is_group: true,
      subtasks: []
    });
    
    setNewGroupName("");
    setShowGroupCreator(false);
  };

  // Function to add a subtask to a specific group
  const addSubtaskToGroup = (groupIndex: number) => {
    // Get the current subtasks
    const currentSubtasks = form.getValues().subtasks;
    const groupId = fields[groupIndex].id;
    
    // Find the group and add the subtask to it
    const updatedSubtasks = [...currentSubtasks];
    
    // Check if the group already has subtasks
    if (!updatedSubtasks[groupIndex].subtasks) {
      updatedSubtasks[groupIndex].subtasks = [];
    }
    
    // Add the new subtask to the group's subtasks
    updatedSubtasks[groupIndex].subtasks?.push({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      task_id: 'pending',
      content: "",
      isCompleted: false,
      parent_id: groupId,
      dueDate: "",
      dueTime: ""
    });
    
    // Update the form value with the new subtasks structure
    form.setValue('subtasks', updatedSubtasks);
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Render a subtask item with proper indentation and grouping
  const renderSubtaskItem = (field: any, index: number, parentId: string | null = null, nestLevel = 0) => {
    const isGroup = !!field.is_group;
    const hasParent = !!field.parent_id;
    const indent = hasParent ? "ml-6" : "";
    const isExpanded = expandedGroups[field.id] !== false; // Default to expanded
    
    return (
      <div key={field.id} className={`border rounded-md p-3 space-y-3 ${isGroup ? 'bg-muted/30' : indent}`}>
        <div className="flex gap-2 items-start">
          {!isGroup && (
            <FormField
              control={form.control}
              name={`subtasks.${index}.isCompleted`}
              render={({ field: checkboxField }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Checkbox
                      checked={checkboxField.value}
                      onCheckedChange={checkboxField.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          {isGroup && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 mt-1"
              onClick={() => toggleGroupExpansion(field.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <FormField
            control={form.control}
            name={`subtasks.${index}.content`}
            render={({ field: contentField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder={isGroup ? "Group name" : "Subtask description"}
                    {...contentField}
                    className={isGroup ? "font-medium" : ""}
                    onChange={(e) => {
                      contentField.onChange(e);
                      // If this is a group, also update the title field
                      if (isGroup) {
                        const currentSubtasks = form.getValues().subtasks;
                        const updatedSubtasks = [...currentSubtasks];
                        updatedSubtasks[index].title = e.target.value;
                        form.setValue('subtasks', updatedSubtasks);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {isGroup && (
          <Collapsible open={isExpanded} onOpenChange={() => toggleGroupExpansion(field.id)}>
            <CollapsibleContent>
              {/* Render nested subtasks if this is a group */}
              {field.subtasks && field.subtasks.length > 0 && (
                <div className="space-y-3 ml-6 mt-3">
                  {field.subtasks.map((subtask: any, subIndex: number) => (
                    <div key={subtask.id} className="border rounded-md p-3 space-y-3">
                      <div className="flex gap-2 items-start">
                        <FormField
                          control={form.control}
                          name={`subtasks.${index}.subtasks.${subIndex}.isCompleted`}
                          render={({ field: checkboxField }) => (
                            <FormItem className="mt-2">
                              <FormControl>
                                <Checkbox
                                  checked={checkboxField.value}
                                  onCheckedChange={checkboxField.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`subtasks.${index}.subtasks.${subIndex}.content`}
                          render={({ field: contentField }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Subtask description"
                                  {...contentField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentSubtasks = form.getValues().subtasks;
                            const updatedSubtasks = [...currentSubtasks];
                            updatedSubtasks[index].subtasks = updatedSubtasks[index].subtasks?.filter(
                              (_: any, i: number) => i !== subIndex
                            );
                            form.setValue('subtasks', updatedSubtasks);
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSubtaskToGroup(index)}
                className="w-full mt-3"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Subtask to Group
              </Button>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {!isGroup && !hasParent && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Due Date for Subtask */}
            <FormField
              control={form.control}
              name={`subtasks.${index}.dueDate`}
              render={({ field: dueDateField }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs">Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal text-sm h-8",
                            !dueDateField.value && "text-muted-foreground"
                          )}
                        >
                          {dueDateField.value ? (
                            format(new Date(dueDateField.value), "PPP")
                          ) : (
                            <span>Optional</span>
                          )}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDateField.value ? new Date(dueDateField.value) : undefined}
                        onSelect={(date) => dueDateField.onChange(date?.toISOString() || "")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            
            {/* Due Time for Subtask */}
            <TimePickerField 
              form={form} 
              name={`subtasks.${index}.dueTime`} 
              label="Due Time" 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="enableSubtasks"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Enable Subtasks</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {enableSubtasks && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Subtasks</h3>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ content: "", isCompleted: false, dueDate: "", dueTime: "" })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Subtask
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowGroupCreator(true)}
              >
                <FolderPlus className="h-4 w-4 mr-1" /> Add Group
              </Button>
            </div>
          </div>
          
          {showGroupCreator && (
            <div className="flex items-center gap-2 border rounded p-3">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={addSubtaskGroup}
              >
                Add Group
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowGroupCreator(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {fields.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-2">
              No subtasks added yet
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                renderSubtaskItem(field, index)
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

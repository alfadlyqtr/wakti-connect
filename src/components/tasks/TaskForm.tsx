
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskFormValues } from "./TaskFormSchema";
import TaskFormFields from "./form-fields/TaskFormFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurringTab } from "./tabs/RecurringTab";
import { Task } from "@/types/task.types";

export interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  defaultValues?: Partial<TaskFormValues>;
  isCreate?: boolean;
  task?: Task;
  isPaidUser: boolean; // Add this prop to match usage in CreateTaskDialog
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  defaultValues,
  isCreate = false,
  task,
  isPaidUser = false
}) => {
  const [activeTab, setActiveTab] = React.useState("basic");
  
  // Initialize the form with default values
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "normal",
      due_date: new Date().toISOString().split("T")[0],
      due_time: "",
      subtasks: [],
      enableSubtasks: false,
      isRecurring: false,
      recurring: {
        frequency: "weekly",
        interval: 1
      },
      ...defaultValues
    }
  });
  
  // Watch isRecurring field to conditionally show recurring tab
  const isRecurring = form.watch("isRecurring");

  // Handle form submission
  const handleSubmit = async (values: TaskFormValues) => {
    try {
      await onSubmit(values);
      if (isCreate) {
        form.reset(); // Reset the form after successful creation
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="recurring" disabled={!isPaidUser}>
              Recurring
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <TaskFormFields form={form} />
          </TabsContent>
          
          <TabsContent value="recurring">
            <RecurringTab 
              form={form} 
              isPaidAccount={isPaidUser} 
              isRecurring={isRecurring} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit">
            {isCreate ? "Create Task" : "Update Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

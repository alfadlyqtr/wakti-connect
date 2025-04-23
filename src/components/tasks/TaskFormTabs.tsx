import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { TaskDetailsTab } from "./tabs/TaskDetailsTab";
import { SubtasksTab } from "./tabs/SubtasksTab";
import { RecurringTab } from "./tabs/RecurringTab";

interface TaskFormTabsProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  userRole: "free" | "individual" | "business" | "staff";
  submitLabel: string;
}

export function TaskFormTabs({
  form,
  onSubmit,
  isSubmitting,
  isRecurring,
  setIsRecurring,
  userRole,
  submitLabel
}: TaskFormTabsProps) {
  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";
  const enableSubtasks = form.watch("enableSubtasks");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="subtasks" disabled={!enableSubtasks}>
              Subtasks
              {!enableSubtasks && <span className="ml-1 text-xs">(Disabled)</span>}
            </TabsTrigger>
            <TabsTrigger value="recurring" disabled={!isPaidAccount}>
              Recurring Options
              {!isPaidAccount && <span className="ml-1 text-xs">(Pro)</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <TaskDetailsTab 
              form={form}
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              isPaidAccount={isPaidAccount}
            />
          </TabsContent>
          <TabsContent value="subtasks">
            {enableSubtasks && (
              <SubtasksTab 
                form={form}
                enableSubtasks={enableSubtasks}
              />
            )}
            {!enableSubtasks && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Enable subtasks on the Details tab to use this feature.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="recurring">
            <RecurringTab 
              form={form}
              isPaidAccount={isPaidAccount}
              isRecurring={isRecurring}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

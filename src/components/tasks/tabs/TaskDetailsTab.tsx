
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock } from "lucide-react";
import { TimePickerField } from "../form-fields/TimePickerField";
import { useTranslation } from "react-i18next";

interface TaskDetailsTabProps {
  form: UseFormReturn<any>;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  isPaidAccount: boolean;
}

export function TaskDetailsTab({
  form,
  isRecurring,
  setIsRecurring,
  isPaidAccount
}: TaskDetailsTabProps) {
  // Watch enableSubtasks value
  const enableSubtasks = form.watch("enableSubtasks");
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 pt-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("task.taskTitle")}</FormLabel>
            <FormControl>
              <Input placeholder={t("task.enterTaskTitle")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("task.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("task.enterTaskDescription")}
                className="resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("task.priority.priority")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("task.selectPriority")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="urgent">{t("task.priority.urgent")}</SelectItem>
                <SelectItem value="high">{t("task.priority.high")}</SelectItem>
                <SelectItem value="medium">{t("task.priority.medium")}</SelectItem>
                <SelectItem value="normal">{t("task.priority.normal")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {t("task.dueDate")}
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <TimePickerField 
          form={form} 
          name="dueTime"
          label={t("task.dueTime")}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
        {isPaidAccount && (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                id="recurring-switch"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </FormControl>
            <FormLabel
              htmlFor="recurring-switch"
              className="cursor-pointer font-medium"
            >
              {t("task.makingRecurring")}
            </FormLabel>
          </FormItem>
        )}
        
        <FormField
          control={form.control}
          name="enableSubtasks"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-medium">
                {t("task.enableSubtasks")}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

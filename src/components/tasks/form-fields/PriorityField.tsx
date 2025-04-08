
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface PriorityFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export const PriorityField: React.FC<PriorityFieldProps> = ({ form }) => {
  const { t } = useTranslation();
  
  // This ensures we're rendering the translated text directly in the UI
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case "urgent": return t("task.priority.urgent");
      case "high": return t("task.priority.high");
      case "medium": return t("task.priority.medium");
      case "normal": return t("task.priority.normal");
      default: return t("task.selectPriority");
    }
  };

  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('task.priority.priority')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue>
                  {field.value ? getPriorityLabel(field.value) : t('task.selectPriority')}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="urgent">{t('task.priority.urgent')}</SelectItem>
              <SelectItem value="high">{t('task.priority.high')}</SelectItem>
              <SelectItem value="medium">{t('task.priority.medium')}</SelectItem>
              <SelectItem value="normal">{t('task.priority.normal')}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

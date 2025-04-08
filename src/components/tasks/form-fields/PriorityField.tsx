
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
  
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('task.priority.priority', 'Priority')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('task.selectPriority', 'Select priority')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="urgent">{t('task.priority.urgent', 'Urgent')}</SelectItem>
              <SelectItem value="high">{t('task.priority.high', 'High')}</SelectItem>
              <SelectItem value="medium">{t('task.priority.medium', 'Medium')}</SelectItem>
              <SelectItem value="normal">{t('task.priority.normal', 'Normal')}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

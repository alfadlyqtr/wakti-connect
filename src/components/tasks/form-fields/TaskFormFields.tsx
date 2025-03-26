
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { BasicFields } from "./BasicFields";
import { DateTimeFields } from "./DateTimeFields";
import { SubtasksSection } from "./SubtasksSection";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form }) => {
  const enableSubtasks = form.watch("enableSubtasks");

  return (
    <>
      {/* Basic task information */}
      <BasicFields form={form} />
      
      {/* Date and time fields */}
      <DateTimeFields form={form} />
      
      {/* Subtasks Section */}
      <SubtasksSection 
        form={form}
        enableSubtasks={enableSubtasks}
      />
    </>
  );
};

export default TaskFormFields;

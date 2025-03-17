
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "./AppointmentFormSchema";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { DateTimeFields } from "./form-fields/DateTimeFields";

interface AppointmentFormFieldsProps {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean;
}

export const AppointmentFormFields: React.FC<AppointmentFormFieldsProps> = ({ form, disabled = false }) => {
  return (
    <>
      <BasicInfoFields form={form} disabled={disabled} />
      <DateTimeFields form={form} disabled={disabled} />
    </>
  );
};

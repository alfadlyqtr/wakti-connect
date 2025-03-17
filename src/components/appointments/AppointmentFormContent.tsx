
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "./AppointmentFormSchema";
import { AppointmentFormFields } from "./AppointmentFormFields";
import RecurringFormFields from "@/components/recurring/RecurringFormFields";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppointmentFormContentProps {
  form: UseFormReturn<AppointmentFormValues>;
  isPaidAccount: boolean;
  isSubmitting: boolean;
  userRole: "free" | "individual" | "business";
}

export function AppointmentFormContent({ 
  form, 
  isPaidAccount, 
  isSubmitting,
  userRole
}: AppointmentFormContentProps) {
  const [isRecurring, setIsRecurring] = useState(false);
  
  return (
    <>
      <AppointmentFormFields form={form} disabled={!isPaidAccount || isSubmitting} />
      
      <div className="flex items-center space-x-2 pt-4 border-t">
        <Switch
          id="recurring-appointment"
          checked={isRecurring}
          onCheckedChange={(checked) => {
            setIsRecurring(checked);
            form.setValue("isRecurring", checked);
          }}
          disabled={!isPaidAccount || isSubmitting}
        />
        <Label htmlFor="recurring-appointment">
          Make this a recurring appointment {!isPaidAccount && "(Premium)"}
        </Label>
      </div>
      
      {isRecurring && <RecurringFormFields form={form} userRole={userRole} disabled={isSubmitting} />}
    </>
  );
}

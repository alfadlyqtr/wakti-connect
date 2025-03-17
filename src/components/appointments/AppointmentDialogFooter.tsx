
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AppointmentDialogFooterProps {
  isSubmitting: boolean;
  isPaidAccount: boolean;
  hasAttemptedSubmit: boolean;
  hasReachedMonthlyLimit?: boolean;
}

export function AppointmentDialogFooter({
  isSubmitting,
  isPaidAccount,
  hasAttemptedSubmit,
  hasReachedMonthlyLimit = false
}: AppointmentDialogFooterProps) {
  return (
    <DialogFooter className="pt-4">
      <DialogClose asChild>
        <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
      </DialogClose>
      <Button 
        type="submit" 
        disabled={!isPaidAccount || isSubmitting || hasReachedMonthlyLimit}
        className={!isPaidAccount ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Appointment"
        )}
      </Button>
      
      {hasAttemptedSubmit && !isPaidAccount && (
        <p className="text-destructive text-sm mt-2">
          This feature is only available for Individual and Business plans. Please upgrade to create appointments.
        </p>
      )}
      
      {hasAttemptedSubmit && hasReachedMonthlyLimit && (
        <p className="text-destructive text-sm mt-2">
          You've reached your monthly limit of 1 appointment. Upgrade to create more.
        </p>
      )}
    </DialogFooter>
  );
}

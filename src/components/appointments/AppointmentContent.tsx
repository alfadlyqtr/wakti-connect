
import React from "react";
import { Appointment } from "@/types/appointment.types";
import AppointmentGrid from "@/components/appointments/AppointmentGrid";
import EmptyAppointmentsState from "@/components/appointments/EmptyAppointmentsState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { MonthlyUsage } from "@/services/appointment";

interface AppointmentContentProps {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
  tab: string;
  onCreateAppointment: () => void;
  isPaidAccount: boolean;
  monthlyUsage?: MonthlyUsage;
  hasReachedMonthlyLimit?: boolean;
}

const AppointmentContent: React.FC<AppointmentContentProps> = ({
  appointments,
  userRole,
  tab,
  onCreateAppointment,
  isPaidAccount,
  monthlyUsage,
  hasReachedMonthlyLimit = false,
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      {/* Show usage information for free accounts */}
      {userRole === "free" && monthlyUsage && (
        <Alert className="mb-4 bg-muted">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            You have created {monthlyUsage.appointments_created}/1 appointments this month.
            {hasReachedMonthlyLimit && " You've reached your monthly limit. Upgrade for unlimited appointments."}
          </AlertDescription>
        </Alert>
      )}

      {appointments.length > 0 ? (
        <AppointmentGrid 
          appointments={appointments} 
          userRole={userRole} 
          tab={tab as any}
        />
      ) : (
        <EmptyAppointmentsState 
          isPaidAccount={isPaidAccount} 
          onCreateAppointment={onCreateAppointment} 
          tab={tab as any}
          hasReachedMonthlyLimit={hasReachedMonthlyLimit}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default AppointmentContent;

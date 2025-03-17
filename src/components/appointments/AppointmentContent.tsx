
import React from "react";
import { Appointment } from "@/types/appointment.types";
import AppointmentGrid from "@/components/appointments/AppointmentGrid";
import EmptyAppointmentsState from "@/components/appointments/EmptyAppointmentsState";

interface AppointmentContentProps {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
  tab: string;
  onCreateAppointment: () => void;
  isPaidAccount: boolean;
}

const AppointmentContent: React.FC<AppointmentContentProps> = ({
  appointments,
  userRole,
  tab,
  onCreateAppointment,
  isPaidAccount,
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
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
        />
      )}
    </div>
  );
};

export default AppointmentContent;


import React from "react";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { Appointment } from "@/hooks/useAppointments";

interface AppointmentGridProps {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business" | null;
}

const AppointmentGrid = ({ appointments, userRole }: AppointmentGridProps) => {
  if (appointments.length === 0) return null;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          id={appointment.id}
          title={appointment.title}
          dateTime={new Date(appointment.start_time)}
          location={appointment.location || ""}
          status="confirmed" // This would be dynamic in a real implementation
          userRole={userRole || "free"}
        />
      ))}
    </div>
  );
};

export default AppointmentGrid;

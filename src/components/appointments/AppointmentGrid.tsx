
import React from "react";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { Appointment, AppointmentTab } from "@/types/appointment.types";

interface AppointmentGridProps {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
  tab: AppointmentTab;
}

const AppointmentGrid = ({ appointments, userRole, tab }: AppointmentGridProps) => {
  if (appointments.length === 0) return null;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={{
            id: appointment.id,
            title: appointment.title,
            description: appointment.description || "",
            startTime: new Date(appointment.start_time),
            endTime: new Date(appointment.end_time),
            location: appointment.location || "",
            isAllDay: appointment.is_all_day
          }}
          isAssigned={tab === "assigned-appointments"}
          isShared={tab === "shared-appointments"}
        />
      ))}
    </div>
  );
};

export default AppointmentGrid;

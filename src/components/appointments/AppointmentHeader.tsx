
import React from "react";

const AppointmentHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
      <p className="text-muted-foreground">
        Schedule and manage your appointments.
      </p>
    </div>
  );
};

export default AppointmentHeader;


import React from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmptyAppointmentsStateProps {
  isPaidAccount: boolean;
  onCreateAppointment: () => void;
}

const EmptyAppointmentsState = ({ isPaidAccount, onCreateAppointment }: EmptyAppointmentsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-12">
      <Calendar className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No appointments scheduled</h3>
      <p className="text-center text-sm text-muted-foreground max-w-xs">
        {isPaidAccount 
          ? "You haven't scheduled any appointments yet. Create a new appointment to get started."
          : "Free accounts can only view appointments. Upgrade to create and manage appointments."}
      </p>
      {isPaidAccount ? (
        <Button onClick={onCreateAppointment} className="flex items-center gap-2">
          <Plus size={16} />
          Schedule Appointment
        </Button>
      ) : (
        <div className="text-center">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 mb-2">
            View Only
          </Badge>
          <p className="text-xs text-muted-foreground">
            Upgrade to create and manage appointments
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyAppointmentsState;

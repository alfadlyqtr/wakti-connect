
import React from "react";
import { Calendar, Plus, Share2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentTab } from "@/hooks/useAppointments";

interface EmptyAppointmentsStateProps {
  isPaidAccount: boolean;
  onCreateAppointment: () => void;
  tab: AppointmentTab;
}

const EmptyAppointmentsState = ({ isPaidAccount, onCreateAppointment, tab }: EmptyAppointmentsStateProps) => {
  // Different content based on the current tab
  const content = {
    "my-appointments": {
      icon: <Calendar className="h-12 w-12 text-muted-foreground" />,
      title: "No Appointments Created Yet",
      description: "Create your first appointment to get started with scheduling.",
      buttonText: "Create Appointment"
    },
    "shared-appointments": {
      icon: <Share2 className="h-12 w-12 text-muted-foreground" />,
      title: "No Shared Appointments",
      description: "You don't have any appointments shared with you yet.",
      buttonText: "Create Appointment"
    },
    "assigned-appointments": {
      icon: <UserCheck className="h-12 w-12 text-muted-foreground" />,
      title: "No Assigned Appointments",
      description: "You don't have any appointments assigned to you yet.",
      buttonText: "Assign Appointment"
    }
  };
  
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      {content[tab].icon}
      
      <h3 className="mt-4 text-lg font-semibold">
        {content[tab].title}
      </h3>
      
      <p className="mt-2 text-muted-foreground max-w-sm">
        {content[tab].description}
      </p>
      
      {isPaidAccount && (
        <Button onClick={onCreateAppointment} className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          {content[tab].buttonText}
        </Button>
      )}
      
      {!isPaidAccount && (
        <div className="mt-4 text-sm text-muted-foreground">
          Upgrade to Individual or Business plan to create and manage appointments.
        </div>
      )}
    </div>
  );
};

export default EmptyAppointmentsState;

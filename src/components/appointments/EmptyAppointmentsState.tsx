
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, ArrowUpRight } from "lucide-react";
import { AppointmentTab } from "@/types/appointment.types";
import { Link } from "react-router-dom";

interface EmptyAppointmentsStateProps {
  isPaidAccount: boolean;
  onCreateAppointment: () => void;
  tab: AppointmentTab;
  hasReachedMonthlyLimit?: boolean;
  userRole: "free" | "individual" | "business";
}

const EmptyAppointmentsState: React.FC<EmptyAppointmentsStateProps> = ({
  isPaidAccount,
  onCreateAppointment,
  tab,
  hasReachedMonthlyLimit = false,
  userRole
}) => {
  const getMessage = () => {
    switch (tab) {
      case "my-appointments":
        return "You don't have any appointments yet.";
      case "shared-appointments":
        return "No one has shared any appointments with you yet.";
      case "assigned-appointments":
        return "You don't have any assigned appointments yet.";
      case "team-appointments":
        return "Your team doesn't have any appointments yet.";
      case "upcoming":
        return "You don't have any upcoming appointments.";
      case "past":
        return "You don't have any past appointments.";
      case "invitations":
        return "You don't have any appointment invitations.";
      default:
        return "No appointments found.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
        <CalendarDays className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{getMessage()}</h3>
      
      {tab === "my-appointments" && (
        <div className="flex flex-col space-y-2">
          {userRole === "free" && hasReachedMonthlyLimit ? (
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-sm">
                You've reached your monthly limit of 1 appointment.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/upgrade">
                  Upgrade for Unlimited Appointments <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <Button onClick={onCreateAppointment} disabled={hasReachedMonthlyLimit}>
              <Plus className="mr-2 h-4 w-4" /> Create Appointment
            </Button>
          )}
          
          {userRole === "free" && !hasReachedMonthlyLimit && (
            <p className="text-muted-foreground text-xs text-center">
              Free accounts can create 1 appointment per month.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyAppointmentsState;

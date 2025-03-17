
import React, { useState } from "react";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentTab } from "@/types/appointment.types";
import { Send } from "lucide-react";
import SendInvitationDialog from "@/components/invitations/SendInvitationDialog";

interface AppointmentGridProps {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
  tab: AppointmentTab;
}

const AppointmentGrid: React.FC<AppointmentGridProps> = ({ 
  appointments, 
  userRole,
  tab
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);

  const handleSendInvitation = (appointment: Appointment) => {
    if (userRole === 'free') {
      return;
    }
    
    setSelectedAppointment(appointment);
    setIsInvitationDialogOpen(true);
  };

  const canSendInvitations = userRole === 'individual' || userRole === 'business';
  const showInviteButton = (appointment: Appointment) => {
    // Only show invite button for appointments the user created
    return canSendInvitations && appointment.user_id === localStorage.getItem('userId');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((appointment) => {
          const startTime = new Date(appointment.start_time);
          const endTime = new Date(appointment.end_time);
          
          return (
            <div key={appointment.id} className="relative group">
              <AppointmentCard
                id={appointment.id}
                title={appointment.title}
                description={appointment.description || undefined}
                location={appointment.location || undefined}
                startTime={startTime}
                endTime={endTime}
                isAllDay={appointment.is_all_day}
                status={appointment.status}
                isRecurring={false}
                isRecurringInstance={appointment.is_recurring_instance}
                isAssigned={tab === 'assigned-appointments'}
                isShared={tab === 'shared-appointments'}
              />
              
              {showInviteButton(appointment) && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-md">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => handleSendInvitation(appointment)}
                  >
                    <Send className="h-4 w-4" />
                    Send Invitation
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedAppointment && (
        <SendInvitationDialog
          open={isInvitationDialogOpen}
          onOpenChange={setIsInvitationDialogOpen}
          appointment={selectedAppointment}
          onInvitationsSent={() => {}}
        />
      )}
    </div>
  );
};

export default AppointmentGrid;

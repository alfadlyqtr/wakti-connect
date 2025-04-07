
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Event, EventInvitation } from '@/types/event.types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface EventViewResponsesProps {
  event: Event;
  onClose?: () => void;
}

const EventViewResponses: React.FC<EventViewResponsesProps> = ({ event, onClose }) => {
  const { t } = useTranslation();
  const hasInvitations = event.invitations && event.invitations.length > 0;
  
  // Count responses by status
  const responseCounts = {
    accepted: event.invitations?.filter(inv => inv.status === 'accepted').length || 0,
    declined: event.invitations?.filter(inv => inv.status === 'declined').length || 0,
    pending: event.invitations?.filter(inv => inv.status === 'pending').length || 0,
    total: event.invitations?.length || 0
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <p className="text-muted-foreground">
            {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
            {!event.is_all_day && (
              <span> · {format(new Date(event.start_time), "h:mm a")} - {format(new Date(event.end_time), "h:mm a")}</span>
            )}
          </p>
        </div>
        
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn(
          "p-4 rounded-lg border flex items-center gap-3",
          "bg-green-50 border-green-100"
        )}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("events.accepted")}</p>
            <p className="text-2xl font-bold">{responseCounts.accepted}</p>
          </div>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border flex items-center gap-3",
          "bg-red-50 border-red-100"
        )}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("events.declined")}</p>
            <p className="text-2xl font-bold">{responseCounts.declined}</p>
          </div>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border flex items-center gap-3",
          "bg-yellow-50 border-yellow-100"
        )}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-yellow-100">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("events.pending")}</p>
            <p className="text-2xl font-bold">{responseCounts.pending}</p>
          </div>
        </div>
      </div>
      
      {hasInvitations ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted py-3 px-4 font-medium">
            {t("events.invitedParticipants")} ({responseCounts.total})
          </div>
          
          <div className="divide-y">
            {event.invitations?.map((invitation) => (
              <InvitationRow key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">{t("events.noInvitations")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("events.noInvitationsDesc")}
          </p>
        </div>
      )}
    </div>
  );
};

const InvitationRow: React.FC<{ invitation: EventInvitation }> = ({ invitation }) => {
  const { t } = useTranslation();
  const { email, invited_user_id, status } = invitation;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'accepted':
        return <span className="text-green-600">{t("events.accepted")}</span>;
      case 'declined':
        return <span className="text-red-600">{t("events.declined")}</span>;
      default:
        return <span className="text-yellow-600">{t("events.pending")}</span>;
    }
  };
  
  return (
    <div className="py-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{(email?.[0] || 'U').toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{email || `User ${invited_user_id?.substring(0, 6)}`}</p>
          <p className="text-sm text-muted-foreground">
            {email ? t("events.emailInvitation") : t("events.appUser")}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default EventViewResponses;


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SimpleInvitationsList from '@/components/invitations/SimpleInvitationsList';
import { fetchSimpleInvitations } from '@/services/invitation/invitation-api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DashboardEvents = () => {
  const { user } = useAuth?.() || { user: null };
  
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['simple-invitations', user?.id],
    queryFn: () => fetchSimpleInvitations(user?.id || '', true),
    enabled: !!user?.id
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Link to="/invitations/create">
          <Button>Create New Event</Button>
        </Link>
      </div>
      <SimpleInvitationsList isEventsList={true} />
    </div>
  );
};

export default DashboardEvents;

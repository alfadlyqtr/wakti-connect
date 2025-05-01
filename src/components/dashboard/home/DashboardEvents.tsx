
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SimpleInvitationsList from '@/components/invitations/SimpleInvitationsList';
import { fetchSimpleInvitations } from '@/services/invitation/invitation-api';
import { useAuth } from '@/lib/auth';

const DashboardEvents = () => {
  const { user } = useAuth?.() || { user: null };
  
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['simple-invitations', user?.id],
    queryFn: () => fetchSimpleInvitations(user?.id || '', true),
    enabled: !!user?.id
  });

  return <SimpleInvitationsList isEventsList={true} />;
};

export default DashboardEvents;

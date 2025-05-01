
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSimpleInvitations } from '@/services/invitation/invitation-api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

const SimpleInvitationsList: React.FC<SimpleInvitationsListProps> = ({ isEventsList = false }) => {
  const { user } = useAuth?.() || { user: null };
  
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['simple-invitations', user?.id, isEventsList],
    queryFn: () => fetchSimpleInvitations(user?.id || '', isEventsList),
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center">Error loading {isEventsList ? 'events' : 'invitations'}</div>;
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No {isEventsList ? 'events' : 'invitations'} found</h3>
        <p className="text-muted-foreground mb-6">
          Create your first {isEventsList ? 'event' : 'invitation'} to get started.
        </p>
        <Link to={isEventsList ? "/invitations/create?isEvent=true" : "/invitations/create"}>
          <Button>
            Create {isEventsList ? 'Event' : 'Invitation'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My {isEventsList ? 'Events' : 'Invitations'}</h2>
        <Link to={isEventsList ? "/invitations/create?isEvent=true" : "/invitations/create"}>
          <Button>Create New {isEventsList ? 'Event' : 'Invitation'}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invitations.map((invitation) => (
          <Card key={invitation.id} className="p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium truncate">{invitation.title}</h3>
            <p className="text-muted-foreground text-sm truncate mb-3">
              {invitation.description || 'No description'}
            </p>
            {invitation.date && (
              <p className="text-sm">
                {new Date(invitation.date).toLocaleDateString()}
                {invitation.time && ` at ${invitation.time}`}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Link to={`/invitations/edit/${invitation.id}`} className="flex-1">
                <Button variant="outline" className="w-full">Edit</Button>
              </Link>
              {invitation.shareId && (
                <Link to={`/invitation/${invitation.shareId}`} className="flex-1">
                  <Button variant="secondary" className="w-full">View</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimpleInvitationsList;

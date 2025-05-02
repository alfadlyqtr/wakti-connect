
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSimpleInvitations } from '@/services/invitation/simple-invitations';
import { useNavigate } from 'react-router-dom';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CalendarDays } from 'lucide-react';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

const SimpleInvitationsList: React.FC<SimpleInvitationsListProps> = ({ isEventsList = false }) => {
  const navigate = useNavigate();
  const pageTitle = isEventsList ? "Events" : "Invitations";
  const createLabel = isEventsList ? "New Event" : "New Invitation";
  const createPath = isEventsList ? "/dashboard/events/new" : "/dashboard/invitations/new";

  // Fetch invitations or events
  const { data: invitations, isLoading, error, refetch } = useQuery({
    queryKey: ['simple-invitations', isEventsList],
    queryFn: () => fetchSimpleInvitations(isEventsList),
  });

  const handleCreateNew = () => {
    navigate(createPath);
  };

  const handleEdit = (id: string) => {
    navigate(isEventsList ? `/dashboard/events/edit/${id}` : `/dashboard/invitations/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        </div>
        <div className="p-8 text-center">
          <p>Loading {isEventsList ? 'events' : 'invitations'}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              Error loading {isEventsList ? 'events' : 'invitations'}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle className="mt-2">No {isEventsList ? 'Events' : 'Invitations'} Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-muted-foreground mb-4">
              You haven't created any {isEventsList ? 'events' : 'invitations'} yet.
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              {createLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {createLabel}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitations.map((invitation) => (
          <EventCard
            key={invitation.id}
            event={{
              id: invitation.id,
              title: invitation.title,
              description: invitation.description,
              location: invitation.location,
              location_title: invitation.locationTitle,
              start_time: invitation.date ? `${invitation.date}T${invitation.time || '00:00'}` : '',
              end_time: '',
              is_all_day: !invitation.time,
              status: 'published',
              user_id: invitation.userId,
              created_at: invitation.createdAt,
              updated_at: invitation.updatedAt || '',
              customization: invitation.customization,
              shareId: invitation.shareId
            }}
            onEdit={() => handleEdit(invitation.id)}
            refreshEvents={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleInvitationsList;

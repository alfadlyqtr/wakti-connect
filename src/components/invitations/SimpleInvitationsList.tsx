
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSimpleInvitations } from '@/services/invitation/simple-invitations';
import { useAuth } from '@/lib/auth';
import { Plus } from 'lucide-react';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

export default function SimpleInvitationsList({ isEventsList = false }: SimpleInvitationsListProps) {
  const navigate = useNavigate();
  const { user } = useAuth?.() || { user: null };
  
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['simple-invitations', user?.id, isEventsList],
    queryFn: () => fetchSimpleInvitations(user?.id || '', isEventsList),
    enabled: !!user?.id,
  });
  
  const handleCreateNew = () => {
    navigate(isEventsList ? '/dashboard/events/new' : '/dashboard/invitations/new');
  };
  
  const handleEdit = (id: string) => {
    navigate(isEventsList ? `/dashboard/events/edit/${id}` : `/dashboard/invitations/edit/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEventsList ? 'Events' : 'Invitations'}</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New {isEventsList ? 'Event' : 'Invitation'}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading {isEventsList ? 'events' : 'invitations'}. Please try again.
        </div>
      ) : invitations && invitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <div 
                className="h-32 bg-cover bg-center" 
                style={{ 
                  background: 
                    invitation.customization.background.type === 'image' 
                      ? `url(${invitation.customization.background.value}) center/cover` 
                      : invitation.customization.background.type === 'gradient'
                      ? invitation.customization.background.value
                      : invitation.customization.background.value
                }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{invitation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{invitation.description}</p>
                {(invitation.date || invitation.location) && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    {invitation.date && (
                      <p>{new Date(invitation.date).toLocaleDateString()}</p>
                    )}
                    {invitation.location && (
                      <p>{invitation.locationTitle || invitation.location}</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEdit(invitation.id)}
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No {isEventsList ? 'events' : 'invitations'} found
          </p>
          <Button onClick={handleCreateNew}>
            Create Your First {isEventsList ? 'Event' : 'Invitation'}
          </Button>
        </div>
      )}
    </div>
  );
}

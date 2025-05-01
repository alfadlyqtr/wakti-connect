import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar, Loader2, Search } from 'lucide-react';
import { SimpleInvitation } from '@/types/invitation.types';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { fetchSimpleInvitations } from '@/services/invitation/simple-invitations';
import { useQuery } from '@tanstack/react-query';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

export default function SimpleInvitationsList({ isEventsList = false }: SimpleInvitationsListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const entityType = isEventsList ? 'event' : 'invitation';
  const entityTypeCaps = isEventsList ? 'Event' : 'Invitation';
  
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['simple-invitations', isEventsList],
    queryFn: () => fetchSimpleInvitations(isEventsList),
  });
  
  // Filter invitations based on search term
  const filteredInvitations = invitations?.filter(invitation =>
    invitation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invitation.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleCreateNew = () => {
    if (isEventsList) {
      navigate('/dashboard/events/new');
    } else {
      navigate('/dashboard/invitations/new');
    }
  };
  
  const handleEditItem = (id: string) => {
    if (isEventsList) {
      navigate(`/dashboard/events/edit/${id}`);
    } else {
      navigate(`/dashboard/invitations/edit/${id}`);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {isEventsList ? 'Events' : 'Invitations'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEventsList 
              ? 'Create and manage your events'
              : 'Create and manage your invitations'
            }
          </p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New {entityTypeCaps}
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder={`Search ${entityType}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              There was an error loading your {entityType}s.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredInvitations && filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvitations.map((invitation) => (
            <Card 
              key={invitation.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEditItem(invitation.id)}
            >
              <div 
                className="h-24 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center"
                style={{
                  background: invitation.customization?.background.type === 'image' 
                    ? `url(${invitation.customization.background.value}) center/cover` 
                    : invitation.customization?.background.type === 'gradient' 
                      ? invitation.customization.background.value 
                      : invitation.customization?.background.value || '#f3f4f6'
                }}
              >
                <Calendar className="h-12 w-12 text-white drop-shadow-md opacity-75" />
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-1 line-clamp-1">{invitation.title}</h3>
                {invitation.date && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {format(new Date(invitation.date), 'MMMM d, yyyy')}
                    {invitation.time && ` at ${invitation.time}`}
                  </p>
                )}
                {invitation.locationTitle && (
                  <p className="text-sm text-muted-foreground">
                    Location: {invitation.locationTitle}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No {entityType}s found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No ${entityType}s match your search criteria.` 
                : `You haven't created any ${entityType}s yet.`
              }
            </p>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First {entityTypeCaps}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

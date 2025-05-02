
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trash, Edit, ExternalLink, Plus } from 'lucide-react';
import { SimpleInvitation } from '@/types/invitation.types';
import { deleteSimpleInvitation, fetchSimpleInvitations } from '@/services/invitation/simple-invitations';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

const SimpleInvitationsList: React.FC<SimpleInvitationsListProps> = ({ isEventsList = false }) => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<SimpleInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, [isEventsList]);

  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const items = await fetchSimpleInvitations(isEventsList);
      setInvitations(items || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedInvitationId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvitationId) return;

    try {
      const success = await deleteSimpleInvitation(selectedInvitationId);
      if (success) {
        setInvitations(invitations.filter(inv => inv.id !== selectedInvitationId));
        toast({
          title: 'Success',
          description: `${isEventsList ? 'Event' : 'Invitation'} deleted successfully`,
        });
      }
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete invitation',
        variant: 'destructive',
      });
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedInvitationId(null);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/${isEventsList ? 'events' : 'invitations'}/edit/${id}`);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEventsList ? 'My Events' : 'My Invitations'}
          </h1>
          <p className="text-muted-foreground">
            {isEventsList
              ? 'Manage and share your events'
              : 'Create and manage your digital invitations'}
          </p>
        </div>
        <Button onClick={() => navigate(`/dashboard/${isEventsList ? 'events' : 'invitations'}/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New {isEventsList ? 'Event' : 'Invitation'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {invitations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  No {isEventsList ? 'events' : 'invitations'} found
                </h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any {isEventsList ? 'events' : 'invitations'} yet.
                </p>
                <Button onClick={() => navigate(`/dashboard/${isEventsList ? 'events' : 'invitations'}/new`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create {isEventsList ? 'Event' : 'Invitation'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="overflow-hidden flex flex-col">
                  <div
                    className="h-24 w-full"
                    style={{
                      backgroundColor: invitation.customization.background.type === 'solid' 
                        ? invitation.customization.background.value 
                        : '#f3f4f6',
                      backgroundImage: invitation.customization.background.type === 'image'
                        ? `url(${invitation.customization.background.value})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{invitation.title}</CardTitle>
                    {invitation.fromName && (
                      <CardDescription>From: {invitation.fromName}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    {invitation.date && (
                      <div className="flex items-start gap-2 mb-2">
                        <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {format(new Date(invitation.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    {invitation.time && (
                      <div className="flex items-start gap-2 mb-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {invitation.time}
                          {invitation.endTime ? ` - ${invitation.endTime}` : ''}
                        </span>
                      </div>
                    )}
                    {invitation.location && (
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{invitation.locationTitle || invitation.location}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(invitation.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      {invitation.shareId && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            // Open sharing dialog or copy link
                            if (navigator.share) {
                              navigator.share({
                                title: invitation.title,
                                url: `${window.location.origin}/invitation/${invitation.shareId}`
                              }).catch(err => console.error('Error sharing:', err));
                            } else {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/invitation/${invitation.shareId}`
                              );
                              toast({
                                title: "Link copied",
                                description: "The invitation link has been copied to your clipboard"
                              });
                            }
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(invitation.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {isEventsList ? 'event' : 'invitation'}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SimpleInvitationsList;

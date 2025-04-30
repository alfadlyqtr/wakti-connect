
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listSimpleInvitations, deleteSimpleInvitation } from '@/services/invitation/simple-invitations';
import { SimpleInvitation } from '@/types/invitation.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, Share, CalendarDays, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
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
import { createGoogleCalendarUrl, createICSFile } from '@/utils/calendarUtils';

interface SimpleInvitationsListProps {
  isEventsList?: boolean;
}

export default function SimpleInvitationsList({ isEventsList = false }: SimpleInvitationsListProps) {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<SimpleInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);

  // Determine paths based on whether this is for events or invitations
  const basePath = isEventsList ? '/dashboard/events' : '/dashboard/invitations';
  const newPath = `${basePath}/new`;
  const editPath = `${basePath}/edit`;
  const entityType = isEventsList ? 'event' : 'invitation';

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await listSimpleInvitations();
      // Filter for events or invitations based on the isEventsList prop
      // For demo purposes, we'll just show all items in both views for now
      setInvitations(data || []);
    } catch (error) {
      console.error(`Error loading ${entityType}s:`, error);
      toast({
        title: `Error loading ${entityType}s`,
        description: `There was a problem loading your ${entityType}s.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteSimpleInvitation(id);
      if (success) {
        setInvitations(invitations.filter(inv => inv.id !== id));
        toast({
          title: 'Success',
          description: `${isEventsList ? 'Event' : 'Invitation'} has been deleted.`,
        });
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      toast({
        title: 'Error',
        description: `Failed to delete ${entityType}.`,
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setInvitationToDelete(null);
  };

  const confirmDelete = (id: string) => {
    setInvitationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const copyShareLink = (invitation: SimpleInvitation) => {
    if (invitation.shareId) {
      const shareUrl = `${window.location.origin}/i/${invitation.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Share link has been copied to clipboard.',
      });
    }
  };

  // Handle calendar export for events
  const handleExportToCalendar = (invitation: SimpleInvitation, type: 'google' | 'ics') => {
    if (!invitation.date) {
      toast({
        title: 'Missing Date',
        description: 'This event does not have a date specified.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const startDate = new Date(`${invitation.date}T${invitation.time || '00:00:00'}`);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // Default to 1 hour duration
      
      const eventData = {
        title: invitation.title,
        description: invitation.description || '',
        location: invitation.location || '',
        start: startDate,
        end: endDate,
        isAllDay: !invitation.time
      };
      
      if (type === 'google') {
        const googleUrl = createGoogleCalendarUrl(eventData);
        window.open(googleUrl, '_blank');
      } else if (type === 'ics') {
        createICSFile(eventData);
      }
    } catch (error) {
      console.error('Error exporting to calendar:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export this event to your calendar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{isEventsList ? 'Events' : 'Invitations'}</h1>
          <p className="text-muted-foreground">
            {isEventsList ? 'Manage your events' : 'Manage your invitations'}
          </p>
        </div>
        <Button onClick={() => navigate(newPath)}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading {isEventsList ? 'events' : 'invitations'}...</p>
        </div>
      ) : invitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{invitation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {invitation.description || 'No description'}
                </p>
                
                {invitation.date && (
                  <div className="flex items-start space-x-2 mb-2">
                    <CalendarDays className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {new Date(invitation.date).toLocaleDateString()} 
                      {invitation.time && ` at ${invitation.time}`}
                    </p>
                  </div>
                )}
                
                {invitation.location && (
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {invitation.locationTitle || invitation.location}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  {invitation.createdAt && (
                    <p>Created: {new Date(invitation.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="space-x-2">
                  {isEventsList && invitation.date && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportToCalendar(invitation, 'google')}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Google</span>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportToCalendar(invitation, 'ics')}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Apple</span>
                        </div>
                      </Button>
                    </>
                  )}
                  {!isEventsList && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyShareLink(invitation)}
                      disabled={!invitation.shareId}
                    >
                      <Share className="mr-2 h-4 w-4" /> Share
                    </Button>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to={`${editPath}/${invitation.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(invitation.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">
            You don't have any {isEventsList ? 'events' : 'invitations'} yet
          </p>
          <Button onClick={() => navigate(newPath)}>
            Create Your First {isEventsList ? 'Event' : 'Invitation'}
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {entityType}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => invitationToDelete && handleDelete(invitationToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

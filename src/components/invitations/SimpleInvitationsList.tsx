
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listSimpleInvitations, deleteSimpleInvitation } from '@/services/invitation/simple-invitations';
import { SimpleInvitation } from '@/types/invitation.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, Share, ExternalLink } from 'lucide-react';
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

export default function SimpleInvitationsList() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<SimpleInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await listSimpleInvitations();
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast({
        title: 'Error loading invitations',
        description: 'There was a problem loading your invitations.',
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
      }
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete invitation.',
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="text-muted-foreground">Manage your invitations</p>
        </div>
        <Button onClick={() => navigate('/dashboard/invitations/new')}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading invitations...</p>
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
                <div className="text-xs text-muted-foreground">
                  {invitation.createdAt && (
                    <p>Created: {new Date(invitation.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyShareLink(invitation)}
                  disabled={!invitation.shareId}
                >
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to={`/dashboard/invitations/edit/${invitation.id}`}>
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
          <p className="text-muted-foreground mb-4">You don't have any invitations yet</p>
          <Button onClick={() => navigate('/dashboard/invitations/new')}>Create Your First Invitation</Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invitation. This action cannot be undone.
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

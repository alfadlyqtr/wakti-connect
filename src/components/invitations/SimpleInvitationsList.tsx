
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleInvitation } from '@/types/invitation.types';
import { listSimpleInvitations, deleteSimpleInvitation, toggleInvitationPublicStatus } from '@/services/invitation/simple-invitations';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  Share, 
  QrCode,
  Copy,
  Globe,
  GlobeLock
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCode from 'react-qr-code';
import InvitationPreview from './InvitationPreview';

export default function SimpleInvitationsList() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<SimpleInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; invitation?: SimpleInvitation }>({
    isOpen: false
  });
  const [qrDialog, setQrDialog] = useState<{ isOpen: boolean; invitation?: SimpleInvitation }>({
    isOpen: false
  });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; invitationId?: string }>({
    isOpen: false
  });

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await listSimpleInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your invitations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSimpleInvitation(id);
      loadInvitations();
      setDeleteDialog({ isOpen: false });
    } catch (error) {
      console.error('Error deleting invitation:', error);
    }
  };

  const handleTogglePublic = async (invitation: SimpleInvitation) => {
    try {
      await toggleInvitationPublicStatus(invitation.id, !invitation.isPublic);
      loadInvitations();
      toast({
        title: invitation.isPublic ? 'Invitation Unpublished' : 'Invitation Published',
        description: invitation.isPublic 
          ? 'Your invitation is no longer publicly accessible'
          : 'Your invitation is now publicly accessible via link',
      });
    } catch (error) {
      console.error('Error toggling invitation public status:', error);
    }
  };

  const getShareUrl = (invitation?: SimpleInvitation) => {
    if (!invitation?.shareId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/i/${invitation.shareId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link Copied',
      description: 'Invitation link copied to clipboard',
    });
  };

  const renderInvitationCard = (invitation: SimpleInvitation) => {
    const shareUrl = getShareUrl(invitation);
    return (
      <Card key={invitation.id} className="overflow-hidden">
        <div className="h-40 overflow-hidden">
          <div 
            className="h-full w-full"
            style={{
              background: invitation.customization.background.type === 'solid' 
                ? invitation.customization.background.value 
                : invitation.customization.background.type === 'gradient'
                ? invitation.customization.background.value
                : `url(${invitation.customization.background.value})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full w-full p-4 flex flex-col bg-black/30">
              <h3 
                className="text-white font-medium text-lg mb-2 line-clamp-1"
                style={{ fontFamily: invitation.customization.font?.family }}
              >
                {invitation.title}
              </h3>
              <p 
                className="text-white/80 text-sm line-clamp-3"
                style={{ fontFamily: invitation.customization.font?.family }}
              >
                {invitation.description}
              </p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {invitation.date ? new Date(invitation.date).toLocaleDateString() : 'No date specified'}
              </p>
            </div>
            
            <div className="flex items-center">
              {invitation.isPublic && (
                <span className="flex items-center text-xs text-muted-foreground gap-1 mr-2">
                  <Globe className="h-3 w-3" /> Public
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/invitations/edit/${invitation.id}`)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShareDialog({ isOpen: true, invitation })}>
                    <Share className="mr-2 h-4 w-4" /> Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQrDialog({ isOpen: true, invitation })}>
                    <QrCode className="mr-2 h-4 w-4" /> QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTogglePublic(invitation)}>
                    {invitation.isPublic ? (
                      <>
                        <GlobeLock className="mr-2 h-4 w-4" /> Make Private
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" /> Make Public
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialog({ isOpen: true, invitationId: invitation.id })}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Invitations</h1>
        
        <Button onClick={() => navigate('/invitations/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Invitation
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">Loading your invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any invitations yet.</p>
          <Button onClick={() => navigate('/invitations/new')}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Invitation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map(renderInvitationCard)}
        </div>
      )}
      
      {/* Share Dialog */}
      <Dialog open={shareDialog.isOpen} onOpenChange={(open) => setShareDialog({ isOpen: open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Invitation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {!shareDialog.invitation?.isPublic ? (
                "To share this invitation, you need to make it public first."
              ) : (
                "Copy this link to share your invitation with others."
              )}
            </p>
            
            {!shareDialog.invitation?.isPublic ? (
              <Button 
                className="w-full" 
                onClick={() => {
                  if (shareDialog.invitation) {
                    handleTogglePublic(shareDialog.invitation);
                    setShareDialog({ isOpen: false });
                  }
                }}
              >
                <Globe className="mr-2 h-4 w-4" /> Make Public
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Input 
                  readOnly 
                  value={getShareUrl(shareDialog.invitation)} 
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={() => copyToClipboard(getShareUrl(shareDialog.invitation))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={qrDialog.isOpen} onOpenChange={(open) => setQrDialog({ isOpen: open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invitation QR Code</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {!qrDialog.invitation?.isPublic ? (
                "To generate a QR code, you need to make this invitation public first."
              ) : (
                "Scan this QR code to view the invitation."
              )}
            </p>
            
            {!qrDialog.invitation?.isPublic ? (
              <Button 
                className="w-full" 
                onClick={() => {
                  if (qrDialog.invitation) {
                    handleTogglePublic(qrDialog.invitation);
                    setQrDialog({ isOpen: false });
                  }
                }}
              >
                <Globe className="mr-2 h-4 w-4" /> Make Public
              </Button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg">
                  <QRCode value={getShareUrl(qrDialog.invitation)} size={200} />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(getShareUrl(qrDialog.invitation))}
                  className="mt-4"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Invitation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this invitation? This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ isOpen: false })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.invitationId && handleDelete(deleteDialog.invitationId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

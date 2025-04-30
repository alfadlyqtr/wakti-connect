
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSimpleInvitations, deleteSimpleInvitation } from "@/services/invitation/simple-invitations";
import { SimpleInvitation } from "@/types/invitation-simple.types";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Copy, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const SimpleInvitationsList: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<SimpleInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        setIsLoading(true);
        const data = await getSimpleInvitations();
        setInvitations(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitations();
  }, []);

  const handleCreate = () => {
    navigate("/invitations/new");
  };

  const handleCopyLink = (shareLink: string) => {
    const fullUrl = `${window.location.origin}/i/${shareLink}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Invitation link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteSimpleInvitation(deleteId);
      if (success) {
        setInvitations(invitations.filter(inv => inv.id !== deleteId));
      }
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Invitations</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Invitation
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/20">
          <h3 className="text-lg font-medium">No invitations yet</h3>
          <p className="text-muted-foreground mt-1">Create your first invitation to get started</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Invitation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden group">
              <div 
                className="h-32 w-full"
                style={{
                  backgroundColor: invitation.background_type === "solid" ? invitation.background_value : undefined,
                  backgroundImage: 
                    invitation.background_type === "gradient" ? invitation.background_value : 
                    invitation.background_type === "image" ? `url(${invitation.background_value})` : 
                    undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate mr-2">{invitation.title}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {invitation.datetime && (
                  <div className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(invitation.datetime)} at {formatTime(invitation.datetime)}
                  </div>
                )}
                
                {invitation.location && (
                  <div className="text-sm truncate">
                    <span className="font-medium">Location:</span>{" "}
                    {invitation.location}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(invitation.share_link || "")}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/i/${invitation.share_link}`)}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(invitation.id || "")}
                    className="px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

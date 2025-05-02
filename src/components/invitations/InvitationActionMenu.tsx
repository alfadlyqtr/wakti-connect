
import React from 'react';
import { MoreVertical, Trash2, Link, Edit, Copy, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { deleteSimpleInvitation } from '@/services/invitation/simple-invitations';
import { useNavigate } from 'react-router-dom';

interface InvitationActionMenuProps {
  invitation: SimpleInvitation;
  onDelete?: () => void;
  className?: string;
}

const InvitationActionMenu: React.FC<InvitationActionMenuProps> = ({ 
  invitation, 
  onDelete,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    const basePath = invitation.isEvent ? 'events' : 'invitations';
    navigate(`/dashboard/${basePath}/edit/${invitation.id}`);
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invitation?")) {
      const success = await deleteSimpleInvitation(invitation.id);
      if (success) {
        toast({
          title: "Deleted successfully",
          description: "The invitation has been removed"
        });
        if (onDelete) {
          onDelete();
        }
      }
    }
  };
  
  const handleCopyLink = async () => {
    if (!invitation.shareId) {
      toast({
        title: "No share link available",
        description: "This invitation doesn't have a shareable link yet",
        variant: "destructive"
      });
      return;
    }
    
    const shareUrl = `${window.location.origin}/invitation/${invitation.shareId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Shareable link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive"
      });
    }
  };
  
  const handleDuplicate = () => {
    // We'll implement this in the future
    toast({
      title: "Feature coming soon",
      description: "Duplication will be available in a future update"
    });
  };
  
  const handleView = () => {
    if (!invitation.shareId) {
      toast({
        title: "Preview not available",
        description: "This invitation doesn't have a shareable link yet",
        variant: "destructive"
      });
      return;
    }
    
    window.open(`/invitation/${invitation.shareId}`, '_blank');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleView}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link className="h-4 w-4 mr-2" />
          Copy Share Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvitationActionMenu;

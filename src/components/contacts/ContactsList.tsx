
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, User, Users, Briefcase } from "lucide-react";
import { UserContact } from "@/types/invitation.types";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactsListProps {
  contacts: UserContact[];
  isLoading: boolean;
  isSyncing?: boolean;
  onDeleteContact?: (contactId: string) => Promise<void>;
}

const ContactItem = ({ 
  contact, 
  onDeleteContact 
}: { 
  contact: UserContact;
  onDeleteContact?: (contactId: string) => Promise<void>;
}) => {
  const navigate = useNavigate();
  
  const displayName = contact.contactProfile?.displayName || 
                      contact.contactProfile?.fullName || 
                      'Unknown User';
                      
  const avatarUrl = contact.contactProfile?.avatarUrl;
  const displayInitial = displayName.charAt(0) || 'U';
  
  // Determine contact type
  const isBusinessOwner = contact.contactProfile?.accountType === 'business';
  const hasStaffRelation = !!contact.staffRelationId;
  
  const handleMessageClick = () => {
    navigate(`/dashboard/messages/${contact.contactId}`);
  };

  const handleDeleteClick = async () => {
    if (onDeleteContact) {
      await onDeleteContact(contact.contactId);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback>{displayInitial}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{displayName}</p>
            {isBusinessOwner ? (
              <Badge variant="outline" className="bg-blue-50">
                <Briefcase className="h-3 w-3 mr-1" />
                Business
              </Badge>
            ) : hasStaffRelation ? (
              <Badge variant="outline" className="bg-green-50">
                <User className="h-3 w-3 mr-1" />
                Staff
              </Badge>
            ) : (
              <Badge variant="outline">
                <User className="h-3 w-3 mr-1" />
                Individual
              </Badge>
            )}
          </div>
          {contact.contactProfile?.businessName && (
            <p className="text-sm text-muted-foreground">
              {contact.contactProfile.businessName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {contact.contactProfile?.email || contact.contactId}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleMessageClick}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {onDeleteContact && !hasStaffRelation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-500 hover:bg-red-50"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:ml-2">Remove</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  isLoading,
  onDeleteContact
}) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div>
      {contacts && contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <ContactItem 
              key={contact.id} 
              contact={contact} 
              onDeleteContact={onDeleteContact}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No contacts found</p>
        </div>
      )}
    </div>
  );
};

export default ContactsList;


import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";
import { UserContact } from "@/types/invitation.types";
import { useNavigate } from "react-router-dom";

interface ContactsListProps {
  contacts: UserContact[];
  isLoading: boolean;
  isSyncing?: boolean;
  onRefresh?: () => void;
}

const ContactItem = ({ contact }: { contact: UserContact }) => {
  const navigate = useNavigate();
  
  const displayName = contact.contactProfile?.displayName || 
                      contact.contactProfile?.fullName || 
                      'Unknown User';
                      
  const avatarUrl = contact.contactProfile?.avatarUrl;
  const displayInitial = displayName.charAt(0) || 'U';
  
  // Check if the contact is a business owner or staff
  const isBusinessOwner = contact.contactProfile?.accountType === 'business';
  const hasStaffRelation = !!contact.staffRelationId;
  
  const handleMessageClick = () => {
    const contactUserId = contact.userId === contact.contactId ? 
                          contact.contactId : 
                          (contact.userId || contact.contactId);
    navigate(`/dashboard/messages/${contactUserId}`);
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback>{displayInitial}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{displayName}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {contact.contactProfile?.email || 'No email available'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isBusinessOwner && (
          <Badge variant="outline" className="bg-blue-50">Business</Badge>
        )}
        {hasStaffRelation && !isBusinessOwner && (
          <Badge variant="outline" className="bg-green-50">Staff</Badge>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleMessageClick}
        >
          Message
        </Button>
      </div>
    </div>
  );
};

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  isLoading,
  isSyncing,
  onRefresh 
}) => {
  console.log("Rendering ContactsList with contacts:", contacts);

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div>
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Refreshing...' : 'Refresh Contacts'}
          </Button>
        </div>
      )}
      
      {contacts && contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No contacts found</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              className="mt-4"
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactsList;


import React from "react";
import { UserContact } from "@/types/invitation.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ContactsListProps {
  contacts: UserContact[];
  isLoading: boolean;
  isSyncing?: boolean;
  showChat?: boolean;
  onDeleteContact?: (contactId: string) => void;
  onMessageContact?: (contact: UserContact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  isLoading,
  isSyncing = false,
  showChat = false,
  onDeleteContact,
  onMessageContact
}) => {
  if (isLoading || isSyncing) {
    return (
      <div className="py-10 text-center">
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">No contacts found</p>
      </div>
    );
  }

  // Helper function to determine if this is a staff contact
  const isStaffContact = (contact: UserContact) => {
    return contact.staff_relation_id !== null;
  };

  // Helper function to get the contact user ID
  // The contact_id field contains the other user's ID we want to display
  const getContactUserId = (contact: UserContact) => {
    return contact.contact_id;
  };

  // Helper function to generate chat link
  const getChatLink = (contact: UserContact) => {
    return `/dashboard/messages/${getContactUserId(contact)}`;
  };

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
              <AvatarFallback>
                {(contact.contactProfile?.displayName || contact.contactProfile?.fullName || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {contact.contactProfile?.displayName || 
                  contact.contactProfile?.fullName || 'Unknown User'}
                </p>
                {contact.contactProfile?.accountType === 'business' ? (
                  <Badge variant="outline" className="bg-blue-50">Business</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50">Individual</Badge>
                )}
                {isStaffContact(contact) && (
                  <Badge variant="outline" className="bg-purple-50">Staff</Badge>
                )}
              </div>
              {contact.contactProfile?.businessName && (
                <p className="text-sm">{contact.contactProfile.businessName}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {contact.contactProfile?.email || getContactUserId(contact)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {onMessageContact && (
              <Button 
                onClick={() => onMessageContact(contact)}
                size="sm" 
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            )}
            
            {showChat && (
              <Button asChild size="sm" variant="outline">
                <Link to={getChatLink(contact)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Link>
              </Button>
            )}
            
            {onDeleteContact && !isStaffContact(contact) && (
              <Button 
                onClick={() => onDeleteContact(contact.contact_id)}
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsList;

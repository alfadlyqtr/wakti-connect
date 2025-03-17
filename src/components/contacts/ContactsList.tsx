
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { UserContact } from "@/types/invitation.types";

interface ContactsListProps {
  contacts: UserContact[];
  isLoading: boolean;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="py-10 text-center">
        <Users className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
              <AvatarFallback>
                {contact.contactProfile?.displayName?.charAt(0) || 
                 contact.contactProfile?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {contact.contactProfile?.displayName || 
                 contact.contactProfile?.fullName || 'Unknown User'}
              </p>
              <p className="text-sm text-muted-foreground">
                {contact.contactId}
              </p>
            </div>
          </div>
          <Badge>{contact.status}</Badge>
        </div>
      ))}
    </div>
  );
};

export default ContactsList;

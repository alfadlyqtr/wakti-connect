
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { UserContact } from "@/types/invitation.types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ContactsListProps {
  contacts: UserContact[];
  isLoading: boolean;
}

// Helper hook to get the profile for a user ID
const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, display_name, avatar_url')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

const ContactItem = ({ contact }: { contact: UserContact }) => {
  // For "inverted" contacts (where current user is contact_id), we need to get the profile
  // of the user_id instead
  const isInverted = !contact.contactProfile?.fullName && !contact.contactProfile?.displayName;
  const profileId = isInverted ? contact.userId : contact.contactId;
  
  const { data: profile, isLoading } = useUserProfile(
    isInverted ? profileId : undefined
  );
  
  // Use either the embedded profile or the fetched profile
  const displayName = isInverted 
    ? (profile?.display_name || profile?.full_name || 'Unknown User')
    : (contact.contactProfile?.displayName || contact.contactProfile?.fullName || 'Unknown User');
    
  const avatarUrl = isInverted
    ? profile?.avatar_url
    : contact.contactProfile?.avatarUrl;
    
  const displayInitial = displayName.charAt(0) || 'U';
  
  if (isLoading && isInverted) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted"></div>
          <div>
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-3 w-24 bg-muted rounded mt-2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl || ''} />
          <AvatarFallback>{displayInitial}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{displayName}</p>
          <p className="text-sm text-muted-foreground">
            {isInverted ? contact.userId : contact.contactId}
          </p>
        </div>
      </div>
      {contact.staffRelationId && (
        <Badge variant="outline" className="bg-blue-50">Staff</Badge>
      )}
    </div>
  );
};

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
        <ContactItem key={contact.id} contact={contact} />
      ))}
    </div>
  );
};

export default ContactsList;

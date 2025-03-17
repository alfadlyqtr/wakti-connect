
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserContact } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";

export const useContacts = () => {
  const queryClient = useQueryClient();

  // Fetch user's contacts
  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<UserContact[]> => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error("No active session");
        }
        
        // Get contacts where the user is either the requester or recipient
        const { data, error } = await supabase
          .from('user_contacts')
          .select(`
            id, 
            user_id,
            contact_id,
            status,
            created_at,
            updated_at,
            profiles:contact_id(
              full_name,
              display_name,
              avatar_url
            )
          `)
          .or(`user_id.eq.${session.user.id},contact_id.eq.${session.user.id}`)
          .eq('status', 'accepted');
        
        if (error) throw error;
        
        return data.map(contact => ({
          id: contact.id,
          userId: contact.user_id,
          contactId: contact.contact_id,
          status: contact.status,
          createdAt: contact.created_at,
          updatedAt: contact.updated_at,
          contactProfile: {
            fullName: contact.profiles?.full_name,
            displayName: contact.profiles?.display_name,
            avatarUrl: contact.profiles?.avatar_url
          }
        }));
      } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
      }
    }
  });

  // Send contact request
  const sendContactRequest = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }

      // Check if a contact relationship already exists
      const { data: existingContact } = await supabase
        .from('user_contacts')
        .select('id, status')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${session.user.id})`)
        .maybeSingle();

      if (existingContact) {
        if (existingContact.status === 'accepted') {
          throw new Error("This user is already in your contacts");
        } else if (existingContact.status === 'pending') {
          throw new Error("A contact request with this user is already pending");
        }
      }

      // Create new contact request
      const { error } = await supabase
        .from('user_contacts')
        .insert({
          user_id: session.user.id,
          contact_id: userId,
          status: 'pending'
        });

      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Contact Request Sent",
        description: "Your contact request has been sent successfully."
      });
      // Invalidate contacts queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Request",
        description: error.message || "An error occurred while sending the contact request",
        variant: "destructive"
      });
    }
  });

  // Respond to contact request
  const respondToContactRequest = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }

      const { error } = await supabase
        .from('user_contacts')
        .update({
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', requestId)
        .eq('contact_id', session.user.id);

      if (error) throw error;
      
      return true;
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.accept ? "Contact Request Accepted" : "Contact Request Rejected",
        description: variables.accept 
          ? "You have accepted the contact request." 
          : "You have rejected the contact request."
      });
      // Invalidate contacts queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Respond to Request",
        description: error.message || "An error occurred while responding to the contact request",
        variant: "destructive"
      });
    }
  });

  // Get pending contact requests
  const { data: pendingRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['contactRequests'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error("No active session");
        }
        
        const { data, error } = await supabase
          .from('user_contacts')
          .select(`
            id, 
            user_id,
            contact_id,
            status,
            created_at,
            updated_at,
            profiles:user_id(
              full_name,
              display_name,
              avatar_url
            )
          `)
          .eq('contact_id', session.user.id)
          .eq('status', 'pending');
        
        if (error) throw error;
        
        return data.map(request => ({
          id: request.id,
          userId: request.user_id,
          contactId: request.contact_id,
          status: request.status,
          createdAt: request.created_at,
          updatedAt: request.updated_at,
          contactProfile: {
            fullName: request.profiles?.full_name,
            displayName: request.profiles?.display_name,
            avatarUrl: request.profiles?.avatar_url
          }
        }));
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        return [];
      }
    }
  });

  return {
    contacts,
    isLoading,
    error,
    pendingRequests,
    isLoadingRequests,
    sendContactRequest,
    respondToContactRequest
  };
};

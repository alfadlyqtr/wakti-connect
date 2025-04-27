
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserSearchResult, ContactRequestStatus } from '@/types/invitation.types';
import { toast } from '@/components/ui/use-toast';

export const useContactSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    setIsSearching(true);
    try {
      if (query.length < 3) {
        setSearchResults([]);
        return [];
      }

      // Search for users that match the query
      const { data, error } = await supabase.rpc('search_users', {
        search_term: query.toLowerCase()
      });

      if (error) throw error;
      
      // Transform the results to match the UserSearchResult interface
      const formattedResults: UserSearchResult[] = data.map((user: any) => ({
        id: user.id,
        fullName: user.full_name || '',
        displayName: user.display_name || user.full_name || '',
        email: user.email || '',
        avatarUrl: user.avatar_url || '',
        accountType: user.account_type || 'free',
        businessName: user.business_name || undefined
      }));
      
      setSearchResults(formattedResults);
      return formattedResults;
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for users",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const checkContactRequest = async (userId: string): Promise<ContactRequestStatus> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return { requestExists: false, requestStatus: null };
      }
      
      // Check if a contact request exists between the current user and the specified user
      const { data, error } = await supabase
        .from('user_contacts')
        .select('status')
        .or(`user_id.eq.${session.session.user.id},contact_id.eq.${session.session.user.id}`)
        .or(`user_id.eq.${userId},contact_id.eq.${userId}`)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking contact request:', error);
        throw error;
      }
      
      // Return the status of the request
      return {
        requestExists: !!data,
        requestStatus: data ? data.status : null
      };
    } catch (error) {
      console.error('Error checking contact request:', error);
      return { requestExists: false, requestStatus: null };
    }
  };

  return {
    searchUsers,
    searchResults,
    isSearching,
    checkContactRequest
  };
};

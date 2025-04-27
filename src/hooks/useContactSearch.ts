
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserSearchResult, ContactRequestStatus, ContactRequestStatusValue } from '@/types/invitation.types';
import { toast } from '@/components/ui/use-toast';

export const useContactSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedContact, setSelectedContact] = useState<UserSearchResult | null>(null);
  const [contactStatus, setContactStatus] = useState<ContactRequestStatusValue>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    setIsSearching(true);
    try {
      if (query.length < 3) {
        setSearchResults([]);
        return [];
      }

      // Search for users that match the query
      const { data, error } = await supabase.rpc('search_users', {
        search_query: query.toLowerCase()
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
    setIsCheckingStatus(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return { requestExists: false, requestStatus: null };
      }
      
      // Check if a contact request exists between the current user and the specified user
      const { data, error } = await supabase.rpc('check_contact_request', {
        user_id_param: session.session.user.id,
        contact_id_param: userId
      });
        
      if (error) {
        console.error('Error checking contact request:', error);
        throw error;
      }
      
      // Return the status of the request
      if (data && data.length > 0) {
        // Convert the status to the correct type
        let statusValue: ContactRequestStatusValue = null;
        
        if (data[0].request_status === 'pending') {
          statusValue = 'pending';
          setContactStatus('pending');
        } else if (data[0].request_status === 'accepted') {
          statusValue = 'accepted';
          setContactStatus('accepted');
        } else if (data[0].request_status === 'rejected') {
          statusValue = 'rejected';
          setContactStatus('rejected');
        } else {
          setContactStatus(null);
        }
        
        return {
          requestExists: data[0].request_exists,
          requestStatus: statusValue
        };
      }
      
      setContactStatus(null);
      return { requestExists: false, requestStatus: null };
    } catch (error) {
      console.error('Error checking contact request:', error);
      setContactStatus(null);
      return { requestExists: false, requestStatus: null };
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedContact(null);
    if (value.length >= 3) {
      searchUsers(value);
    } else {
      setSearchResults([]);
    }
  };

  const selectContact = async (contact: UserSearchResult) => {
    setSelectedContact(contact);
    await checkContactRequest(contact.id);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedContact(null);
    setContactStatus(null);
  };

  return {
    searchUsers,
    searchResults,
    isSearching,
    checkContactRequest,
    searchQuery,
    selectedContact,
    contactStatus,
    isCheckingStatus,
    handleSearchChange,
    selectContact,
    clearSearch
  };
};

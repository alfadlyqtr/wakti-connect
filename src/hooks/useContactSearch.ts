
import { useState } from "react";
import { UserSearchResult, ContactRequestStatus } from "@/types/invitation.types";
import { searchUsers, checkContactRequest } from "@/services/contacts";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

export const useContactSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<UserSearchResult | null>(null);
  const [contactStatus, setContactStatus] = useState<ContactRequestStatus | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching contacts:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for contacts",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const checkStatus = useMutation({
    mutationFn: async (contactId: string) => {
      return await checkContactRequest(contactId);
    },
    onSuccess: (data) => {
      setContactStatus(data);
    },
    onError: (error) => {
      console.error("Error checking contact status:", error);
      toast({
        title: "Error",
        description: "Failed to check contact status",
        variant: "destructive",
      });
    },
  });

  const selectContact = (contact: UserSearchResult) => {
    setSelectedContact(contact);
    checkStatus.mutate(contact.id);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedContact(null);
    setContactStatus(null);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    selectedContact,
    contactStatus,
    isCheckingStatus: checkStatus.isPending,
    handleSearch,
    selectContact,
    clearSearch,
  };
};

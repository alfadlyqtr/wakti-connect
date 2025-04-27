
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
    console.log("[useContactSearch] Starting search with query:", query);
    setSearchQuery(query);
    
    // Clear results if query is empty or too short
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      console.log("[useContactSearch] Query too short, clearing results");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(query);
      console.log("[useContactSearch] Search results:", results);
      
      // Always set a valid array, even if the results are null/undefined
      if (Array.isArray(results)) {
        setSearchResults(results);
      } else {
        console.warn("[useContactSearch] Search returned non-array results:", results);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("[useContactSearch] Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for contacts. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const checkStatus = useMutation({
    mutationFn: async (contactId: string) => {
      return await checkContactRequest(contactId);
    },
    onSuccess: (data) => {
      console.log("[useContactSearch] Contact status check:", data);
      setContactStatus(data);
    },
    onError: (error) => {
      console.error("[useContactSearch] Status check error:", error);
      toast({
        title: "Error",
        description: "Failed to check contact status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const selectContact = (contact: UserSearchResult) => {
    if (!contact || !contact.id) {
      console.error("[useContactSearch] Invalid contact selected:", contact);
      return;
    }
    
    console.log("[useContactSearch] Selected contact:", contact);
    setSelectedContact(contact);
    checkStatus.mutate(contact.id);
  };

  const clearSearch = () => {
    console.log("[useContactSearch] Clearing search");
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
    checkContactRequest: (contactId: string) => checkStatus.mutate(contactId)
  };
};

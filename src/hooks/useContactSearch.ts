
import { useState, useCallback, useEffect } from "react";
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
  
  // Debounce search input
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  
  // Set up debouncing for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Perform the actual search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        console.log("[useContactSearch] Searching for:", debouncedQuery);
        const results = await searchUsers(debouncedQuery);
        
        // Ensure we always set a valid array
        if (Array.isArray(results)) {
          console.log("[useContactSearch] Found results:", results.length);
          setSearchResults(results);
        } else {
          console.warn("[useContactSearch] Search returned non-array:", results);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("[useContactSearch] Search error:", error);
        setSearchResults([]);
        toast({
          title: "Search Error",
          description: "Failed to search for contacts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };
    
    performSearch();
  }, [debouncedQuery]);

  const handleSearchChange = useCallback((query: string) => {
    console.log("[useContactSearch] Query changed:", query);
    setSearchQuery(query);
  }, []);

  const checkStatus = useMutation({
    mutationFn: async (contactId: string) => {
      return await checkContactRequest(contactId);
    },
    onSuccess: (data) => {
      console.log("[useContactSearch] Contact status:", data);
      setContactStatus(data);
    },
    onError: (error) => {
      console.error("[useContactSearch] Status check error:", error);
      setContactStatus(null);
      toast({
        title: "Error",
        description: "Failed to check contact status.",
        variant: "destructive",
      });
    },
  });

  const selectContact = useCallback((contact: UserSearchResult) => {
    if (!contact || !contact.id) {
      console.error("[useContactSearch] Invalid contact selected");
      return;
    }
    
    console.log("[useContactSearch] Selected contact:", contact.id);
    setSelectedContact(contact);
    checkStatus.mutate(contact.id);
  }, [checkStatus]);

  const clearSearch = useCallback(() => {
    console.log("[useContactSearch] Clearing search");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedContact(null);
    setContactStatus(null);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    selectedContact,
    contactStatus,
    isCheckingStatus: checkStatus.isPending,
    handleSearchChange,
    selectContact,
    clearSearch,
    checkContactRequest: (contactId: string) => checkStatus.mutate(contactId)
  };
};

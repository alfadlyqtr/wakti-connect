import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Search, 
  Building2, 
  User, 
  UserPlus, 
  ExternalLink, 
  Star, 
  Mail,
  Loader2
} from "lucide-react";
import { UserSearchResult, ContactRequestStatus } from "@/types/invitation.types";
import { searchUsers, checkContactRequest } from "@/services/contacts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { sendContactRequest } from "@/services/contacts";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

interface CommandSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole?: UserRole | null;
}

const CommandSearch: React.FC<CommandSearchProps> = ({ 
  open, 
  setOpen,
  userRole
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<Record<string, boolean>>({});
  const [contactStatuses, setContactStatuses] = useState<Record<string, ContactRequestStatus>>({});

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  // Clear results when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open]);

  // Fetch featured businesses on initial load
  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, display_name, avatar_url, account_type, business_name')
          .eq('account_type', 'business')
          .eq('is_searchable', true)
          .limit(3);

        if (error) throw error;
        
        if (data) {
          const businesses = data.map(business => ({
            id: business.id,
            fullName: business.full_name,
            displayName: business.display_name,
            email: null, // Not displaying email for featured businesses
            avatarUrl: business.avatar_url,
            accountType: business.account_type,
            businessName: business.business_name
          }));
          
          setFeaturedBusinesses(businesses);
        }
      } catch (error) {
        console.error("Error fetching featured businesses:", error);
      }
    };

    if (open) {
      fetchFeaturedBusinesses();
    }
  }, [open]);

  // Handle search input change
  const handleSearch = async (value: string) => {
    setSearchQuery(value);

    if (!value.trim() || value.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(value);
      setSearchResults(results);
      
      // Pre-check contact status for all results
      results.forEach(async (result) => {
        checkContactStatus(result.id);
      });
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Check contact status for a user
  const checkContactStatus = async (userId: string) => {
    try {
      const status = await checkContactRequest(userId);
      setContactStatuses(prev => ({
        ...prev,
        [userId]: status
      }));
    } catch (error) {
      console.error("Error checking contact status:", error);
    }
  };

  // Send contact request
  const handleSendContactRequest = async (contactId: string) => {
    setPendingRequests(prev => ({ ...prev, [contactId]: true }));
    try {
      await sendContactRequest(contactId);
      toast({
        title: "Contact request sent",
        description: "Your contact request has been sent successfully.",
      });
      
      // Update contact status locally
      setContactStatuses(prev => ({
        ...prev,
        [contactId]: { requestExists: true, requestStatus: 'pending' }
      }));
    } catch (error) {
      console.error("Error sending contact request:", error);
      toast({
        title: "Request failed",
        description: "There was a problem sending your contact request.",
        variant: "destructive",
      });
    } finally {
      setPendingRequests(prev => ({ ...prev, [contactId]: false }));
    }
  };

  // Subscribe to a business
  const handleSubscribeToBusiness = async (businessId: string) => {
    setPendingRequests(prev => ({ ...prev, [businessId]: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Check if already subscribed
      const { data: existingSubscription } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('business_id', businessId)
        .eq('subscriber_id', session.user.id)
        .single();

      if (existingSubscription) {
        toast({
          title: "Already subscribed",
          description: "You are already subscribed to this business.",
        });
        return;
      }

      // Insert new subscription
      const { error } = await supabase
        .from('business_subscribers')
        .insert({
          business_id: businessId,
          subscriber_id: session.user.id
        });

      if (error) throw error;

      toast({
        title: "Subscribed successfully",
        description: "You are now subscribed to this business.",
      });
    } catch (error) {
      console.error("Error subscribing to business:", error);
      toast({
        title: "Subscription failed",
        description: "There was a problem subscribing to this business.",
        variant: "destructive",
      });
    } finally {
      setPendingRequests(prev => ({ ...prev, [businessId]: false }));
    }
  };

  const visitBusinessPage = (businessName: string) => {
    // Convert business name to slug
    const slug = businessName?.toLowerCase().replace(/\s+/g, '-') || '';
    if (slug) {
      // Close the search dialog
      setOpen(false);
      // Navigate to the business landing page
      navigate(`/business/${slug}`);
    }
  };

  const getDisplayName = (result: UserSearchResult) => {
    if (result.accountType === 'business' && result.businessName) {
      return result.businessName;
    } else if (result.displayName) {
      return result.displayName;
    } else if (result.fullName) {
      return result.fullName;
    } else {
      return 'User';
    }
  };

  const getAvatarFallback = (result: UserSearchResult) => {
    if (result.accountType === 'business') {
      return result.businessName?.slice(0, 2).toUpperCase() || 'B';
    } else {
      const name = result.displayName || result.fullName || '';
      return name.slice(0, 2).toUpperCase() || 'U';
    }
  };

  // Get the contact request status text and determine action button state
  const getContactStatusInfo = (userId: string) => {
    const status = contactStatuses[userId];
    
    if (!status) {
      return { text: "", canRequest: true };
    }
    
    if (status.requestExists) {
      if (status.requestStatus === 'accepted') {
        return { text: "Already a contact", canRequest: false };
      } else if (status.requestStatus === 'pending') {
        return { text: "Request pending", canRequest: false };
      } else {
        return { text: "", canRequest: true };
      }
    }
    
    return { text: "", canRequest: true };
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for people and businesses..."
        value={searchQuery}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Searching...</span>
            </div>
          ) : (
            searchQuery.length > 0 ? 'No results found.' : 'Type to search...'
          )}
        </CommandEmpty>
        
        {/* Featured Businesses Section - Updated to be more concise */}
        {featuredBusinesses.length > 0 && !searchQuery && (
          <>
            <CommandGroup heading="Featured Businesses">
              {featuredBusinesses.map((business) => (
                <CommandItem 
                  key={`featured-${business.id}`}
                  className="flex flex-col items-start py-3"
                >
                  <div className="flex w-full items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={business.avatarUrl || ''} alt={business.businessName || ''} />
                      <AvatarFallback>{getAvatarFallback(business)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {business.businessName}
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          visitBusinessPage(business.businessName || '');
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribeToBusiness(business.id);
                        }}
                        disabled={pendingRequests[business.id]}
                      >
                        {pendingRequests[business.id] ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Mail className="h-3 w-3 mr-1" />
                        )}
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        
        {/* Search Results - Keeping full details for actual search results */}
        {searchResults.length > 0 && (
          <>
            {/* Business Results */}
            {searchResults.filter(item => item.accountType === 'business').length > 0 && (
              <CommandGroup heading="Businesses">
                {searchResults
                  .filter(item => item.accountType === 'business')
                  .map((result) => (
                    <CommandItem key={`biz-${result.id}`} className="flex flex-col items-start py-3">
                      <div className="flex w-full items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={result.avatarUrl || ''} alt={getDisplayName(result)} />
                          <AvatarFallback>{getAvatarFallback(result)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {getDisplayName(result)}
                            <Badge variant="outline" className="ml-2">Business</Badge>
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              visitBusinessPage(result.businessName || '');
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubscribeToBusiness(result.id);
                            }}
                            disabled={pendingRequests[result.id]}
                          >
                            {pendingRequests[result.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <Mail className="h-3 w-3 mr-1" />
                            )}
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {/* Individual Users Results */}
            {searchResults.filter(item => item.accountType !== 'business').length > 0 && (
              <CommandGroup heading="People">
                {searchResults
                  .filter(item => item.accountType !== 'business')
                  .map((result) => {
                    const statusInfo = getContactStatusInfo(result.id);
                    
                    return (
                      <CommandItem key={`user-${result.id}`} className="flex flex-col items-start py-3">
                        <div className="flex w-full items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={result.avatarUrl || ''} alt={getDisplayName(result)} />
                            <AvatarFallback>{getAvatarFallback(result)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {getDisplayName(result)}
                              <Badge variant="outline" className="ml-2">
                                {result.accountType === 'individual' ? 'Individual' : 'Free User'}
                              </Badge>
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {result.email}
                            </p>
                            {statusInfo.text && (
                              <p className="text-xs text-muted-foreground">
                                {statusInfo.text}
                              </p>
                            )}
                          </div>
                          {statusInfo.canRequest && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendContactRequest(result.id);
                              }}
                              disabled={pendingRequests[result.id]}
                            >
                              {pendingRequests[result.id] ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <UserPlus className="h-3 w-3 mr-1" />
                              )}
                              Add Contact
                            </Button>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandSearch;

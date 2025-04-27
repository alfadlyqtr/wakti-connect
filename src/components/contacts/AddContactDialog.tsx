import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Loader2, User, UserPlus, AlertCircle, Briefcase } from "lucide-react";
import { useContactSearch } from "@/hooks/useContactSearch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserSearchResult } from "@/types/invitation.types";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: (contactId: string) => Promise<void>;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onAddContact
}) => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    selectedContact,
    contactStatus,
    isCheckingStatus,
    handleSearch,
    selectContact,
    clearSearch
  } = useContactSearch();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    if (!isOpen) {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  const handleSubmit = async () => {
    if (!selectedContact) return;
    
    setIsSubmitting(true);
    try {
      await onAddContact(selectedContact.id);
      clearSearch();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case 'business':
        return <Briefcase className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getAccountTypeBadge = (accountType: string) => {
    switch (accountType) {
      case 'business':
        return <Badge variant="outline" className="bg-blue-50 flex items-center">
          {getAccountTypeIcon(accountType)} Business
        </Badge>;
      case 'individual':
        return <Badge variant="outline" className="bg-green-50 flex items-center">
          {getAccountTypeIcon(accountType)} Individual
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center">
          {getAccountTypeIcon(accountType)} Free
        </Badge>;
    }
  };

  const renderContactStatus = () => {
    if (!contactStatus || !selectedContact) return null;
    
    if (contactStatus.requestExists) {
      if (contactStatus.requestStatus === 'accepted') {
        return (
          <div className="flex items-center gap-2 text-green-600 mt-4 p-2 rounded-md bg-green-50">
            <Check className="h-4 w-4" />
            <span>Already in your contacts</span>
          </div>
        );
      } else if (contactStatus.requestStatus === 'pending') {
        return (
          <div className="flex items-center gap-2 text-amber-600 mt-4 p-2 rounded-md bg-amber-50">
            <AlertCircle className="h-4 w-4" />
            <span>Contact request already sent</span>
          </div>
        );
      } else if (contactStatus.requestStatus === 'rejected') {
        return (
          <div className="flex items-center gap-2 text-red-600 mt-4 p-2 rounded-md bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <span>Contact request was rejected</span>
          </div>
        );
      }
    }
    
    return (
      <Button 
        onClick={handleSubmit} 
        className="w-full mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Send Contact Request
          </>
        )}
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Search for users or businesses by name or email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search by name, email, or business name..." 
              value={searchQuery}
              onValueChange={handleSearch}
              className="h-9"
            />
            
            {searchQuery.length > 0 && (
              <CommandList>
                {isSearching ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <CommandEmpty>No users or businesses found</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {searchResults.map((user) => (
                      <CommandItem 
                        key={user.id}
                        onSelect={() => selectContact(user)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || ''} />
                          <AvatarFallback>
                            {(user.displayName || user.fullName || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium">
                            {user.displayName || user.fullName || 'Unknown User'}
                          </span>
                          {user.businessName && (
                            <span className="text-xs text-slate-600">{user.businessName}</span>
                          )}
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                        {getAccountTypeBadge(user.accountType)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
          </Command>
          
          {selectedContact && (
            <div className="p-4 border rounded-md mt-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatarUrl || ''} />
                  <AvatarFallback>
                    {(selectedContact.displayName || selectedContact.fullName || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {selectedContact.displayName || selectedContact.fullName || 'Unknown User'}
                    </span>
                    {getAccountTypeBadge(selectedContact.accountType)}
                  </div>
                  {selectedContact.businessName && (
                    <span className="text-sm">{selectedContact.businessName}</span>
                  )}
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedContact.email}
                  </span>
                </div>
              </div>
              
              {isCheckingStatus ? (
                <div className="flex justify-center mt-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                renderContactStatus()
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;

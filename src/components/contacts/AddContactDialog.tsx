import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandGroup } from "@/components/ui/command";
import { SearchResults } from "./SearchResults";
import { ContactPreview } from "./ContactPreview";
import { useContactSearch } from "@/hooks/useContactSearch";
import { Loader2, User, UserPlus, AlertCircle, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Clear search when dialog closes
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

  // Debug logs
  console.log("[AddContactDialog] Current state:", {
    searchQuery,
    searchResults,
    isSearching,
    selectedContact,
    contactStatus
  });

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
                <CommandGroup>
                  {isSearching ? (
                    <div className="flex justify-center p-4">
                      <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <SearchResults 
                      searchResults={searchResults || []}
                      onSelectContact={selectContact}
                    />
                  )}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
          
          {selectedContact && (
            <ContactPreview
              contact={selectedContact}
              contactStatus={contactStatus}
              isCheckingStatus={isCheckingStatus}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              getAccountTypeBadge={getAccountTypeBadge}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;

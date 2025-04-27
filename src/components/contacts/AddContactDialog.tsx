
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
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
    searchResults: Array.isArray(searchResults) ? searchResults : 'Not an array',
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
                {isSearching ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <SearchResults 
                    searchResults={searchResults || []}
                    onSelectContact={selectContact}
                  />
                )}
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

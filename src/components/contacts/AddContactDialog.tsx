
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactPreview } from "./ContactPreview";
import { ContactSearchInput } from "./ContactSearchInput";
import { useContactSearch } from "@/hooks/useContactSearch";
import { Loader2, UserPlus } from "lucide-react";
import { ContactRequestStatus, ContactRequestStatusValue } from "@/types/invitation.types";

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
    searchUsers,
    searchResults,
    isSearching,
    searchQuery,
    selectedContact,
    contactStatus,
    isCheckingStatus,
    handleSearchChange,
    selectContact,
    clearSearch
  } = useContactSearch();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [contactRequestStatus, setContactRequestStatus] = useState<ContactRequestStatus>({
    requestExists: false,
    requestStatus: null
  });

  // Clear search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  // Update contactRequestStatus when contactStatus changes
  useEffect(() => {
    if (contactStatus === 'pending') {
      setContactRequestStatus({
        requestExists: true,
        requestStatus: 'pending'
      });
    } else if (contactStatus === 'accepted') {
      setContactRequestStatus({
        requestExists: true,
        requestStatus: 'accepted'
      });
    } else {
      setContactRequestStatus({
        requestExists: false,
        requestStatus: null
      });
    }
  }, [contactStatus]);

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

  // Create account type badge rendering function
  const getAccountTypeBadge = (accountType: string) => {
    // This function is passed to ContactPreview
    // The implementation is already there in ContactPreview component
    return null;
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
          <ContactSearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchResults={searchResults}
            isSearching={isSearching}
            onSelectContact={selectContact}
          />
          
          {selectedContact && (
            <ContactPreview
              contact={selectedContact}
              contactStatus={contactRequestStatus}
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

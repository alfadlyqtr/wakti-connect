
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserSearchResult, ContactRequestStatus } from "@/types/invitation.types";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Loader2, UserPlus } from "lucide-react";

interface ContactPreviewProps {
  contact: UserSearchResult;
  contactStatus: ContactRequestStatus | null;
  isCheckingStatus: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  getAccountTypeBadge: (accountType: string) => JSX.Element;
}

export const ContactPreview = ({
  contact,
  contactStatus,
  isCheckingStatus,
  isSubmitting,
  onSubmit,
  getAccountTypeBadge
}: ContactPreviewProps) => {
  if (!contact) return null;

  const renderContactStatus = () => {
    if (!contactStatus) return null;
    
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
        onClick={onSubmit} 
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
    <div className="p-4 border rounded-md mt-2">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatarUrl || ''} />
          <AvatarFallback>
            {(contact.displayName || contact.fullName || 'U').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {contact.displayName || contact.fullName || 'Unknown User'}
            </span>
            {getAccountTypeBadge(contact.accountType || 'free')}
          </div>
          {contact.businessName && (
            <span className="text-sm">{contact.businessName}</span>
          )}
          <span className="text-xs text-muted-foreground truncate">
            {contact.email}
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
  );
};

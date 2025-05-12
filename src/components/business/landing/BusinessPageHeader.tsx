
import React, { useState, useEffect } from "react";
import { BusinessProfile } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/hooks/useContacts";
import { useContactSearch } from "@/hooks/useContactSearch";
import { Loader2, User, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export interface BusinessPageHeaderProps {
  business: BusinessProfile;
  isPreviewMode?: boolean;
  isAuthenticated?: boolean | null;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode,
  isAuthenticated,
}) => {
  const { sendContactRequest } = useContacts();
  const { checkContactRequest } = useContactSearch();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<'pending' | 'accepted' | 'none'>('none');

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && !isPreviewMode && business.id) {
        try {
          const result = await checkContactRequest(business.id);
          if (result.requestExists) {
            // Convert the result to our component's expected status type
            if (result.requestStatus === 'pending') {
              setContactStatus('pending');
            } else if (result.requestStatus === 'accepted') {
              setContactStatus('accepted');
            } else {
              setContactStatus('none');
            }
          }
        } catch (error) {
          console.error('Error checking contact status:', error);
        }
      }
    };
    
    checkStatus();
  }, [isAuthenticated, isPreviewMode, business.id, checkContactRequest]);

  const handleAddContact = async () => {
    if (!isAuthenticated || !business.id) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to add this business to your contacts",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingContact(true);
    try {
      await sendContactRequest.mutateAsync(business.id);
      setContactStatus('pending');
      toast({
        title: "Contact Request Sent",
        description: "Your request to connect has been sent",
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Failed to Send Request",
        description: "There was an error sending your contact request",
        variant: "destructive",
      });
    } finally {
      setIsAddingContact(false);
    }
  };

  // Render different button states based on contact status
  const renderContactButton = () => {
    if (contactStatus === 'accepted') {
      return (
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          In Contacts
        </Button>
      );
    }

    if (contactStatus === 'pending') {
      return (
        <Button variant="outline" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Request Pending
        </Button>
      );
    }

    return (
      <Button 
        onClick={handleAddContact}
        disabled={isAddingContact}
        variant="default"
        className="bg-primary hover:bg-primary/90"
      >
        {isAddingContact ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Adding...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Add to Contacts
          </>
        )}
      </Button>
    );
  };
  
  return (
    <div className="business-page-header py-8">
      <div className="flex flex-col items-center">
        {business.avatar_url && (
          <div className="mb-4">
            <img 
              src={business.avatar_url} 
              alt={business.business_name || "Business"} 
              className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
            />
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {business.business_name || "Business Name"}
        </h1>
        
        {!isPreviewMode && isAuthenticated && (
          <div className="mt-2 mb-4">
            {renderContactButton()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPageHeader;

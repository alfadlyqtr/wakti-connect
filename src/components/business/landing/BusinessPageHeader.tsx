
import React from "react";
import { BusinessProfile } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { useContactSearch } from "@/hooks/useContactSearch";
import { useContacts } from "@/hooks/useContacts";
import { Loader2, User, UserPlus } from "lucide-react";

export interface BusinessPageHeaderProps {
  business: BusinessProfile;
  isPreviewMode?: boolean;
  isAuthenticated?: boolean;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode,
  isAuthenticated,
}) => {
  console.log("BusinessPageHeader component rendering with:", business);
  
  // Use contacts system instead of subscribers
  const { sendContactRequest } = useContacts();
  const { checkStatus, isCheckingStatus } = useContactSearch();

  const [isAddingContact, setIsAddingContact] = React.useState(false);
  const [contactStatus, setContactStatus] = React.useState<'none' | 'pending' | 'accepted'>('none');

  React.useEffect(() => {
    // Only check status if user is authenticated and not in preview mode
    if (isAuthenticated && !isPreviewMode && business.id) {
      checkStatus.mutate(business.id, {
        onSuccess: (data) => {
          if (data.requestExists) {
            setContactStatus(data.requestStatus as 'pending' | 'accepted');
          } else {
            setContactStatus('none');
          }
        }
      });
    }
  }, [isAuthenticated, isPreviewMode, business.id, checkStatus]);

  const handleAddContact = async () => {
    if (!isAuthenticated || !business.id) return;
    
    setIsAddingContact(true);
    try {
      await sendContactRequest.mutateAsync(business.id);
      setContactStatus('pending');
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setIsAddingContact(false);
    }
  };

  // Render different button states based on contact status
  const renderContactButton = () => {
    if (isCheckingStatus) {
      return (
        <Button disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Checking...
        </Button>
      );
    }

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
        variant="gradient"
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
              onError={(e) => {
                console.error("Error loading avatar image:", e);
                // Don't hide the image container, just log the error
              }}
            />
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{business.business_name || "Business Name"}</h1>
        
        {/* Contact button instead of subscribe button */}
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

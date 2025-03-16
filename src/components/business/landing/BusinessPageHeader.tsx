
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BusinessPage } from "@/types/business.types";

interface BusinessPageHeaderProps {
  businessPage: BusinessPage;
  isPreviewMode: boolean;
  isAuthenticated: boolean | null;
  isSubscribed: boolean;
  subscriptionId: string | null;
  checkingSubscription: boolean;
  subscribe: any;
  unsubscribe: any;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  businessPage,
  isPreviewMode,
  isAuthenticated,
  isSubscribed,
  subscriptionId,
  checkingSubscription,
  subscribe,
  unsubscribe
}) => {
  const handleSubscribe = () => {
    if (!businessPage?.business_id) return;
    subscribe.mutate(businessPage.business_id);
  };
  
  const handleUnsubscribe = () => {
    if (!subscriptionId) return;
    unsubscribe.mutate(subscriptionId);
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {businessPage.logo_url ? (
            <img 
              src={businessPage.logo_url} 
              alt={`${businessPage.page_title} logo`}
              className="h-8 w-auto"
            />
          ) : null}
          <span className="font-medium">{businessPage.page_title}</span>
        </div>
        
        <div>
          {!isPreviewMode && isAuthenticated !== null && (
            checkingSubscription ? (
              <Button variant="outline" disabled size="sm">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </Button>
            ) : isSubscribed ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUnsubscribe}
                disabled={unsubscribe.isPending}
              >
                {unsubscribe.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Unsubscribe
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={handleSubscribe}
                disabled={subscribe.isPending}
              >
                {subscribe.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Subscribe
              </Button>
            )
          )}
          
          {isPreviewMode && (
            <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-3 py-1 rounded-full font-medium">
              Preview Mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPageHeader;

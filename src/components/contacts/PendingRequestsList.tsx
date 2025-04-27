
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserContact } from "@/types/invitation.types";

interface PendingRequestsListProps {
  pendingRequests: UserContact[];
  isLoading: boolean;
  direction: string;
  onRespondToRequest?: (requestId: string, accept: boolean) => Promise<void>;
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ 
  pendingRequests, 
  isLoading,
  direction,
  onRespondToRequest 
}) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading requests...</p>
      </div>
    );
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="py-10 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={request.contactProfile?.avatarUrl || ''} />
              <AvatarFallback>
                {request.contactProfile?.displayName?.charAt(0) || 
                 request.contactProfile?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {request.contactProfile?.displayName || 
                   request.contactProfile?.fullName || 'Unknown User'}
                </p>
                {request.contactProfile?.accountType === 'business' ? (
                  <Badge variant="outline" className="bg-blue-50">Business</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50">Individual</Badge>
                )}
              </div>
              {request.contactProfile?.businessName && (
                <p className="text-sm">{request.contactProfile.businessName}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {request.contactProfile?.email || request.user_id}
              </p>
            </div>
          </div>
          {direction === 'incoming' && onRespondToRequest && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-green-200 hover:bg-green-50"
                onClick={() => onRespondToRequest(request.id, true)}
              >
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-200 hover:bg-red-50"
                onClick={() => onRespondToRequest(request.id, false)}
              >
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingRequestsList;


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContact } from "@/types/invitation.types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { NotificationError } from '../notifications/NotificationError';

interface PendingRequestsTabsProps {
  incomingRequests: UserContact[];
  outgoingRequests: UserContact[];
  isLoading: boolean;
  onRespondToRequest: (requestId: string, accept: boolean) => Promise<void>;
}

const PendingRequestsTabs: React.FC<PendingRequestsTabsProps> = ({
  incomingRequests,
  outgoingRequests,
  isLoading,
  onRespondToRequest
}) => {
  const renderContactInfo = (request: UserContact) => {
    if (!request) {
      return <NotificationError />;
    }

    const displayName = request.contactProfile?.displayName || 
                       request.contactProfile?.fullName || 
                       request.contactProfile?.email || 
                       'Unknown User';

    const avatarLetter = ((request.contactProfile?.displayName?.[0] || 
                          request.contactProfile?.fullName?.[0] || 
                          displayName[0]) || '?').toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={request.contactProfile?.avatarUrl || ''} />
          <AvatarFallback>{avatarLetter}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {displayName}
            </p>
            {request.contactProfile?.accountType === 'business' ? (
              <Badge variant="outline" className="bg-blue-50">Business</Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50">Individual</Badge>
            )}
          </div>
          {request.contactProfile?.businessName && (
            <p className="text-sm text-muted-foreground">{request.contactProfile.businessName}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {request.contactProfile?.email || request.contactId}
          </p>
          {!request.contactProfile && (
            <p className="text-xs text-amber-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Limited profile information available
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue="incoming">
      <TabsList>
        <TabsTrigger value="incoming">
          Incoming Requests
          {incomingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-2">{incomingRequests.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="outgoing">
          Outgoing Requests
          {outgoingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-2">{outgoingRequests.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">
        {isLoading ? (
          <div className="py-10 text-center">
            <p>Loading requests...</p>
          </div>
        ) : incomingRequests.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>No pending incoming requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
                {renderContactInfo(request)}
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
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="outgoing">
        {isLoading ? (
          <div className="py-10 text-center">
            <p>Loading requests...</p>
          </div>
        ) : outgoingRequests.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>No pending outgoing requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10">
                {renderContactInfo(request)}
                <Badge variant="secondary">Awaiting Response</Badge>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PendingRequestsTabs;

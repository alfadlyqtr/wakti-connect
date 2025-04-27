
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PendingRequestsList from "./PendingRequestsList";
import { UserContact } from "@/types/invitation.types";

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
  return (
    <Tabs defaultValue="incoming">
      <TabsList className="mb-4">
        <TabsTrigger value="incoming">
          Incoming Requests
          {incomingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {incomingRequests.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="outgoing">
          Outgoing Requests
          {outgoingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {outgoingRequests.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="incoming">
        <PendingRequestsList
          pendingRequests={incomingRequests}
          isLoading={isLoading}
          direction="incoming"
          onRespondToRequest={onRespondToRequest}
        />
      </TabsContent>
      
      <TabsContent value="outgoing">
        <PendingRequestsList
          pendingRequests={outgoingRequests}
          isLoading={isLoading}
          direction="outgoing"
        />
      </TabsContent>
    </Tabs>
  );
};

export default PendingRequestsTabs;

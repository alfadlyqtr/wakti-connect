
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

const EmptyInvitationsState = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Invitations</h3>
        <p className="text-muted-foreground mb-4">
          You haven't sent any staff invitations yet.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyInvitationsState;

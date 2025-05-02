
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileData {
  account_type: "individual" | "business" | "free";
  id?: string;
  created_at?: string;
}

interface AccountDetailsCardProps {
  profile: ProfileData | undefined;
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>
          Your account information and subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Account Type</h4>
            <div className="flex items-center mt-1">
              <p className="capitalize font-medium">{profile?.account_type}</p>
              {profile?.account_type === "free" && (
                <span className="ml-2 inline-flex items-center rounded-full bg-wakti-gold/10 px-2 py-1 text-xs font-medium text-wakti-gold">
                  Free
                </span>
              )}
              {profile?.account_type === "individual" && (
                <span className="ml-2 inline-flex items-center rounded-full bg-wakti-blue/10 px-2 py-1 text-xs font-medium text-wakti-blue">
                  Individual
                </span>
              )}
              {profile?.account_type === "business" && (
                <span className="ml-2 inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                  Business
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Email Address</h4>
            <p>{profile?.id || "Not available"}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Account Created</h4>
            <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not available"}</p>
          </div>

          {profile?.account_type === "free" && (
            <Button 
              className="w-full mt-4"
              variant="default"
              onClick={() => window.location.href = "/dashboard/upgrade"}
            >
              Upgrade Account
            </Button>
          )}

          <Button 
            className="w-full mt-2"
            variant="outline"
            onClick={() => window.location.href = "/dashboard/billing"}
          >
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;

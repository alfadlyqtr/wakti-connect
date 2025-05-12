
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import BusinessPageUrlCard from "./BusinessPageUrlCard";

interface BusinessProfileInfoProps {
  profile: Tables<"profiles">;
}

const BusinessProfileInfo: React.FC<BusinessProfileInfoProps> = ({ profile }) => {
  return (
    <>
      {/* Add the new URL card first */}
      <BusinessPageUrlCard profile={profile} />
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            Business Profile
          </CardTitle>
          <CardDescription>
            Manage your business information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Business Name</h3>
              <p className="text-muted-foreground">{profile.business_name || "Not set"}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Account Type</h3>
              <p className="text-muted-foreground capitalize">{profile.account_type}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BusinessProfileInfo;

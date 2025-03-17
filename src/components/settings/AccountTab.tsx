
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import AccountInfoForm from "./account/AccountInfoForm";
import PasswordForm from "./account/PasswordForm";

interface AccountTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const AccountTab: React.FC<AccountTabProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details and personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <AccountInfoForm profile={profile} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;

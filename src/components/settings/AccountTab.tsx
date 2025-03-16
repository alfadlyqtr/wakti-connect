
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";

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
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" defaultValue={profile?.full_name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" defaultValue={profile?.email || ''} />
          </div>
          <Button className="w-full sm:w-auto">Save Changes</Button>
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
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button className="w-full sm:w-auto">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;

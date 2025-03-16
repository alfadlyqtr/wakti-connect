
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/integrations/supabase/types";

interface ProfileTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your public profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback>
              {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline">Change Picture</Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input id="displayName" placeholder="Display name" defaultValue={profile?.display_name || ''} />
        </div>
        
        {profile?.account_type === 'business' && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" placeholder="Business name" defaultValue={profile?.business_name || ''} />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Tell us about yourself"
            defaultValue={profile?.occupation || ''}
          />
        </div>
        
        <Button>Save Profile</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;

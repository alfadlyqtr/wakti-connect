
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import useIsMobile from "@/hooks/use-mobile";
import ProfileAvatar from "./profile/ProfileAvatar";
import ProfileForm from "./profile/ProfileForm";

interface ProfileTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  const isMobile = useIsMobile();
  
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Info</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const isBusinessAccount = profile.account_type === 'business';
  
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isBusinessAccount ? "Business Design" : "Profile Information"}</CardTitle>
            <CardDescription>
              {isBusinessAccount
                ? "Update your business profile appearance"
                : "Update your public profile information"}
            </CardDescription>
          </div>
          {isBusinessAccount && (
            <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-2 py-1 rounded-full">
              Business Account
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-4 sm:px-6">
        <div className={`${isMobile ? 'flex flex-col' : 'flex items-center'} gap-4 mb-5`}>
          <ProfileAvatar profile={profile} />
        </div>
        
        <ProfileForm profile={profile} />
      </CardContent>
    </Card>
  );
};

export default ProfileTab;

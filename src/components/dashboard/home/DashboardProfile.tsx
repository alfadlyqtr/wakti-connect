
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardProfile = ({ profileData }: { profileData: any }) => {
  const displayName = profileData?.display_name || profileData?.full_name || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileData?.avatar_url} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{profileData?.account_type}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfile;

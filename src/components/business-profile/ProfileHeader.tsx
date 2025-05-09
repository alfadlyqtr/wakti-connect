
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PublicBusinessProfile } from '@/services/profile/getPublicProfile';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  profile: PublicBusinessProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const initials = profile.business_name
    ? profile.business_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'B';

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-32"></div>
      <CardContent className="-mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.business_name || 'Business'} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 pt-4 md:pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl font-bold">{profile.business_name}</h1>
              <Badge variant="outline" className="bg-blue-50">Business</Badge>
            </div>
            {profile.business_type && (
              <div className="text-sm text-muted-foreground mt-1">{profile.business_type}</div>
            )}
          </div>
        </div>
        
        {profile.business_address && (
          <div className="mt-6 text-muted-foreground">
            <p className="whitespace-pre-wrap">{profile.business_address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;

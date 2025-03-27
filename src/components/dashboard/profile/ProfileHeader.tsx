
import React from "react";

interface ProfileHeaderProps {
  isLoading: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isLoading }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground">
        View and update your profile information
      </p>
    </div>
  );
};

export default ProfileHeader;

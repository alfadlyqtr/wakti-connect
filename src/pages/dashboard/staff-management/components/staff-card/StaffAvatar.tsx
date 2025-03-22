
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "../../types";

interface StaffAvatarProps {
  fullName: string;
  profile?: Profile | null;
}

const StaffAvatar: React.FC<StaffAvatarProps> = ({ fullName, profile }) => {
  // Generate initials for avatar fallback
  const initials = fullName
    ? fullName.split(" ").map(part => part.charAt(0)).join("").toUpperCase().substring(0, 2)
    : "ST";
    
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={profile?.avatar_url || ""} alt={fullName} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default StaffAvatar;

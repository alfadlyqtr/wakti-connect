
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarSectionProps {
  profile: {
    avatar_url: string | null;
    display_name: string | null;
    full_name: string | null;
    account_type: "free" | "individual" | "business";
    business_name: string | null;
    occupation: string | null;
  } | undefined;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({ profile }) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || "";
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Get appropriate role display
  const getRoleDisplay = () => {
    if (profile?.account_type === 'business') {
      return profile?.business_name || "Business Administrator";
    }
    
    if (profile?.account_type === 'individual') {
      return profile?.occupation || "Professional";
    }
    
    return "Personal User";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 pb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
        <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-lg font-medium">{profile?.display_name || profile?.full_name || getRoleDisplay()}</h3>
        <p className="text-sm text-muted-foreground capitalize">{profile?.account_type} Account</p>
      </div>
    </div>
  );
};

export default ProfileAvatarSection;

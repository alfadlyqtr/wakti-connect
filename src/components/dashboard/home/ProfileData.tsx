
import React from "react";
import { Building, UserCircle, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDataProps {
  profileData: {
    full_name: string | null;
    display_name: string | null;
    business_name: string | null;
    occupation: string | null;
    account_type: "free" | "individual" | "business";
    avatar_url: string | null;
  };
}

export const ProfileData = ({ profileData }: ProfileDataProps) => {
  // Get display name for welcome message
  const getDisplayName = () => {
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.full_name) return profileData.full_name;
    return '';
  };

  // Get account specific welcome title
  const getWelcomeTitle = () => {
    switch (profileData?.account_type) {
      case 'business':
        return 'Business Dashboard';
      case 'individual':
        return 'Professional Dashboard';
      default:
        return 'Personal Dashboard';
    }
  };

  const getAccountIcon = () => {
    switch (profileData?.account_type) {
      case 'business':
        return <Building className="text-green-500 h-6 w-6" />;
      case 'individual':
        return <Briefcase className="text-wakti-blue h-6 w-6" />;
      default:
        return <UserCircle className="text-wakti-gold h-6 w-6" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getWelcomeTitle()}
        </h1>
        <p className="text-muted-foreground">
          Welcome back{getDisplayName() ? `, ${getDisplayName()}` : ''}!
        </p>
      </div>
      
      <div className="flex items-center gap-3 p-2 bg-card rounded-lg border shadow-sm">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profileData?.avatar_url || undefined} alt="Profile" />
          <AvatarFallback className="bg-primary/10">
            {getDisplayName()?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center">
            {getAccountIcon()}
            <span className="ml-1 text-sm font-medium capitalize">
              {profileData?.account_type || 'Free'} Account
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {profileData?.business_name ? `${profileData.business_name}` : 
             profileData?.occupation ? `${profileData.occupation}` : 'Personal User'}
          </p>
        </div>
      </div>
    </div>
  );
};

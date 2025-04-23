
import React from "react";
import { Card } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { cn } from "@/lib/utils";

const DashboardProfilePreview = () => {
  const { data: profile } = useProfileSettings();

  const getRoleDisplay = () => {
    if (profile?.account_type === 'business') return profile?.business_name || "Business Administrator";
    if (profile?.account_type === 'individual') return profile?.occupation || "Professional";
    return "Personal User";
  };
  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || "";
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "?";
  };

  return (
    <Card className={cn(
      "flex items-center gap-3 p-3 rounded-xl shadow border border-gray-200/70 bg-background",
      "max-w-xs w-full mx-auto", // Compact width, center
      "transition-all duration-300"
    )}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
        <AvatarFallback className="text-base bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center flex-1">
        <span className="font-medium text-base truncate">
          {profile?.display_name || profile?.full_name || "Welcome"}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {profile?.account_type ? (
            <span>{profile.account_type} Account</span>
          ) : "Loading..."}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {getRoleDisplay()}
        </span>
      </div>
      <UserCircle className="h-5 w-5 text-indigo-400 hidden md:inline" />
    </Card>
  );
};

export default DashboardProfilePreview;

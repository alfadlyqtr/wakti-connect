
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { cn } from "@/lib/utils";

const DashboardProfilePreview = () => {
  const { data: profile } = useProfileSettings();

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

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || "";
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <Card className="bg-gradient-to-br from-[#6366F1]/10 via-white/80 to-[#8B5CF6]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-indigo-500" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
            <AvatarFallback className="text-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="font-medium text-lg">
              {profile?.display_name || profile?.full_name || "Welcome"}
            </h3>
            <p className={cn(
              "text-sm text-muted-foreground",
              !profile?.account_type && "animate-pulse bg-muted rounded"
            )}>
              {profile?.account_type ? (
                <span className="capitalize">{profile.account_type} Account</span>
              ) : "Loading..."}
            </p>
            <p className="text-sm text-muted-foreground">{getRoleDisplay()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfilePreview;

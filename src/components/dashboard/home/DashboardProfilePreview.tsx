
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  business: "bg-wakti-blue/90 text-white border-wakti-blue",
  individual: "bg-wakti-gold/90 text-wakti-navy border-wakti-gold",
  free: "bg-muted text-muted-foreground border-muted",
  staff: "bg-muted text-muted-foreground border-muted",
  "super-admin": "bg-wakti-navy/90 text-white border-wakti-navy",
};

const DashboardProfilePreview = () => {
  // Simulated useProfileSettings, replace with actual import in your context
  // const { data: profile } = useProfileSettings();
  // Mock data for design. Remove in real usage.
  const profile: any = null;

  // Get the initials
  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || "";
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  // Get profile name
  const getName = () => profile?.display_name || profile?.full_name || "Welcome";

  // Show account type as badge
  const getType = () => profile?.account_type || "free";

  // Slim: only show name and badge. Role in tooltip (skip for now).
  return (
    <Card
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl shadow-md border border-border",
        "bg-gradient-to-r from-card/90 via-wakti-beige/50 to-card/90 dark:from-[#18203a]/90 dark:via-wakti-navy/50 dark:to-[#141828]/90",
        "transition-shadow duration-300 hover:shadow-lg hover:scale-[1.01]"
      )}
      style={{
        minHeight: 0,
        height: "56px",
        maxWidth: 340,
        margin: "0 auto",
      }}
      data-testid="dashboard-profile-preview"
    >
      <div className={cn(
        "relative flex items-center justify-center h-8 w-8 rounded-full",
        "bg-gradient-to-br from-wakti-blue/20 via-wakti-gold/10 to-wakti-navy/10 border-2 shadow",
        "ring-2 ring-wakti-blue/40"
      )}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-wakti-blue via-wakti-gold to-wakti-navy text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <span className="font-medium text-sm truncate leading-tight text-foreground">{getName()}</span>
      </div>
      <span
        className={cn(
          "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border",
          ACCOUNT_TYPE_COLORS[getType()] || ACCOUNT_TYPE_COLORS["free"],
          "capitalize"
        )}
        style={{ minWidth: 64, textAlign: "center", letterSpacing: "0.03em" }}
      >
        {getType()}
      </span>
    </Card>
  );
};

export default DashboardProfilePreview;

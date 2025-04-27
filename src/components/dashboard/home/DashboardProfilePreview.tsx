
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  business: "bg-wakti-blue/90 text-white border-wakti-blue",
  individual: "bg-wakti-gold/90 text-wakti-navy border-wakti-gold",
  free: "bg-muted text-muted-foreground border-muted",
  staff: "bg-muted text-muted-foreground border-muted",
  "super-admin": "bg-wakti-navy/90 text-white border-wakti-navy",
};

const DashboardProfilePreview = () => {
  // Real profile settings
  const { data: profile, isLoading, error } = useProfileSettings();

  // Get initials
  const getInitials = () => {
    const name =
      profile?.display_name ||
      profile?.business_name ||
      profile?.full_name ||
      "";
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (profile?.account_type === "business" && profile?.business_name) {
      // Use first 2 letters of business name if present
      return (
        profile.business_name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      );
    }
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  // Get profile name
  const getName = () =>
    profile?.display_name ||
    profile?.business_name ||
    profile?.full_name ||
    "User";

  // Show account type badge
  const getType = () => profile?.account_type || "free";

  if (isLoading) {
    return (
      <Card
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl shadow-md border border-border",
          "bg-gradient-to-r from-card/90 via-wakti-beige/50 to-card/90 dark:from-[#18203a]/90 dark:via-wakti-navy/50 dark:to-[#141828]/90",
          "transition-shadow duration-300"
        )}
        style={{
          minHeight: 0,
          height: "56px",
          maxWidth: 340,
          margin: "0 auto",
        }}
        data-testid="dashboard-profile-preview"
      >
        <LoadingSpinner size="sm" className="mr-2" />
        <span className="text-sm text-muted-foreground">Loading profile…</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl shadow-md border border-border bg-destructive/5"
        )}
        style={{
          minHeight: 0,
          height: "56px",
          maxWidth: 340,
          margin: "0 auto",
        }}
        data-testid="dashboard-profile-preview"
      >
        <span className="text-xs text-destructive">
          Error loading profile.
        </span>
      </Card>
    );
  }

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
      <div
        className={cn(
          "relative flex items-center justify-center h-8 w-8 rounded-full",
          "bg-gradient-to-br from-wakti-blue/20 via-wakti-gold/10 to-wakti-navy/10 border-2 shadow",
          "ring-2 ring-wakti-blue/40"
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-wakti-blue via-wakti-gold to-wakti-navy text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <span className="font-medium text-sm truncate leading-tight text-foreground">
          {getName()}
        </span>
      </div>
      <span
        className={cn(
          "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border",
          ACCOUNT_TYPE_COLORS[getType()] || ACCOUNT_TYPE_COLORS["free"],
          "capitalize"
        )}
        style={{
          minWidth: 64,
          textAlign: "center",
          letterSpacing: "0.03em",
        }}
      >
        {getType()}
      </span>
    </Card>
  );
};

export default DashboardProfilePreview;

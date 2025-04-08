
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshBusinessAnalytics } from "@/utils/businessAnalyticsUtils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

interface RefreshAnalyticsButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "link";
}

export const RefreshAnalyticsButton: React.FC<RefreshAnalyticsButtonProps> = ({ 
  size = "sm",
  variant = "outline"
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const success = await refreshBusinessAnalytics();
      
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['businessAnalytics'] });
        toast({
          title: "Analytics Refreshed",
          description: "Your business analytics data has been updated",
        });
      } else {
        toast({
          title: "Refresh Failed",
          description: "Unable to refresh analytics data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error refreshing analytics:", error);
      toast({
        title: "Error",
        description: "An error occurred while refreshing analytics data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <Button
      onClick={handleRefresh}
      size={size}
      variant={variant}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? "Refreshing..." : "Refresh Data"}
    </Button>
  );
};

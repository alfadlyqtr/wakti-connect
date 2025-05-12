
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Facebook, Twitter } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BusinessPageUrlProps {
  profile: Tables<"profiles">;
}

const BusinessPageUrlCard: React.FC<BusinessPageUrlProps> = ({ profile }) => {
  const { updateProfile, isUpdating } = useProfileSettings();
  const [slug, setSlug] = useState<string>(profile.slug || "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
  // Business URL format
  const businessUrl = profile.slug 
    ? `${window.location.origin}/business/${profile.slug}`
    : "No URL set";
  
  const handleSaveSlug = async () => {
    try {
      await updateProfile({
        slug
      });
      
      setIsEditing(false);
      toast({
        title: "URL updated",
        description: "Your business page URL has been updated successfully."
      });
      
      // Note: We don't have a refetch function available, but the UI will update
      // because useProfileSettings will invalidate the query cache after an update
    } catch (error) {
      toast({
        title: "Failed to update URL",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const shareBusinessPage = async () => {
    // Try using Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.business_name || "My Business",
          text: `Check out ${profile.business_name || "my business"} page`,
          url: businessUrl,
        });
        return;
      } catch (error) {
        console.log("Error sharing:", error);
        // Fall through to other sharing methods
      }
    }
    
    // If Web Share API is not available or failed, do nothing
    // The dropdown menu will handle sharing options
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(businessUrl).then(() => {
      toast({
        title: "URL copied",
        description: "Business page URL copied to clipboard"
      });
    });
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(businessUrl)}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(businessUrl)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(businessUrl)}`, '_blank');
  };
  
  const handleEditCancel = () => {
    setSlug(profile.slug || "");
    setIsEditing(false);
  };
  
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Business Page URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter a unique identifier for your business"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your business will be available at: {window.location.origin}/business/<span className="font-semibold">{slug || "your-slug"}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveSlug} 
                  disabled={isUpdating || !slug}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm break-all">{businessUrl}</p>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault();
                          shareBusinessPage();
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={shareOnWhatsApp}>
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          <span>WhatsApp</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={shareOnFacebook}>
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4" />
                          <span>Facebook</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={shareOnTwitter}>
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={copyToClipboard}>
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>Copy link</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {profile.slug ? (
                  <p className="text-xs text-muted-foreground">This is your public business page URL</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Set a URL to make your business page accessible online</p>
                )}
              </div>
              <Button 
                variant={profile.slug ? "outline" : "default"} 
                onClick={() => setIsEditing(true)}
                className="whitespace-nowrap"
              >
                {profile.slug ? "Edit URL" : "Set URL"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPageUrlCard;

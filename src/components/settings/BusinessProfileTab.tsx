
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { User, Share2, Copy, ExternalLink } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import ProfileForm from "./profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/utils/string-utils";
import { useNavigate } from "react-router-dom";

const BusinessProfileTab: React.FC = () => {
  const { data: profile, isLoading, updateProfile } = useProfileSettings();
  const { isStaff } = useStaffPermissions();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const navigate = useNavigate();
  
  const handleGenerateSlug = async () => {
    if (!profile || !profile.business_name) {
      toast({
        variant: "destructive",
        title: "Cannot generate profile link",
        description: "Please add a business name first."
      });
      return;
    }
    
    const newSlug = generateSlug(profile.business_name);
    try {
      await updateProfile({
        slug: newSlug
      });
      
      toast({
        title: "Profile URL generated",
        description: "Your business profile is now shareable."
      });
    } catch (error) {
      console.error("Error generating slug:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate profile URL. Please try again."
      });
    }
  };
  
  const handleCopyProfileLink = () => {
    if (!profile?.slug) return;
    
    const url = `${window.location.origin}/profile/${profile.slug}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Profile link copied to clipboard"
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  };
  
  const handleViewProfile = () => {
    if (!profile?.slug) return;
    window.open(`/profile/${profile.slug}`, '_blank');
  };
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Could not load profile. Please refresh the page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-wakti-blue" />
            <div>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>
                {isStaff 
                  ? "View business information" 
                  : "Manage your business information and contact details"}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-3 py-1 rounded-full font-medium">
              Business Account
            </span>
            
            {!isStaff && (
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Business Profile</DialogTitle>
                    <DialogDescription>
                      Generate a public link to share your business profile on social media or with customers.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-3">
                    {profile.slug ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={`${window.location.origin}/profile/${profile.slug}`}
                            readOnly
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleCopyProfileLink}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleViewProfile}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={() => setShowShareDialog(false)}>Done</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          You need to generate a profile URL before you can share your business profile.
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowShareDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleGenerateSlug}>
                            Generate Profile URL
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-4 sm:px-6 pt-4">
        <ProfileForm profile={profile} />
        
        {profile.slug && !isStaff && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Public Profile URL</h3>
                <p className="text-xs text-muted-foreground">
                  <a 
                    href={`/profile/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-wakti-blue"
                  >
                    {window.location.origin}/profile/{profile.slug}
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyProfileLink}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewProfile}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessProfileTab;

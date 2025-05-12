
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Copy, Globe } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateSlug } from "@/utils/string-utils";

interface BusinessPageUrlCardProps {
  profile: Tables<"profiles">;
}

const BusinessPageUrlCard: React.FC<BusinessPageUrlCardProps> = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [slugValue, setSlugValue] = useState(profile.slug || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProfile } = useProfileSettings();

  const isNewProfile = !profile.slug;
  
  const handleSaveSlug = async () => {
    if (!slugValue.trim()) {
      toast({
        title: "URL slug required",
        description: "Please enter a URL slug for your business page",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a valid URL-friendly slug
    const validSlug = generateSlug(slugValue);
    
    if (validSlug !== slugValue) {
      setSlugValue(validSlug);
      toast({
        title: "Slug format adjusted",
        description: "Your URL slug has been adjusted to be URL-friendly",
        variant: "default"
      });
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if slug already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', validSlug)
        .not('id', 'eq', profile.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingProfile) {
        toast({
          title: "Slug already taken",
          description: "This URL is already in use. Please choose another one.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Update the profile with the new slug
      await updateProfile({ slug: validSlug });
      
      toast({
        title: "URL updated",
        description: "Your business page URL has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating slug:", error);
      toast({
        title: "Error updating URL",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!profile.slug) {
      toast({
        title: "No URL available",
        description: "Please set a URL slug first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(`${window.location.origin}/${profile.slug}`);
    toast({
      title: "URL copied",
      description: "Your business page URL has been copied to clipboard",
    });
  };

  const getPageUrl = () => {
    return profile.slug ? `${window.location.origin}/${profile.slug}` : "Not set";
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Business Page URL</CardTitle>
            <CardDescription>
              Your custom business page web address
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Your page URL</h3>
              <div className="flex items-center gap-2">
                <div className="bg-gray-50 text-gray-600 p-2 rounded-md flex-1 overflow-x-auto whitespace-nowrap">
                  {getPageUrl()}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={copyToClipboard}
                  disabled={!profile.slug}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {profile.slug && !isNewProfile && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Changing your URL after sharing it publicly may break existing links.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={() => setIsEditing(true)} 
              variant={isNewProfile ? "default" : "outline"}
              className={isNewProfile ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""}
            >
              {isNewProfile ? "Set your page URL" : "Change URL"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="slug" className="text-sm font-medium mb-1 block">
                Custom URL slug
              </label>
              <div className="flex items-center bg-gray-50 rounded-md border">
                <span className="text-gray-500 pl-3 pr-0">{window.location.origin}/</span>
                <Input
                  id="slug"
                  value={slugValue}
                  onChange={(e) => setSlugValue(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="your-business-name"
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use only lowercase letters, numbers, and hyphens. No spaces.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setSlugValue(profile.slug || "");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSlug}
                disabled={isSubmitting || !slugValue.trim()}
                className="bg-wakti-blue hover:bg-wakti-blue/90"
              >
                {isSubmitting ? "Saving..." : "Save URL"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessPageUrlCard;

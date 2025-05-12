
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Copy, Facebook, Globe, Share2, Twitter } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface BusinessPageUrlCardProps {
  profile: Tables<"profiles">;
}

const BusinessPageUrlCard: React.FC<BusinessPageUrlCardProps> = ({ profile }) => {
  const [slugInput, setSlugInput] = useState(profile.slug || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { refetch } = useProfileSettings();
  
  const validateSlug = (slug: string) => {
    if (!slug) return "URL slug cannot be empty";
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return "URL slug can only contain lowercase letters, numbers, and hyphens";
    }
    if (slug.length < 3) {
      return "URL slug must be at least 3 characters";
    }
    if (slug.length > 30) {
      return "URL slug must be less than 30 characters";
    }
    return null;
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlugInput(value);
    setValidationError(validateSlug(value));
  };
  
  const saveSlug = async () => {
    const error = validateSlug(slugInput);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setIsLoading(true);
    
    // Check if slug is already taken
    const { data, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slugInput)
      .neq("id", profile.id)
      .single();
    
    if (data) {
      setValidationError("This URL is already taken. Please choose another one.");
      setIsLoading(false);
      return;
    }
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ slug: slugInput })
      .eq("id", profile.id);
    
    setIsLoading(false);
    
    if (updateError) {
      toast({
        title: "Error saving URL",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "URL saved",
      description: "Your business page URL has been updated",
    });
    
    setIsEditing(false);
    refetch();
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
  
  // Use Web Share API if available, otherwise open direct sharing links
  const shareBusinessPage = () => {
    if (!profile.slug) return;
    
    const url = `${window.location.origin}/${profile.slug}`;
    const title = `${profile.business_name || "Business"} Page`;
    const text = `Check out ${profile.business_name || "this business"} page: `;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url
      }).catch(err => {
        console.error("Error sharing:", err);
        // Fallback - just copy the URL
        navigator.clipboard.writeText(url);
        toast({
          title: "URL copied",
          description: "Your business page URL has been copied to clipboard",
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(url);
      toast({
        title: "URL copied",
        description: "Your business page URL has been copied to clipboard",
      });
    }
  };
  
  const shareViaWhatsApp = () => {
    if (!profile.slug) return;
    const url = `${window.location.origin}/${profile.slug}`;
    const text = `Check out ${profile.business_name || "this business"}: `;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
  };
  
  const shareViaFacebook = () => {
    if (!profile.slug) return;
    const url = `${window.location.origin}/${profile.slug}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };
  
  const shareViaTwitter = () => {
    if (!profile.slug) return;
    const url = `${window.location.origin}/${profile.slug}`;
    const text = `Check out ${profile.business_name || "this business"}: `;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <Card className="shadow-sm mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Business Page URL</CardTitle>
            <CardDescription>
              Your public business page web address
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">{window.location.origin}/</span>
                    <Input 
                      value={slugInput} 
                      onChange={handleSlugChange} 
                      placeholder="your-business-name"
                      className="flex-grow"
                    />
                  </div>
                </div>
                <Button 
                  onClick={saveSlug} 
                  disabled={!!validationError || isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setSlugInput(profile.slug || "");
                    setValidationError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{window.location.origin}/</span>
                  <span className="font-medium">
                    {profile.slug || (
                      <span className="text-muted-foreground italic">No URL set</span>
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyToClipboard}
                    disabled={!profile.slug}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={!profile.slug}>
                      <Button 
                        variant="outline" 
                        size="icon"
                        title="Share URL"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={shareViaWhatsApp}>
                        <svg 
                          viewBox="0 0 24 24" 
                          width="15" 
                          height="15" 
                          stroke="currentColor" 
                          fill="none" 
                          className="mr-2"
                        >
                          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" 
                            fill="currentColor"
                            strokeWidth="0"
                          ></path>
                          <path d="M20.52 3.449C18.24 1.245 15.24 0.001 12.045 0.001 5.463 0.001 0.102 5.361 0.102 11.945c0 2.104 0.555 4.15 1.619 5.95l-1.719 6.279 6.437-1.689c1.721 0.941 3.669 1.426 5.6 1.426h0.005c6.579 0 11.94-5.356 11.94-11.94 0.001-3.195-1.239-6.194-3.454-8.472zM12.042 18.526c-1.786 0-3.536-0.479-5.056-1.381l-0.366-0.214-3.75 0.975 0.984-3.617-0.239-0.375c-1.009-1.621-1.549-3.496-1.549-5.414 0-5.633 4.596-10.199 10.23-10.199 2.728 0 5.306 1.061 7.229 2.999 1.925 1.936 2.986 4.485 2.986 7.214 0.001 5.605-4.595 10.199-10.229 10.199zM17.468 14.387c-0.305-0.152-1.799-0.884-2.075-0.985-0.275-0.099-0.476-0.149-0.67 0.152-0.196 0.3-0.75 0.967-0.924 1.171-0.17 0.201-0.34 0.229-0.644 0.077-0.305-0.152-1.29-0.472-2.45-1.511-0.9-0.809-1.511-1.805-1.689-2.109-0.176-0.304-0.019-0.465 0.126-0.621 0.136-0.149 0.305-0.349 0.456-0.534 0.152-0.189 0.201-0.304 0.3-0.505 0.1-0.199 0.051-0.375-0.025-0.524-0.075-0.15-0.671-1.639-0.926-2.244-0.242-0.588-0.488-0.506-0.671-0.517-0.175-0.010-0.375-0.010-0.575-0.010-0.2 0-0.516 0.075-0.79 0.375-0.276 0.3-1.031 1.005-1.031 2.455 0 1.444 1.039 2.845 1.191 3.042 0.151 0.205 2.105 3.299 5.171 4.527 0.724 0.314 1.29 0.502 1.724 0.641 0.725 0.227 1.386 0.195 1.91 0.121 0.58-0.085 1.799-0.735 2.051-1.445 0.25-0.705 0.25-1.314 0.174-1.439-0.080-0.125-0.275-0.196-0.581-0.354z"
                            fill="currentColor"
                            strokeWidth="0"
                          ></path>
                        </svg>
                        Share via WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={shareViaFacebook}>
                        <Facebook className="h-4 w-4 mr-2" /> 
                        Share via Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={shareViaTwitter}>
                        <Twitter className="h-4 w-4 mr-2" /> 
                        Share via Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" /> 
                        Copy link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              {profile.slug ? "Change URL" : "Set URL"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPageUrlCard;

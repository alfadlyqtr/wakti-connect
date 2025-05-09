
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithEmail } from "@/hooks/useProfileSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Copy, Mail, Phone, Globe, Share2, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import BusinessSocialLinks from "@/components/business/landing/BusinessSocialLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";

const BusinessProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<ProfileWithEmail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socialLinks } = useBusinessSocialLinks(profile?.id);
  const { user } = useAuth();
  const isOwner = user?.id === profile?.id;

  useEffect(() => {
    const fetchProfileBySlug = async () => {
      if (!slug) {
        setError("No profile slug provided");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .eq('account_type', 'business')
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setError("Profile not found");
        } else {
          setProfile(data as ProfileWithEmail);
        }
      } catch (err) {
        console.error("Exception during profile fetch:", err);
        setError("An error occurred while loading the profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileBySlug();
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Profile link copied to clipboard"
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Failed to copy link to clipboard"
        });
      });
  };

  const handleShareSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${profile?.business_name}'s profile`);
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-12 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Skeleton className="h-32 w-32 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">The business profile you're looking for doesn't exist or may have been removed.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{profile.business_name}</h1>
          <p className="text-muted-foreground">Business Profile</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar with profile picture and basic info */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-32 w-32 mb-4">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.business_name || ""} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {profile.business_name?.slice(0, 2).toUpperCase() || "BP"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-xl font-bold">{profile.business_name}</h2>
                <p className="text-muted-foreground text-sm">{profile.business_type || "Business"}</p>
              </div>

              <div className="space-y-4">
                {isOwner && (
                  <Button asChild className="w-full">
                    <Link to="/dashboard/settings?tab=business-profile">Edit Profile</Link>
                  </Button>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyLink}
                    title="Copy profile link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleShareSocial('facebook')}
                    title="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleShareSocial('twitter')}
                    title="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleShareSocial('linkedin')}
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
                
                {socialLinks && socialLinks.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-center mb-2">Connect With Us</p>
                    <BusinessSocialLinks 
                      socialLinks={socialLinks} 
                      iconsStyle="colored" 
                      size="default" 
                      className="justify-center"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              {isOwner && <TabsTrigger value="stats">Stats</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {profile.business_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.business_address && (
                    <div className="prose max-w-none">
                      <p>{profile.business_address}</p>
                    </div>
                  )}
                  {!profile.business_address && (
                    <p className="text-muted-foreground italic">No business description available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.business_email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`mailto:${profile.business_email}`} className="text-wakti-blue hover:underline">
                          {profile.business_email}
                        </a>
                      </div>
                    )}
                    
                    {profile.business_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${profile.business_phone}`} className="text-wakti-blue hover:underline">
                          {profile.business_phone}
                        </a>
                      </div>
                    )}
                    
                    {profile.business_website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a 
                          href={profile.business_website.startsWith('http') ? profile.business_website : `https://${profile.business_website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-wakti-blue hover:underline"
                        >
                          {profile.business_website}
                        </a>
                      </div>
                    )}

                    {!profile.business_email && !profile.business_phone && !profile.business_website && (
                      <p className="text-muted-foreground italic">No contact information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isOwner && (
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Profile view statistics will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;

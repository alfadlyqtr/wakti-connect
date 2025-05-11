
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, Copy, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useBusinessSocialLinks } from "@/hooks/useBusinessSocialLinks";
import { SocialPlatform } from "@/types/business.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface SocialLinkFormData {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

const BusinessProfileTab = () => {
  const { data: profile, isLoading, updateProfile, isUpdating } = useProfileSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const userId = profile?.id;
  
  const {
    socialLinks,
    isLoading: isLoadingSocialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink
  } = useBusinessSocialLinks(userId);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      business_name: "",
      business_email: "",
      business_phone: "",
      business_address: "",
      facebook: "",
      instagram: "",
      whatsapp: ""
    }
  });

  // Setup form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        business_name: profile.business_name || "",
        business_email: profile.business_email || "",
        business_phone: profile.business_phone || "",
        business_address: profile.business_address || "",
      });

      // Set the public URL based on slug or ID
      const baseUrl = window.location.origin;
      const slug = profile.slug;
      if (slug) {
        setPublicUrl(`${baseUrl}/${slug}`);
      } else {
        setPublicUrl(`${baseUrl}/view/business/${profile.id}`);
      }
    }
  }, [profile, reset]);

  // Populate social links when they're loaded
  useEffect(() => {
    if (socialLinks) {
      socialLinks.forEach(link => {
        if (link.platform === 'facebook') {
          setValue('facebook', link.url);
        } else if (link.platform === 'instagram') {
          setValue('instagram', link.url);
        } else if (link.platform === 'whatsapp') {
          setValue('whatsapp', link.url);
        }
      });
    }
  }, [socialLinks, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Update profile data
      await updateProfile({
        business_name: data.business_name,
        business_email: data.business_email,
        business_phone: data.business_phone,
        business_address: data.business_address
      });
      
      // Handle social links
      if (socialLinks) {
        // Process Facebook link
        const existingFacebook = socialLinks.find(link => link.platform === 'facebook');
        if (existingFacebook && data.facebook) {
          await updateSocialLink.mutateAsync({ id: existingFacebook.id, url: data.facebook });
        } else if (existingFacebook && !data.facebook) {
          await deleteSocialLink.mutateAsync(existingFacebook.id);
        } else if (!existingFacebook && data.facebook) {
          await addSocialLink.mutateAsync({ platform: 'facebook' as SocialPlatform, url: data.facebook });
        }
        
        // Process Instagram link
        const existingInstagram = socialLinks.find(link => link.platform === 'instagram');
        if (existingInstagram && data.instagram) {
          await updateSocialLink.mutateAsync({ id: existingInstagram.id, url: data.instagram });
        } else if (existingInstagram && !data.instagram) {
          await deleteSocialLink.mutateAsync(existingInstagram.id);
        } else if (!existingInstagram && data.instagram) {
          await addSocialLink.mutateAsync({ platform: 'instagram' as SocialPlatform, url: data.instagram });
        }
        
        // Process WhatsApp link
        const existingWhatsapp = socialLinks.find(link => link.platform === 'whatsapp');
        if (existingWhatsapp && data.whatsapp) {
          await updateSocialLink.mutateAsync({ id: existingWhatsapp.id, url: data.whatsapp });
        } else if (existingWhatsapp && !data.whatsapp) {
          await deleteSocialLink.mutateAsync(existingWhatsapp.id);
        } else if (!existingWhatsapp && data.whatsapp) {
          await addSocialLink.mutateAsync({ platform: 'whatsapp' as SocialPlatform, url: data.whatsapp });
        }
      }
      
      // Generate a slug if needed
      if (!profile?.slug && data.business_name) {
        const slug = data.business_name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        // Check if slug exists
        const { data: slugCheck } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        
        if (!slugCheck) {
          await supabase
            .from('profiles')
            .update({ slug })
            .eq('id', profile?.id);
            
          // Update public URL with the new slug
          const baseUrl = window.location.origin;
          setPublicUrl(`${baseUrl}/${slug}`);
          
          toast({
            title: "Custom URL created",
            description: `Your business page is now available at ${baseUrl}/${slug}`
          });
        }
      }

      toast({
        title: "Profile updated",
        description: "Your business profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your business profile."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "The public link has been copied to your clipboard."
      });
    }
  };

  if (isLoading || isLoadingSocialLinks) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Update your business information visible to the public
          </CardDescription>
        </CardHeader>
        <CardContent>
          {publicUrl && (
            <div className="bg-muted p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 w-full">
                <Label>Public Business Page</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={publicUrl} className="font-medium" />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Share this link with your customers</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  {...register("business_name", {
                    required: "Business name is required"
                  })}
                  placeholder="Your Business Name"
                />
                {errors.business_name && (
                  <p className="text-sm text-destructive">{errors.business_name.message?.toString()}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_email">Business Email</Label>
                <Input
                  id="business_email"
                  type="email"
                  {...register("business_email")}
                  placeholder="contact@yourbusiness.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_phone">Business Phone</Label>
                <Input
                  id="business_phone"
                  {...register("business_phone")}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_address">Business Address / Google Maps Link</Label>
                <Textarea
                  id="business_address"
                  {...register("business_address")}
                  placeholder="Enter your address or paste a Google Maps link"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  You can either enter your address or paste a Google Maps URL
                </p>
              </div>
            </div>
          
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register("instagram")}
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    {...register("facebook")}
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    {...register("whatsapp")}
                    placeholder="https://wa.me/1234567890"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a WhatsApp URL (https://wa.me/1234567890) or just a phone number
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfileTab;

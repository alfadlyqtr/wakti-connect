
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Globe,
  MessageCircle,
  Map
} from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { FormItem } from "@/components/ui/form";

interface SocialMediaFormProps {
  businessId: string;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ businessId }) => {
  const { socialLinks, isLoading, updateSocialLink } = useSocialLinks(businessId);
  const [links, setLinks] = useState<Record<string, string>>({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    website: "",
    whatsapp: "",
    maps: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load existing social links
  useEffect(() => {
    if (socialLinks) {
      const initialLinks: Record<string, string> = {};
      socialLinks.forEach(link => {
        initialLinks[link.platform] = link.url;
      });
      setLinks({
        facebook: initialLinks.facebook || "",
        instagram: initialLinks.instagram || "",
        twitter: initialLinks.twitter || "",
        linkedin: initialLinks.linkedin || "",
        youtube: initialLinks.youtube || "",
        website: initialLinks.website || "",
        whatsapp: initialLinks.whatsapp || "",
        maps: initialLinks.maps || "",
      });
    }
  }, [socialLinks]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update each social link
      const platforms = Object.keys(links) as Array<keyof typeof links>;
      const updatePromises = platforms.map(platform => 
        updateSocialLink({
          platform,
          url: links[platform],
          businessId,
        })
      );
      
      await Promise.all(updatePromises);
      
      toast({
        title: "Social media links updated",
        description: "Your social media links have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating social links:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your social media links. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (platform: keyof typeof links) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks(prev => ({ ...prev, [platform]: e.target.value }));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Facebook */}
        <FormItem>
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" /> Facebook
          </Label>
          <div className="mt-1">
            <Input
              id="facebook"
              placeholder="https://facebook.com/yourbusiness"
              value={links.facebook}
              onChange={handleChange("facebook")}
            />
          </div>
        </FormItem>
        
        {/* Instagram */}
        <FormItem>
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" /> Instagram
          </Label>
          <div className="mt-1">
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourbusiness"
              value={links.instagram}
              onChange={handleChange("instagram")}
            />
          </div>
        </FormItem>
        
        {/* Twitter */}
        <FormItem>
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" /> Twitter
          </Label>
          <div className="mt-1">
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourbusiness"
              value={links.twitter}
              onChange={handleChange("twitter")}
            />
          </div>
        </FormItem>
        
        {/* LinkedIn */}
        <FormItem>
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Label>
          <div className="mt-1">
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/company/yourbusiness"
              value={links.linkedin}
              onChange={handleChange("linkedin")}
            />
          </div>
        </FormItem>
        
        {/* YouTube */}
        <FormItem>
          <Label htmlFor="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" /> YouTube
          </Label>
          <div className="mt-1">
            <Input
              id="youtube"
              placeholder="https://youtube.com/c/yourbusiness"
              value={links.youtube}
              onChange={handleChange("youtube")}
            />
          </div>
        </FormItem>
        
        {/* Website */}
        <FormItem>
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Website
          </Label>
          <div className="mt-1">
            <Input
              id="website"
              placeholder="https://yourbusiness.com"
              value={links.website}
              onChange={handleChange("website")}
            />
          </div>
        </FormItem>
        
        {/* Google Maps */}
        <FormItem>
          <Label htmlFor="maps" className="flex items-center gap-2">
            <Map className="h-4 w-4" /> Google Maps
          </Label>
          <div className="mt-1">
            <Input
              id="maps"
              placeholder="https://maps.google.com/..."
              value={links.maps}
              onChange={handleChange("maps")}
            />
          </div>
        </FormItem>
        
        {/* WhatsApp */}
        <FormItem>
          <Label htmlFor="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Label>
          <div className="mt-1">
            <Input
              id="whatsapp"
              placeholder="https://wa.me/123456789"
              value={links.whatsapp}
              onChange={handleChange("whatsapp")}
            />
          </div>
        </FormItem>
      </div>
      
      <Button
        type="submit"
        className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Social Links"}
      </Button>
    </form>
  );
};

export default SocialMediaForm;

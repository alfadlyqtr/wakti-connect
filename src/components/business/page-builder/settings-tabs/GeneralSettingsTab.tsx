
import React from "react";
import { BusinessPage } from "@/types/business.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Share2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface GeneralSettingsTabProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    logo_url?: string;
  };
  businessId?: string;
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getPublicPageUrl: () => string;
  uploadingLogo: boolean;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  pageData,
  businessId,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  handleLogoUpload,
  getPublicPageUrl,
  uploadingLogo
}) => {
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const publicUrl = getPublicPageUrl();

  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied",
      description: "Business page link copied to clipboard"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure basic settings for your business landing page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <Label className="mb-2 block">Business Logo</Label>
            <div className="relative">
              <Avatar className="w-20 h-20 border">
                <AvatarImage src={pageData.logo_url} />
                <AvatarFallback className="bg-primary/10">LOGO</AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                disabled={uploadingLogo}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {uploadingLogo ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {uploadingLogo ? "Uploading..." : "Upload Logo"}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="page_title">Page Title</Label>
              <Input
                id="page_title"
                name="page_title"
                value={pageData.page_title}
                onChange={handleInputChangeWithAutoSave}
                placeholder="My Business"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page_slug">
                Page URL Slug
                <span className="text-xs text-muted-foreground ml-2">
                  (e.g. my-business)
                </span>
              </Label>
              <div className="flex items-center">
                <div className="text-sm text-muted-foreground mr-2">
                  /business/
                </div>
                <Input
                  id="page_slug"
                  name="page_slug"
                  value={pageData.page_slug}
                  onChange={handleInputChangeWithAutoSave}
                  placeholder="my-business"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Page Description</Label>
              <Textarea
                id="description"
                name="description"
                value={pageData.description || ""}
                onChange={handleInputChangeWithAutoSave}
                placeholder="Describe your business in a few sentences"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={pageData.is_published}
              onCheckedChange={(checked) => handleToggleWithAutoSave('is_published', checked)}
            />
            <Label htmlFor="is_published">
              Publish Page
            </Label>
          </div>
          
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Business Page</DialogTitle>
                <DialogDescription>
                  Share your business page with customers and on social media
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Page Link</Label>
                  <div className="flex">
                    <Input 
                      value={publicUrl} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <Button 
                      className="rounded-l-none" 
                      onClick={handleCopyLink}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Share on Social Media</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`Check out my business: ${publicUrl}`)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        X (Twitter)
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;

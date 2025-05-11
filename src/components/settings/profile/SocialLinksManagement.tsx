
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { 
  useBusinessSocialLinks,
  SocialPlatform,
  BusinessSocialLink
} from "@/hooks/useBusinessSocialLinks";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SocialLinksManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const SocialLinksManagement: React.FC<SocialLinksManagementProps> = ({ profileId, readOnly = false }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BusinessSocialLink | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("website");
  const [newUrl, setNewUrl] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [displayStyle, setDisplayStyle] = useState<'icons' | 'buttons'>('icons');
  
  const { 
    socialLinks, 
    socialSettings,
    isLoading, 
    addSocialLink, 
    updateSocialLink, 
    deleteSocialLink,
    updateSocialSettings
  } = useBusinessSocialLinks(profileId);

  // Initialize display style from settings when available
  React.useEffect(() => {
    if (socialSettings) {
      setDisplayStyle(socialSettings.display_style);
    }
  }, [socialSettings]);
  
  const handleAdd = () => {
    if (!newUrl) {
      toast({
        title: "URL required",
        description: "Please enter a URL for the social media platform",
        variant: "destructive",
      });
      return;
    }
    
    addSocialLink.mutate(
      { platform: newPlatform, url: newUrl },
      {
        onSuccess: () => {
          setNewPlatform("website");
          setNewUrl("");
          setIsAddDialogOpen(false);
        },
      }
    );
  };
  
  const handleEdit = () => {
    if (!editingLink || !editUrl) return;
    
    updateSocialLink.mutate(
      { id: editingLink.id, url: editUrl },
      {
        onSuccess: () => {
          setEditingLink(null);
          setEditUrl("");
          setIsEditDialogOpen(false);
        },
      }
    );
  };
  
  const startEdit = (link: BusinessSocialLink) => {
    setEditingLink(link);
    setEditUrl(link.url);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      deleteSocialLink.mutate(id);
    }
  };

  const handleDisplayStyleChange = (value: string) => {
    const style = value as 'icons' | 'buttons';
    setDisplayStyle(style);
    updateSocialSettings.mutate({ displayStyle: style });
  };
  
  const getPlatformLabel = (platform: SocialPlatform): string => {
    const labels: Record<SocialPlatform, string> = {
      website: "Website",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      tiktok: "TikTok",
    };
    return labels[platform] || platform;
  };
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Loading social links...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Social Media Links</CardTitle>
          <CardDescription>Connect your business on social platforms</CardDescription>
        </div>
        <ShareIcon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        {/* Display Style Selection */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Display Style</h3>
          <RadioGroup 
            defaultValue={displayStyle} 
            value={displayStyle}
            onValueChange={handleDisplayStyleChange}
            disabled={readOnly}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="icons" id="icons" />
              <Label htmlFor="icons">Icons Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buttons" id="buttons" />
              <Label htmlFor="buttons">Buttons with Text</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* List of social links */}
        {socialLinks && socialLinks.length > 0 ? (
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Link className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{getPlatformLabel(link.platform)}</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[300px]">
                      {link.url}
                    </p>
                  </div>
                </div>
                
                {!readOnly && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(link)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(link.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center rounded-md border border-dashed">
            <h3 className="text-muted-foreground mb-2">No social links added yet</h3>
            {!readOnly && (
              <p className="text-sm text-muted-foreground">
                Add your social media profiles to connect with customers.
              </p>
            )}
          </div>
        )}
        
        {!readOnly && (
          <div className="pt-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Add Social Media Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Social Media Link</DialogTitle>
                  <DialogDescription>
                    Connect your business to social platforms to reach more customers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={newPlatform}
                      onValueChange={(value) => setNewPlatform(value as SocialPlatform)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={addSocialLink.isPending || !newUrl}>
                    {addSocialLink.isPending ? "Adding..." : "Add Link"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Social Media Link</DialogTitle>
                  <DialogDescription>
                    Update the URL for your {editingLink ? getPlatformLabel(editingLink.platform) : ""} link.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-url">URL</Label>
                    <Input
                      id="edit-url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEdit} disabled={updateSocialLink.isPending || !editUrl}>
                    {updateSocialLink.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinksManagement;


import React, { useState } from "react";
import { BusinessSocialLink, SocialPlatform } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, ExternalLink, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SocialMediaLinksProps {
  socialLinks: BusinessSocialLink[];
  onAdd: (data: { platform: SocialPlatform, url: string }) => void;
  onUpdate: (data: { id: string, url: string }) => void;
  onDelete: (id: string) => void;
}

type SocialPlatformOption = {
  value: SocialPlatform;
  label: string;
  prefix: string;
};

const PLATFORM_OPTIONS: SocialPlatformOption[] = [
  { value: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/' },
  { value: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/' },
  { value: 'twitter', label: 'X (Twitter)', prefix: 'https://twitter.com/' },
  { value: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
  { value: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/' },
  { value: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@' },
  { value: 'pinterest', label: 'Pinterest', prefix: 'https://pinterest.com/' },
  { value: 'website', label: 'Website', prefix: 'https://' },
];

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ 
  socialLinks,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [platformToAdd, setPlatformToAdd] = useState<SocialPlatform>('website');
  const [urlToAdd, setUrlToAdd] = useState('');
  const [editLinkId, setEditLinkId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  
  const handleAddLink = () => {
    // Check if URL is provided
    if (!urlToAdd.trim()) return;
    
    // Get the selected platform option
    const platformOption = PLATFORM_OPTIONS.find(p => p.value === platformToAdd);
    
    // Ensure URL has the correct prefix
    let finalUrl = urlToAdd;
    if (platformOption && !finalUrl.startsWith('http')) {
      finalUrl = platformOption.prefix + finalUrl.replace(platformOption.prefix, '');
    }
    
    // Call the add function
    onAdd({ platform: platformToAdd, url: finalUrl });
    
    // Reset form
    setUrlToAdd('');
    setShowAddDialog(false);
  };
  
  const handleEditLink = (link: BusinessSocialLink) => {
    setEditLinkId(link.id);
    setEditUrl(link.url);
  };
  
  const saveEditedLink = () => {
    if (editLinkId && editUrl.trim()) {
      onUpdate({ id: editLinkId, url: editUrl });
      setEditLinkId(null);
      setEditUrl('');
    }
  };
  
  const cancelEdit = () => {
    setEditLinkId(null);
    setEditUrl('');
  };
  
  const getPlatformLabel = (platform: SocialPlatform): string => {
    return PLATFORM_OPTIONS.find(p => p.value === platform)?.label || platform;
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {socialLinks.length === 0 ? (
          <div className="text-center p-6 border rounded-lg">
            <p className="text-muted-foreground mb-2">No social media links added yet</p>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Social Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Social Media Link</DialogTitle>
                  <DialogDescription>
                    Add a link to your social media profile
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={platformToAdd} 
                      onValueChange={(val) => setPlatformToAdd(val as SocialPlatform)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="url">Profile URL or Username</Label>
                    <Input
                      id="url"
                      value={urlToAdd}
                      onChange={(e) => setUrlToAdd(e.target.value)}
                      placeholder="Username or full URL"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can enter your username (without @) or the full URL to your profile
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLink}>
                    Add Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            {socialLinks.map(link => (
              <Card key={link.id} className="overflow-hidden">
                <CardContent className="p-4">
                  {editLinkId === link.id ? (
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <Input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="URL"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={saveEditedLink}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={cancelEdit}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{getPlatformLabel(link.platform)}</span>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {link.url}
                        </div>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditLink(link)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(link.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Social Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Social Media Link</DialogTitle>
                  <DialogDescription>
                    Add a link to your social media profile
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={platformToAdd} 
                      onValueChange={(val) => setPlatformToAdd(val as SocialPlatform)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="url">Profile URL or Username</Label>
                    <Input
                      id="url"
                      value={urlToAdd}
                      onChange={(e) => setUrlToAdd(e.target.value)}
                      placeholder="Username or full URL"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can enter your username (without @) or the full URL to your profile
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLink}>
                    Add Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialMediaLinks;


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Eye, AlertTriangle } from "lucide-react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

// Fallback component for when Instagram embed fails
const InstagramFallback = ({ url }: { url: string }) => (
  <Card className="p-6 border rounded-md text-center space-y-4">
    <div className="flex justify-center">
      <img 
        src="/lovable-uploads/f6e4ccdf-d227-40f3-bfd5-d9743276cd74.png" 
        alt="Instagram Logo" 
        className="w-16 h-16 mb-2"
      />
    </div>
    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
    <h3 className="text-lg font-medium">Instagram Preview Unavailable</h3>
    <p className="text-muted-foreground">
      Instagram embeds require a public account and may only display in the published version of your page.
    </p>
    <div className="pt-2">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View original post
      </a>
    </div>
  </Card>
);

const InstagramFeedSection: React.FC = () => {
  const { contentData, handleInputChange, setContentData, setIsDirty } = useSectionEditor();
  const [embedError, setEmbedError] = React.useState(false);
  
  // Show Instagram post URL instructions popover
  const InstructionsPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <Eye className="h-4 w-4 mr-1" />
          How to get a post URL
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="font-medium">How to get an Instagram post URL:</h4>
          <ol className="list-decimal pl-4 space-y-1 text-sm">
            <li>Open Instagram and go to the post you want to embed</li>
            <li>Tap the three dots (⋯) in the top right of the post</li>
            <li>Select "Copy Link" or "Share to..."</li>
            <li>Choose "Copy Link" from the options</li>
            <li>Paste the URL here (format: https://www.instagram.com/p/XXXXXXX/)</li>
          </ol>
          <div className="mt-3 text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Note:</strong> The post must be from a public account for embedding to work.
            Private accounts and content from private accounts cannot be embedded.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the post ID from URL if needed
    const url = e.target.value;
    setEmbedError(false);
    
    setContentData({
      ...contentData,
      instagramUrl: url
    });
    setIsDirty(true);
  };

  // Function to handle embed errors
  const handleEmbedError = () => {
    setEmbedError(true);
  };

  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={contentData.title || "Follow Us on Instagram"}
              onChange={handleInputChange}
              placeholder="Section Title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              name="description"
              value={contentData.description || "Check out our latest posts and updates"}
              onChange={handleInputChange}
              placeholder="Description"
              rows={3}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="instagramUrl">Instagram Post URL</Label>
              <InstructionsPopover />
            </div>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              value={contentData.instagramUrl || ""}
              onChange={handleUrlChange}
              placeholder="https://www.instagram.com/p/..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the full URL of an Instagram post to embed
            </p>
          </div>
          
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              Instagram embeds require the post to be from a public account and may require approval from Instagram.
              The embed may not appear in preview mode but should work on your published page.
            </AlertDescription>
          </Alert>
        </div>
      </TabsContent>
      
      <TabsContent value="appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hideCaption">Hide Caption</Label>
            <Switch
              id="hideCaption"
              checked={contentData.hideCaption === true}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  hideCaption: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="centeredContent">Center Content</Label>
            <Switch
              id="centeredContent"
              checked={contentData.centeredContent !== false}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  centeredContent: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="maxWidth">Max Width (px)</Label>
            <Input
              id="maxWidth"
              name="maxWidth"
              type="number"
              value={contentData.maxWidth || "500"}
              onChange={handleInputChange}
              placeholder="500"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="preview">
        <div className="space-y-4">
          {contentData.instagramUrl ? (
            <div className={contentData.centeredContent !== false ? "flex justify-center" : ""}>
              <div style={{ maxWidth: `${contentData.maxWidth || 500}px` }} className="w-full">
                {embedError ? (
                  <InstagramFallback url={contentData.instagramUrl} />
                ) : (
                  <div className="relative">
                    <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/f6e4ccdf-d227-40f3-bfd5-d9743276cd74.png" 
                        alt="Instagram Preview" 
                        className="w-12 h-12 animate-pulse" 
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground bg-background/80 p-2 rounded">
                        Instagram preview will appear on your published page
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">
                Enter an Instagram post URL to see a preview.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InstagramFeedSection;

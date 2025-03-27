
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Eye } from "lucide-react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Switch } from "@/components/ui/switch";
import InstagramEmbed from "react-instagram-embed";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const InstagramFeedSection: React.FC = () => {
  const { contentData, handleInputChange, setContentData, setIsDirty } = useSectionEditor();
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the post ID from URL if needed
    const url = e.target.value;
    
    setContentData({
      ...contentData,
      instagramUrl: url
    });
    setIsDirty(true);
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
            <div className="flex items-center justify-between">
              <Label htmlFor="instagramUrl">Instagram Post URL</Label>
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
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: The post must be from a public account for embedding to work
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
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
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Instagram embeds require the post to be from a public account and may require approval from Instagram.
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
                <InstagramEmbed
                  url={contentData.instagramUrl}
                  clientAccessToken="123|456" // This is a placeholder, actual token needed in production
                  hideCaption={contentData.hideCaption === true}
                  containerTagName="div"
                  injectScript
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}
                />
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

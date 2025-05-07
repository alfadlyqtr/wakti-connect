
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditorProps } from "./types";
import SectionStyleEditor from "./SectionStyleEditor";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Loader2, Upload } from "lucide-react";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const HeaderEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const { handleStyleChange } = useSectionEditor();
  const [uploading, setUploading] = useState(false);
  
  // Create adapter function for handling input events
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Extract name and value from the event and pass them to handleInputChange
    handleInputChange(e.target.name, e.target.value);
  };
  
  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      const file = files[0];
      
      // Upload the image using the service
      const imageUrl = await uploadBusinessImage(businessId, file, 'headers');
      
      // Update the section with the new image URL
      handleInputChange('backgroundImageUrl', imageUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your header background has been updated"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setUploading(false);
      // Clear input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Header Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ""}
          onChange={handleTextInputChange}
          placeholder="Welcome to our business"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={contentData.subtitle || ""}
          onChange={handleTextInputChange}
          placeholder="Book our services online"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={contentData.description || ""}
          onChange={handleTextInputChange}
          placeholder="Welcome to our business page"
          rows={3}
        />
      </div>
      
      <div className="space-y-2 pt-2">
        <Label>Background Image</Label>
        <div className="mt-1">
          {contentData.backgroundImageUrl && (
            <div className="mb-2 relative rounded-md overflow-hidden">
              <img 
                src={contentData.backgroundImageUrl} 
                alt="Header background" 
                className="w-full h-32 object-cover"
              />
              <Button 
                variant="destructive" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleInputChange('backgroundImageUrl', '')}
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="file"
              id="header-image-upload"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
            />
            <label 
              htmlFor="header-image-upload" 
              className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> 
                  {contentData.backgroundImageUrl ? 'Change Image' : 'Upload Background Image'}
                </>
              )}
            </label>
          </div>
        </div>
      </div>
      
      <SectionStyleEditor 
        contentData={contentData}
        handleInputChange={handleInputChange}
        handleStyleChange={handleStyleChange}
      />
    </>
  );
};

export default HeaderEditor;

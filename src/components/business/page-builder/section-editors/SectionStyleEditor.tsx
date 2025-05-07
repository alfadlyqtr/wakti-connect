
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorInput } from "@/components/inputs/ColorInput";
import { AlignCenter, AlignLeft, AlignRight, Upload, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SectionStyleEditorProps {
  contentData: any;
  handleInputChange: (name: string, value: any) => void;
  handleStyleChange?: (name: string, value: any) => void;
}

const SectionStyleEditor: React.FC<SectionStyleEditorProps> = ({
  contentData,
  handleInputChange,
  handleStyleChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleColorChange = (property: string, value: string) => {
    if (handleStyleChange) {
      handleStyleChange(property, value);
    } else {
      handleInputChange(property, value);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      
      // Upload the image using the service
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${businessId}/backgrounds/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('business')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('business')
        .getPublicUrl(filePath);
      
      // Update the background image URL
      handleInputChange('backgroundImageUrl', publicUrl);
      
      toast({
        title: "Background image uploaded",
        description: "Your background image has been updated"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload background image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="font-medium text-base">Section Styling</h3>
      
      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <div className="flex space-x-2">
          <Button 
            type="button"
            size="sm"
            variant={contentData.textAlignment === 'left' ? 'default' : 'outline'}
            onClick={() => handleInputChange('textAlignment', 'left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            type="button"
            size="sm"
            variant={contentData.textAlignment === 'center' ? 'default' : 'outline'}
            onClick={() => handleInputChange('textAlignment', 'center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            type="button"
            size="sm"
            variant={contentData.textAlignment === 'right' ? 'default' : 'outline'}
            onClick={() => handleInputChange('textAlignment', 'right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorInput
          id="backgroundColor"
          value={contentData.backgroundColor || "#f3f4f6"}
          onChange={(value) => handleColorChange('backgroundColor', value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <ColorInput
          id="textColor"
          value={contentData.textColor || "#000000"}
          onChange={(value) => handleColorChange('textColor', value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Background Image</Label>
        <div className="flex flex-col space-y-2">
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('background-image-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Background Image'}
          </Button>
          
          <input
            id="background-image-upload"
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            className="hidden"
          />
          
          {contentData.backgroundImageUrl && (
            <div className="mt-2 border p-2 rounded">
              <img
                src={contentData.backgroundImageUrl}
                alt="Background preview"
                className="h-24 w-full object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-2 w-full"
                onClick={() => handleInputChange('backgroundImageUrl', '')}
              >
                Remove Image
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="padding">Padding</Label>
        <Select
          value={contentData.padding || "default"}
          onValueChange={(value) => handleInputChange('padding', value)}
        >
          <SelectTrigger id="padding">
            <SelectValue placeholder="Select padding" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="spacious">Spacious</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="borderRadius">Border Radius</Label>
        <Select
          value={contentData.borderRadius || "none"}
          onValueChange={(value) => handleInputChange('borderRadius', value)}
        >
          <SelectTrigger id="borderRadius">
            <SelectValue placeholder="Select border radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SectionStyleEditor;

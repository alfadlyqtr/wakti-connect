
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface HeaderStyleTabProps {
  headerStyle: 'banner' | 'simple' | 'minimal';
  headerImage?: string;
  onHeaderStyleChange: (style: 'banner' | 'simple' | 'minimal') => void;
  onHeaderImageChange: (imageUrl: string) => void;
}

const HeaderStyleTab: React.FC<HeaderStyleTabProps> = ({
  headerStyle,
  headerImage,
  onHeaderStyleChange,
  onHeaderImageChange
}) => {
  const [imageUrl, setImageUrl] = useState(headerImage || '');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    onHeaderImageChange(e.target.value);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, this would upload to a storage service
    // Here we'll simulate an upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.loaded && event.total) {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      }
    };
    
    reader.onload = (event) => {
      // In reality, this would be a URL from your storage service
      const imageDataUrl = event.target?.result as string;
      
      // Simulate delay for upload
      setTimeout(() => {
        setImageUrl(imageDataUrl);
        onHeaderImageChange(imageDataUrl);
        setIsUploading(false);
        
        toast({
          title: "Image uploaded",
          description: "Your header image has been uploaded successfully"
        });
      }, 1000);
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base mb-3 block">Header Style</Label>
        <RadioGroup value={headerStyle} onValueChange={(v) => onHeaderStyleChange(v as 'banner' | 'simple' | 'minimal')}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <div className="p-2 h-32 border rounded-md overflow-hidden">
                <div className="w-full h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-md"></div>
                <div className="w-full h-12 bg-background flex items-center justify-center">
                  <span className="text-sm font-medium">Header Text</span>
                </div>
              </div>
              <RadioGroupItem value="banner" id="banner" className="absolute top-2 right-2" />
              <Label htmlFor="banner" className="block text-center mt-1 text-sm">Banner</Label>
            </div>
            
            <div className="relative">
              <div className="p-2 h-32 border rounded-md">
                <div className="w-full h-10 bg-background border-b flex items-center justify-center">
                  <span className="text-sm font-medium">Header Text</span>
                </div>
                <div className="w-full h-22 bg-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Content Area</span>
                </div>
              </div>
              <RadioGroupItem value="simple" id="simple" className="absolute top-2 right-2" />
              <Label htmlFor="simple" className="block text-center mt-1 text-sm">Simple</Label>
            </div>
            
            <div className="relative">
              <div className="p-2 h-32 border rounded-md">
                <div className="w-full flex flex-col items-center justify-center mb-1">
                  <div className="w-10 h-10 rounded-full bg-muted mb-1"></div>
                  <span className="text-sm font-medium">Header Text</span>
                </div>
                <div className="w-full h-16 bg-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Content Area</span>
                </div>
              </div>
              <RadioGroupItem value="minimal" id="minimal" className="absolute top-2 right-2" />
              <Label htmlFor="minimal" className="block text-center mt-1 text-sm">Minimal</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="header-image" className="text-base mb-3 block">Header Image</Label>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="header-image"
              placeholder="Enter image URL or upload"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="flex-1"
            />
            <div className="relative">
              <Button 
                type="button" 
                variant="outline"
                className="relative" 
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                {isUploading ? `Uploading ${uploadProgress}%` : 'Upload'}
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
          </div>
          
          {imageUrl && (
            <div className="relative h-36 border rounded overflow-hidden bg-muted/30">
              <img 
                src={imageUrl} 
                alt="Header preview"  
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x200/rose/white?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
          
          {!imageUrl && headerStyle !== 'simple' && (
            <div className="py-4 text-center text-muted-foreground text-sm">
              {headerStyle === 'banner' 
                ? 'Add a header image to show as a banner' 
                : 'Add a header image to show in the minimal header'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderStyleTab;


import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import HeaderStyleSelector from "../HeaderStyleSelector";
import { EventCustomization } from "@/types/event.types";

interface HeaderTabProps {
  customization: EventCustomization;
  onHeaderStyleChange: (style: 'banner' | 'simple' | 'minimal') => void;
  onHeaderImageChange: (imageUrl: string) => void;
}

const HeaderTab: React.FC<HeaderTabProps> = ({
  customization,
  onHeaderStyleChange,
  onHeaderImageChange
}) => {
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(customization.headerImage || null);
  
  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setHeaderImagePreview(imageUrl);
        onHeaderImageChange(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <HeaderStyleSelector
        value={customization.headerStyle}
        onChange={onHeaderStyleChange}
      />
      
      <div>
        <Label className="block mb-2">Header Image</Label>
        <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
          <input
            type="file"
            id="headerImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleHeaderImageUpload}
            className="hidden"
          />
          <Label htmlFor="headerImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Image (Max 2MB)</span>
            <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
          </Label>
          {headerImagePreview && (
            <div className="mt-4">
              <img 
                src={headerImagePreview} 
                alt="Header image preview" 
                className="mx-auto max-h-32 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTab;

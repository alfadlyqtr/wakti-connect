
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";

interface ImageTabProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageTab: React.FC<ImageTabProps> = ({ value, onChange }) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be less than 2MB");
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFileError("Only JPG, PNG and WebP images are allowed");
      return;
    }

    setFileError(null);

    // In a real implementation, this would upload to Supabase storage
    // For now, we'll create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-dashed rounded-md p-4 text-center bg-muted/50">
        <input
          type="file"
          id="backgroundImage"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Label htmlFor="backgroundImage" className="cursor-pointer flex flex-col items-center justify-center gap-2">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Upload Image (Max 2MB)</span>
          <span className="text-xs text-muted-foreground">JPG, PNG or WebP</span>
        </Label>
        {value && (
          <div className="mt-4">
            <img 
              src={value} 
              alt="Background preview" 
              className="mx-auto max-h-32 rounded-md object-cover"
            />
          </div>
        )}
        {fileError && <p className="text-sm text-destructive mt-2">{fileError}</p>}
      </div>
    </div>
  );
};

export default ImageTab;

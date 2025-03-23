
import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";

interface AvatarUploadProps {
  form: UseFormReturn<StaffFormValues>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ form }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Set the file in the form
    form.setValue("avatar", file);
    
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };
  
  const handleRemoveImage = () => {
    form.setValue("avatar", undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="avatar"
      render={({ field }) => (
        <FormItem className="flex flex-col items-center justify-center">
          <FormLabel className="cursor-pointer">
            <div className="flex items-center justify-center">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Staff avatar preview" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </FormLabel>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload Photo
            </Button>
          </div>
          <FormDescription className="text-center text-xs mt-1">
            Click to upload a staff photo (optional)
          </FormDescription>
          <FormControl>
            <input type="hidden" {...field} value={field.value?.name || ''} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default AvatarUpload;

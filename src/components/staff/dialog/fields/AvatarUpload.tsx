
import React, { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface AvatarUploadProps {
  form: UseFormReturn<StaffFormValues>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ form }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update form value
    form.setValue("avatar", file);
    
    // Create preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Get initials for the avatar fallback
  const name = form.watch("fullName") || "";
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2) || "ST";

  return (
    <FormField
      control={form.control}
      name="avatar"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className="flex flex-col items-center mb-6">
          <FormLabel className="mb-2">Profile Picture</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 cursor-pointer border-2 border-muted" onClick={handleUploadClick}>
                <AvatarImage src={previewUrl || ""} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
                {...field}
              />
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleUploadClick}
              >
                <Camera className="h-4 w-4" />
                Upload Photo
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AvatarUpload;

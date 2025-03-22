
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface AvatarUploadProps {
  form: UseFormReturn<StaffFormValues>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ form }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update form value
    form.setValue('avatar', file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const clearAvatar = () => {
    form.setValue('avatar', undefined);
    setPreview(null);
  };
  
  const initials = form.watch('fullName')
    ? form.watch('fullName')
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'ST';
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-muted">
          <AvatarImage src={preview || undefined} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={clearAvatar}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex justify-center">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="flex items-center text-sm text-primary gap-1 hover:underline">
            <Upload className="h-3 w-3" />
            {preview ? 'Change photo' : 'Upload photo'}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUpload;

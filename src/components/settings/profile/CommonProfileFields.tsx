
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Separator } from "@/components/ui/separator";
import { User, MapPin } from "lucide-react";

interface CommonProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch?: UseFormWatch<ProfileFormData>;
  errors?: FieldErrors<ProfileFormData>;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({ 
  register, 
  watch,
  errors 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Basic Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your profile details visible to others
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="grid gap-5">
        <div className="space-y-2">
          <Label htmlFor="display_name" className="font-medium">Display Name</Label>
          <Input 
            id="display_name" 
            placeholder="How you want to be addressed" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("display_name")} 
          />
          {errors?.display_name && (
            <p className="text-sm font-medium text-destructive">{errors.display_name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="occupation" className="font-medium">Occupation</Label>
          <Input 
            id="occupation" 
            placeholder="Your job title or profession" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("occupation")} 
          />
        </div>
      </div>
      
      <div className="space-y-1 pt-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Address Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your location details (optional)
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="country" className="font-medium">Country</Label>
          <Input 
            id="country" 
            placeholder="Your country" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("country")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state_province" className="font-medium">State/Province</Label>
          <Input 
            id="state_province" 
            placeholder="Your state or province" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("state_province")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city" className="font-medium">City</Label>
          <Input 
            id="city" 
            placeholder="Your city" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("city")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal_code" className="font-medium">Postal/ZIP Code</Label>
          <Input 
            id="postal_code" 
            placeholder="Your postal code" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("postal_code")} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street_address" className="font-medium">Street Address</Label>
          <Input 
            id="street_address" 
            placeholder="Your street address" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("street_address")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="po_box" className="font-medium">P.O. Box</Label>
          <Input 
            id="po_box" 
            placeholder="Your P.O. Box (if applicable)" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("po_box")} 
          />
        </div>
      </div>
    </div>
  );
};

export default CommonProfileFields;

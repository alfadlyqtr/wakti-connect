
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CommonProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({ register, watch }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Address Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Where can we reach you?
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="country" className="font-medium">Country</Label>
          <Select
            onValueChange={(value) => register("country").onChange({ target: { value } })}
            defaultValue={watch("country") || ""}
          >
            <SelectTrigger className="border-gray-300 focus-visible:ring-wakti-blue">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="qa">Qatar</SelectItem>
              <SelectItem value="ae">United Arab Emirates</SelectItem>
              <SelectItem value="sa">Saudi Arabia</SelectItem>
              <SelectItem value="kw">Kuwait</SelectItem>
              <SelectItem value="bh">Bahrain</SelectItem>
              <SelectItem value="om">Oman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state_province" className="font-medium">State/Province</Label>
          <Input 
            id="state_province" 
            placeholder="State or Province" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("state_province")} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="city" className="font-medium">City</Label>
          <Input 
            id="city" 
            placeholder="City" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("city")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal_code" className="font-medium">Postal Code</Label>
          <Input 
            id="postal_code" 
            placeholder="Postal / ZIP Code" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("postal_code")} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street_address" className="font-medium">Street Address</Label>
        <Input 
          id="street_address" 
          placeholder="123 Main St" 
          className="border-gray-300 focus-visible:ring-wakti-blue"
          {...register("street_address")} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="po_box" className="font-medium">P.O. Box (optional)</Label>
        <Input 
          id="po_box" 
          placeholder="P.O. Box Number" 
          className="border-gray-300 focus-visible:ring-wakti-blue"
          {...register("po_box")} 
        />
      </div>
    </div>
  );
};

export default CommonProfileFields;

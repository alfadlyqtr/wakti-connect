
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface BusinessProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
}

const businessTypes = [
  { value: "salon", label: "Hair Salon" },
  { value: "barber", label: "Barber Shop" },
  { value: "spa", label: "Spa & Wellness" },
  { value: "gym", label: "Gym & Fitness" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail Store" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ register }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Business Details</h3>
        <p className="text-sm text-muted-foreground">
          Tell us more about your business
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="displayName">Your Position</Label>
        <Input 
          id="displayName" 
          placeholder="Account Admin" 
          {...register("display_name")} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName" 
          placeholder="Your business name" 
          {...register("business_name")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <Select
          onValueChange={(value) => register("business_type").onChange({ target: { value } })}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessAddress">Business Address</Label>
        <Input 
          id="businessAddress" 
          placeholder="Business address" 
          {...register("business_address")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Business Description</Label>
        <Textarea
          id="bio"
          className="w-full min-h-[100px]"
          placeholder="Tell us about your business"
          {...register("occupation")}
        />
      </div>
    </div>
  );
};

export default BusinessProfileFields;


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
import { Briefcase } from "lucide-react";

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
      {/* Business Identity Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Business Identity</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Core information about your business
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="font-medium">Business Name</Label>
          <Input 
            id="businessName" 
            placeholder="Your business name" 
            {...register("business_name")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessType" className="font-medium">Business Type</Label>
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessAddress" className="font-medium">Business Address</Label>
        <Input 
          id="businessAddress" 
          placeholder="Business address" 
          {...register("business_address")}
        />
      </div>
      
      {/* Business Description Section */}
      <div className="space-y-1 pt-4">
        <h3 className="text-lg font-medium">Business Description</h3>
        <p className="text-sm text-muted-foreground">
          Tell customers about your business
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="font-medium">Business Description</Label>
        <Textarea
          id="bio"
          className="w-full min-h-[120px]"
          placeholder="Tell us about your business"
          {...register("occupation")}
        />
      </div>
      
      {/* Administrator Info Section */}
      <div className="space-y-1 pt-4">
        <h3 className="text-lg font-medium">Administrator Information</h3>
        <p className="text-sm text-muted-foreground">
          Your details as the account administrator
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="displayName" className="font-medium">Your Position</Label>
        <Input 
          id="displayName" 
          placeholder="Account Administrator" 
          {...register("display_name")} 
        />
      </div>
    </div>
  );
};

export default BusinessProfileFields;


import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CommonProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
}

const CommonProfileFields: React.FC<CommonProfileFieldsProps> = ({ register, watch }) => {
  const gender = watch("gender");
  const dateOfBirth = watch("date_of_birth");
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your basic personal information
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telephone">Phone Number</Label>
          <Input 
            id="telephone" 
            placeholder="+1 (555) 123-4567" 
            {...register("telephone")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup 
            defaultValue={gender || "prefer_not_to_say"} 
            onValueChange={(value) => register("gender").onChange({ target: { value } })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
              <Label htmlFor="prefer_not_to_say" className="cursor-pointer">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateOfBirth ? format(new Date(dateOfBirth), "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
              onSelect={(date) => register("date_of_birth").onChange({ target: { value: date?.toISOString() } })}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1920}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Address Information</h3>
        <p className="text-sm text-muted-foreground">
          Where can we reach you?
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={(value) => register("country").onChange({ target: { value } })}
            defaultValue={watch("country") || ""}
          >
            <SelectTrigger>
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
          <Label htmlFor="state_province">State/Province</Label>
          <Input 
            id="state_province" 
            placeholder="State or Province" 
            {...register("state_province")} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            placeholder="City" 
            {...register("city")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input 
            id="postal_code" 
            placeholder="Postal / ZIP Code" 
            {...register("postal_code")} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street_address">Street Address</Label>
        <Input 
          id="street_address" 
          placeholder="123 Main St" 
          {...register("street_address")} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="po_box">P.O. Box (optional)</Label>
        <Input 
          id="po_box" 
          placeholder="P.O. Box Number" 
          {...register("po_box")} 
        />
      </div>
    </div>
  );
};

export default CommonProfileFields;

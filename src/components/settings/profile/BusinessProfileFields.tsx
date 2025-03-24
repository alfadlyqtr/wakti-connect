
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
import { Briefcase, Building, Mail, Phone, Globe } from "lucide-react";

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
  // Additional business types
  { value: "accounting", label: "Accounting & Finance" },
  { value: "architecture", label: "Architecture & Design" },
  { value: "automotive", label: "Automotive" },
  { value: "beauty", label: "Beauty Services" },
  { value: "childcare", label: "Childcare" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "construction", label: "Construction" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "entertainment", label: "Entertainment" },
  { value: "event", label: "Event Management" },
  { value: "food", label: "Food Services" },
  { value: "hospitality", label: "Hospitality" },
  { value: "insurance", label: "Insurance" },
  { value: "legal", label: "Legal Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "media", label: "Media & Publishing" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "photography", label: "Photography" },
  { value: "real_estate", label: "Real Estate" },
  { value: "security", label: "Security Services" },
  { value: "transport", label: "Transportation & Logistics" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "other", label: "Other" },
];

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ register }) => {
  return (
    <div className="space-y-8">
      {/* Business Identity Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-wakti-blue" />
            <h3 className="text-lg font-medium">Business Identity</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Core information about your business
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="font-medium">Business Name</Label>
            <Input 
              id="businessName" 
              placeholder="Your business name" 
              className="border-gray-300 focus-visible:ring-wakti-blue"
              {...register("business_name")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessType" className="font-medium">Business Type</Label>
            <Select
              onValueChange={(value) => register("business_type").onChange({ target: { value } })}
              defaultValue=""
            >
              <SelectTrigger className="border-gray-300 focus-visible:ring-wakti-blue">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
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
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("business_address")}
          />
        </div>
      </div>
      
      {/* Business Contact Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-wakti-blue" />
            <h3 className="text-lg font-medium">Business Contact</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            How customers can reach your business
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="businessEmail" className="font-medium flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-wakti-blue" />
              Business Email
            </Label>
            <Input 
              id="businessEmail" 
              type="email"
              placeholder="contact@yourbusiness.com" 
              className="border-gray-300 focus-visible:ring-wakti-blue"
              {...register("business_email")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessPhone" className="font-medium flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-wakti-blue" />
              Business Phone
            </Label>
            <Input 
              id="businessPhone" 
              placeholder="+1 (555) 123-4567" 
              className="border-gray-300 focus-visible:ring-wakti-blue"
              {...register("business_phone")}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessWebsite" className="font-medium flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-wakti-blue" />
            Business Website
          </Label>
          <Input 
            id="businessWebsite" 
            placeholder="https://www.yourbusiness.com" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("business_website")}
          />
        </div>
      </div>
      
      {/* Business Description Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-wakti-blue" />
            <h3 className="text-lg font-medium">Business Description</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tell customers about your business
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div className="space-y-2">
          <Label htmlFor="businessDescription" className="font-medium">Business Description</Label>
          <Textarea
            id="businessDescription"
            className="w-full min-h-[150px] border-gray-300 focus-visible:ring-wakti-blue"
            placeholder="Tell us about your business, services offered, and what makes you unique..."
            {...register("occupation")}
          />
        </div>
      </div>
      
      {/* Administrator Info Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Administrator Position</h3>
          <p className="text-sm text-muted-foreground">
            Your role in the organization
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div className="space-y-2">
          <Label htmlFor="displayName" className="font-medium">Your Position/Title</Label>
          <Input 
            id="displayName" 
            placeholder="e.g. CEO, Manager, Owner" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("display_name")} 
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileFields;

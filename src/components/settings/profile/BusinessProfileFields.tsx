
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Separator } from "@/components/ui/separator";
import { Building2, AtSign, Phone, Globe } from "lucide-react";

interface BusinessProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  watch?: UseFormWatch<ProfileFormData>;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ register, watch }) => {
  // Use watch to get the current value of business_type
  const businessType = watch ? watch("business_type") : "";
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Business Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Tell us about your business
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2">
          <Label htmlFor="business_name" className="font-medium">Business Name</Label>
          <Input 
            id="business_name" 
            placeholder="Your business name" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("business_name")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business_type" className="font-medium">Business Type</Label>
          <Select 
            onValueChange={(value) => register("business_type").onChange({ target: { value } })}
            defaultValue={businessType || ""}
          >
            <SelectTrigger className="border-gray-300 focus-visible:ring-wakti-blue">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="service">Service Provider</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="finance">Finance & Banking</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="transportation">Transportation & Logistics</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="energy">Energy & Utilities</SelectItem>
              <SelectItem value="legal">Legal Services</SelectItem>
              <SelectItem value="nonprofit">Non-profit & NGO</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="business_address" className="font-medium">Business Address</Label>
        <Textarea 
          id="business_address" 
          placeholder="Full business address"
          className="min-h-[80px] border-gray-300 focus-visible:ring-wakti-blue" 
          {...register("business_address")} 
        />
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <AtSign className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Contact Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          How clients can reach your business
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="business_email" className="font-medium flex items-center gap-1.5">
            <AtSign className="h-4 w-4 text-wakti-blue" />
            Business Email
          </Label>
          <Input 
            id="business_email" 
            type="email"
            placeholder="contact@yourbusiness.com" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("business_email")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business_phone" className="font-medium flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-wakti-blue" />
            Business Phone
          </Label>
          <Input 
            id="business_phone" 
            placeholder="+1 (555) 123-4567" 
            className="border-gray-300 focus-visible:ring-wakti-blue"
            {...register("business_phone")} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="business_website" className="font-medium flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-wakti-blue" />
          Business Website
        </Label>
        <Input 
          id="business_website" 
          placeholder="https://www.yourbusiness.com" 
          className="border-gray-300 focus-visible:ring-wakti-blue"
          {...register("business_website")} 
        />
      </div>
    </div>
  );
};

export default BusinessProfileFields;


import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditStaffFormValues, StaffRelationData } from "../hooks/useStaffDetailsForm";
import { RoleSection } from "./components/RoleSection";

interface DetailsTabProps {
  form: UseFormReturn<EditStaffFormValues>;
  staffData: StaffRelationData;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ form, staffData }) => {
  // Generate initials for avatar
  const getInitials = () => {
    const name = staffData?.name || (staffData?.profiles?.full_name || "");
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={staffData.profiles?.avatar_url} 
            alt={staffData.name || "Staff Member"} 
          />
          <AvatarFallback className="text-lg">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {staffData.role === "co-admin" && (
            <Badge variant="secondary">Co-Admin</Badge>
          )}
          {staffData.is_service_provider && (
            <Badge variant="outline">Service Provider</Badge>
          )}
          {staffData.status !== "active" && (
            <Badge variant="destructive">{staffData.status}</Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter email" 
                  {...field} 
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Manager, Receptionist" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {staffData.staff_number && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Staff Number</p>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              {staffData.staff_number}
            </p>
          </div>
        )}
        
        <RoleSection form={form} />
      </div>
    </div>
  );
};

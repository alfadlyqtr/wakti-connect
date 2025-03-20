
import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "@/hooks/staff/types";

interface StaffSignupFormFieldsProps {
  form: UseFormReturn<{
    password: string;
    confirmPassword: string;
  }>; 
  invitation: any;
  isSubmitting: boolean;
  onSubmit: (values: {
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
}

const StaffSignupFormFields: React.FC<StaffSignupFormFieldsProps> = ({ 
  form, 
  invitation, 
  isSubmitting, 
  onSubmit 
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Invitation Details</p>
          <div className="p-3 bg-muted rounded text-sm">
            <p><span className="font-medium">Name:</span> {invitation?.name}</p>
            <p><span className="font-medium">Email:</span> {invitation?.email}</p>
            <p><span className="font-medium">Role:</span> {invitation?.role?.charAt(0).toUpperCase() + invitation?.role?.slice(1)}</p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full mt-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StaffSignupFormFields;

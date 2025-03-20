
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StaffSignupFormFieldsProps {
  form: UseFormReturn<{
    password: string;
    confirmPassword: string;
  }>;
  invitation: any;
  isSubmitting: boolean;
  onSubmit: (values: { password: string; confirmPassword: string }) => void;
}

const StaffSignupFormFields: React.FC<StaffSignupFormFieldsProps> = ({
  form,
  invitation,
  isSubmitting,
  onSubmit
}) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="mb-6 bg-muted p-4 rounded-md">
        <div className="font-medium">{invitation.name}</div>
        <div className="text-sm text-muted-foreground">{invitation.email}</div>
        <div className="text-sm mt-1">
          <span className="text-muted-foreground">Role: </span>
          <span className="font-medium">{invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Registration
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => navigate("/auth")}>
          Already have an account? Log in
          <ArrowRightCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StaffSignupFormFields;

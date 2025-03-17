
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const accountFormSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email")
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountInfoFormProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const AccountInfoForm: React.FC<AccountInfoFormProps> = ({ profile }) => {
  const isBusinessAccount = profile?.account_type === 'business';
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || ''
    }
  });

  const onSubmit = async (values: AccountFormValues) => {
    try {
      // Update profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: values.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile?.id);

      if (profileError) throw profileError;
      
      // If email has changed, update auth email
      if (values.email !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email
        });
        
        if (emailError) throw emailError;
      }
      
      toast({
        title: "Account updated",
        description: "Your account information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your account information.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex flex-row items-center justify-between">
                <FormLabel>{isBusinessAccount ? "Admin Name" : "Name"}</FormLabel>
                {isBusinessAccount && (
                  <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <FormControl>
                <Input {...field} placeholder={isBusinessAccount ? "Admin name" : "Your name"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountInfoForm;

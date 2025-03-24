
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, User, Mail, Phone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const accountFormSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  telephone: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional()
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
      email: profile?.email || '',
      telephone: profile?.telephone || '',
      gender: profile?.gender || 'prefer_not_to_say',
      date_of_birth: profile?.date_of_birth || ''
    }
  });

  const onSubmit = async (values: AccountFormValues) => {
    try {
      // Update profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: values.full_name,
          telephone: values.telephone,
          gender: values.gender,
          date_of_birth: values.date_of_birth,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-wakti-blue" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your primary account information
            </p>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <FormLabel className="font-medium">
                      {isBusinessAccount ? "Admin Name" : "Full Name"}
                    </FormLabel>
                    {isBusinessAccount && (
                      <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isBusinessAccount ? "Admin name" : "Your name"} 
                      className="border-gray-300 focus-visible:ring-wakti-blue"
                    />
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
                  <FormLabel className="font-medium flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-wakti-blue" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      placeholder="Your email" 
                      className="border-gray-300 focus-visible:ring-wakti-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Personal Details Section */}
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Personal Details</h3>
            <p className="text-sm text-muted-foreground">
              Additional personal information
            </p>
          </div>
          
          <Separator className="bg-gray-200" />
          
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-wakti-blue" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="+1 (555) 123-4567" 
                    className="border-gray-300 focus-visible:ring-wakti-blue"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium">Gender</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-x-5 gap-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="text-wakti-blue" />
                      <FormLabel htmlFor="male" className="cursor-pointer font-normal">Male</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="text-wakti-blue" />
                      <FormLabel htmlFor="female" className="cursor-pointer font-normal">Female</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" className="text-wakti-blue" />
                      <FormLabel htmlFor="prefer_not_to_say" className="cursor-pointer font-normal">Prefer not to say</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium">Date of Birth</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-wakti-blue" />
                        {field.value ? format(new Date(field.value), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90 mt-4"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountInfoForm;


import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaffNumberInputProps {
  form: UseFormReturn<StaffFormValues>;
}

const StaffNumberInput: React.FC<StaffNumberInputProps> = ({ form }) => {
  const [businessPrefix, setBusinessPrefix] = useState<string>("");
  
  // Get business name for prefix
  const { data: businessData } = useQuery({
    queryKey: ['businessNameForStaffNumber'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('business_name')
        .eq('id', session.user.id)
        .single();
      
      return data;
    }
  });
  
  useEffect(() => {
    if (businessData?.business_name) {
      // Generate prefix from business name (first 3 characters, uppercase)
      const prefix = businessData.business_name
        .substring(0, 3)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
      
      setBusinessPrefix(prefix);
      
      // Set initial staff number if empty
      const currentStaffNumber = form.getValues('staffNumber');
      if (!currentStaffNumber) {
        form.setValue('staffNumber', `${prefix}_`);
      }
    }
  }, [businessData, form]);
  
  return (
    <FormField
      control={form.control}
      name="staffNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Staff Number <span className="text-muted-foreground">(Optional)</span></FormLabel>
          <FormControl>
            <div className="relative">
              {businessPrefix && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {businessPrefix}_
                </div>
              )}
              <Input
                {...field}
                className={businessPrefix ? "pl-14" : ""}
                placeholder="Enter unique staff number"
                onChange={(e) => {
                  // If user deletes prefix, add it back
                  const value = e.target.value;
                  if (businessPrefix && !value.startsWith(`${businessPrefix}_`)) {
                    field.onChange(`${businessPrefix}_${value.replace(`${businessPrefix}_`, '')}`);
                  } else {
                    field.onChange(value);
                  }
                }}
              />
            </div>
          </FormControl>
          <FormDescription>
            A unique identifier for this staff member (auto-prefixed with business code)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffNumberInput;

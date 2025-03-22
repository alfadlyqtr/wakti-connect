
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { StaffFormValues } from "../StaffFormSchema";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RoleIdentityFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

const RoleIdentityFields: React.FC<RoleIdentityFieldsProps> = ({ form }) => {
  // Generate staff number based on business name
  const { data: businessData } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('business_name')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  // Get staff count for numbering
  const { data: staffCount } = useQuery({
    queryKey: ['staffCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id);
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  // Generate staff number
  const staffNumber = React.useMemo(() => {
    if (!businessData?.business_name) return 'STAFF_001';
    
    const prefix = businessData.business_name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
      
    return `${prefix}_${String(staffCount || 0).padStart(3, '0')}`;
  }, [businessData, staffCount]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        <h4 className="text-lg font-medium">Role & Identity</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel className="text-sm">Staff Number</FormLabel>
          <div className="flex items-center mt-2">
            <Input value={staffNumber} readOnly className="bg-muted" />
            <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border">Auto-generated</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unique identifier for this staff member
          </p>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isCoAdmin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Co-Admin</FormLabel>
                  <FormDescription>
                    Make this staff a co-admin (limit 1)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isServiceProvider"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Service Provider</FormLabel>
                  <FormDescription>
                    Can provide services to customers
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Separator />
    </div>
  );
};

export default RoleIdentityFields;

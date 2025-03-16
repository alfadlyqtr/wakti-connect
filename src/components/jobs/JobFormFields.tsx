
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { JobFormValues } from "./JobFormSchema";
import { Clock, DollarSign } from "lucide-react";

interface JobFormFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

const JobFormFields: React.FC<JobFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter job name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter job description..." 
                className="min-h-[80px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-md border border-input bg-background px-3 has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Duration"
                    {...field}
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="default_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Price</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-md border border-input bg-background px-3 has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Price"
                    {...field}
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default JobFormFields;

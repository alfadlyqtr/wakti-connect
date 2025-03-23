
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { JobCardFormValues } from "./JobCardFormSchema";
import { formatCurrency } from "@/utils/formatUtils";
import { Job } from "@/types/jobs.types";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardFormFieldsProps {
  jobs?: Job[] | null;
  selectedDate: Date;
  setSelectedDate?: (date: Date) => void;
  readOnlyDate?: boolean;
}

const JobCardFormFields: React.FC<JobCardFormFieldsProps> = ({
  jobs,
  selectedDate,
  setSelectedDate,
  readOnlyDate = false
}) => {
  const form = useFormContext<JobCardFormValues>();
  const selectedJobId = form.watch("job_id");
  
  useEffect(() => {
    if (selectedJobId && jobs) {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob?.default_price) {
        form.setValue("payment_amount", selectedJob.default_price);
      }
    }
  }, [selectedJobId, jobs, form]);
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="job_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Job</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {jobs?.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    <span className="font-medium">{job.name}</span>
                    {job.default_price && (
                      <span className="ml-2 text-muted-foreground">
                        ({formatCurrency(job.default_price)})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem>
        <FormLabel>Date</FormLabel>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-muted/50"
          )}
          disabled={true}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedDate, "PPP")} (Today)
        </Button>
        {readOnlyDate && (
          <div className="text-xs text-muted-foreground mt-1">
            Job cards can only be created for the current day
          </div>
        )}
      </FormItem>
      
      <FormField
        control={form.control}
        name="payment_method"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Payment Method
              <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="pos">POS (Card/Digital)</SelectItem>
                <SelectItem value="none">No Payment</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="payment_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Amount</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                value={field.value || 0}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add any notes about this job..."
                className="min-h-[80px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default JobCardFormFields;

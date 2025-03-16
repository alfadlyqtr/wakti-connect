
import React, { useState, useEffect } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { JobCardFormValues } from "./JobCardFormSchema";
import { formatCurrency } from "@/utils/formatUtils";
import { Job } from "@/types/jobs.types";

interface JobCardFormFieldsProps {
  jobs?: Job[] | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

const JobCardFormFields: React.FC<JobCardFormFieldsProps> = ({
  jobs,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
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
      
      <div className="space-y-4">
        <FormItem>
          <FormLabel>Date</FormLabel>
          <DatePicker 
            date={selectedDate} 
            setDate={setSelectedDate}
          />
        </FormItem>
        
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <Input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormItem>
          
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <Input 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormItem>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="payment_method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Method</FormLabel>
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


import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BookingDetailsFieldsProps {
  control: Control<any>;
}

const BookingDetailsFields: React.FC<BookingDetailsFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Booking Details</h3>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Title</FormLabel>
            <FormControl>
              <Input placeholder="Booking title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Additional details about this booking" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BookingDetailsFields;


import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffMember } from "@/types/staff";

interface StaffAssignmentProps {
  control: Control<any>;
  staff: StaffMember[];
  selectedStaffIds: string[];
  onStaffChange: (staffId: string, isChecked: boolean) => void;
}

const StaffAssignment: React.FC<StaffAssignmentProps> = ({
  control,
  staff,
  selectedStaffIds,
  onStaffChange
}) => {
  return (
    <FormField
      control={control}
      name="staff_assigned_ids"
      render={() => (
        <FormItem>
          <FormLabel>Assign Staff (Optional)</FormLabel>
          <div className="border rounded-md p-4 space-y-2">
            {staff.length === 0 ? (
              <p className="text-sm text-muted-foreground">No service providers available</p>
            ) : (
              staff.map((staffMember) => (
                <div key={staffMember.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`staff-${staffMember.id}`} 
                    checked={selectedStaffIds.includes(staffMember.id)}
                    onCheckedChange={(checked) => 
                      onStaffChange(staffMember.id, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`staff-${staffMember.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {staffMember.name}
                  </label>
                </div>
              ))
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffAssignment;

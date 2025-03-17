
import React, { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Staff } from "@/hooks/useStaffData";

interface StaffAssignmentSectionProps {
  selectedStaff: string[];
  onStaffChange: (staffIds: string[]) => void;
  staffData?: Staff[];
  isStaffLoading: boolean;
}

const StaffAssignmentSection: React.FC<StaffAssignmentSectionProps> = ({
  selectedStaff,
  onStaffChange,
  staffData,
  isStaffLoading
}) => {
  const [staffSearchQuery, setStaffSearchQuery] = useState("");
  
  // Check if we have any staff members
  const hasStaffMembers = staffData && staffData.length > 0;

  // Get staff member by ID
  const getStaffMemberById = (id: string) => {
    return staffData?.find(staff => staff.id === id);
  };

  const handleStaffToggle = (staffId: string) => {
    const updatedStaff = selectedStaff.includes(staffId)
      ? selectedStaff.filter(id => id !== staffId)
      : [...selectedStaff, staffId];
    
    onStaffChange(updatedStaff);
  };

  // Filter staff by search query
  const filteredStaff = staffData?.filter(staff => 
    staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
  ) || [];

  if (!hasStaffMembers) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Staff Assignment</AlertTitle>
        <AlertDescription>
          You can assign staff to this service after adding staff members in the Staff Management section.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3 border p-4 rounded-md">
      <FormLabel className="text-base">Assign Staff</FormLabel>
      
      {/* Selected Staff Badges */}
      {selectedStaff.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedStaff.map(staffId => {
            const staff = getStaffMemberById(staffId);
            return (
              <Badge key={staffId} variant="secondary" className="flex items-center gap-1">
                {staff?.name || "Unknown"}
                <XCircle 
                  className="h-3.5 w-3.5 cursor-pointer ml-1" 
                  onClick={() => handleStaffToggle(staffId)}
                />
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Staff Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff members..."
          className="pl-9"
          value={staffSearchQuery}
          onChange={(e) => setStaffSearchQuery(e.target.value)}
        />
      </div>
      
      {isStaffLoading ? (
        <div className="text-sm text-muted-foreground p-2">Loading staff members...</div>
      ) : (
        <ScrollArea className="h-48 border rounded-md">
          <div className="p-2">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <div 
                  key={staff.id} 
                  className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted ${
                    selectedStaff.includes(staff.id) ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleStaffToggle(staff.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`staff-${staff.id}`} 
                      checked={selectedStaff.includes(staff.id)} 
                      onCheckedChange={() => handleStaffToggle(staff.id)}
                    />
                    <label 
                      htmlFor={`staff-${staff.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {staff.name}
                    </label>
                    <span className="text-xs text-muted-foreground">({staff.role})</span>
                  </div>
                  
                  {selectedStaff.includes(staff.id) && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No staff members found matching "{staffSearchQuery}"
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default StaffAssignmentSection;

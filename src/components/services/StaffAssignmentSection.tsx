
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Search, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
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
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  
  // Derive state
  const hasStaffMembers = staffData && staffData.length > 0;
  
  // Filter staff by search query
  useEffect(() => {
    if (!staffData) {
      setFilteredStaff([]);
      return;
    }
    
    const filtered = staffData.filter(staff => 
      staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase())
    );
    
    setFilteredStaff(filtered);
  }, [staffData, staffSearchQuery]);

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

  // Clear all selections
  const clearSelections = () => {
    onStaffChange([]);
  };

  if (isStaffLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 border rounded-md bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading staff members...</p>
      </div>
    );
  }

  if (!hasStaffMembers) {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle>No Service Providers Found</AlertTitle>
        <AlertDescription>
          You need to add staff members marked as service providers in the Staff Management section before you can assign them to services.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3 border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">Assign Service Providers</div>
        {selectedStaff.length > 0 && (
          <button 
            type="button" 
            onClick={clearSelections}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear all
          </button>
        )}
      </div>
      
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
          placeholder="Search service providers..."
          className="pl-9"
          value={staffSearchQuery}
          onChange={(e) => setStaffSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredStaff.length === 0 ? (
        <div className="text-sm text-amber-600 p-4 text-center border rounded-md bg-amber-50">
          <AlertCircle className="h-4 w-4 inline-block mr-2" />
          {staffSearchQuery 
            ? `No service providers found matching "${staffSearchQuery}"`
            : "No service providers found. Make sure to mark staff members as service providers in Staff Management."}
        </div>
      ) : (
        <ScrollArea className="h-48 border rounded-md">
          <div className="p-2">
            {filteredStaff.map((staff) => (
              <div 
                key={staff.id} 
                className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted cursor-pointer ${
                  selectedStaff.includes(staff.id) ? 'bg-muted' : ''
                }`}
                onClick={() => handleStaffToggle(staff.id)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`staff-${staff.id}`} 
                    checked={selectedStaff.includes(staff.id)} 
                    onCheckedChange={() => handleStaffToggle(staff.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex flex-col">
                    <label 
                      htmlFor={`staff-${staff.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {staff.name}
                    </label>
                    <span className="text-xs text-muted-foreground">{staff.role}</span>
                  </div>
                </div>
                
                {selectedStaff.includes(staff.id) && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default StaffAssignmentSection;


import React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppointmentControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateAppointment: () => void;
  isPaidAccount: boolean;
}

const AppointmentControls = ({
  searchQuery,
  onSearchChange,
  onCreateAppointment,
  isPaidAccount
}: AppointmentControlsProps) => {
  if (!isPaidAccount) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search appointments..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button onClick={onCreateAppointment} className="flex items-center gap-2">
        <Plus size={16} />
        <span className="hidden sm:inline">Schedule Appointment</span>
      </Button>
    </div>
  );
};

export default AppointmentControls;

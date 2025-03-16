
import React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentTab } from "@/hooks/useAppointments";

interface AppointmentControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateAppointment: () => void;
  currentTab: AppointmentTab;
  onTabChange: (tab: AppointmentTab) => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business";
}

const AppointmentControls = ({
  searchQuery,
  onSearchChange,
  onCreateAppointment,
  currentTab,
  onTabChange,
  isPaidAccount,
  userRole
}: AppointmentControlsProps) => {
  if (!isPaidAccount) return null;

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={currentTab} 
        onValueChange={(value) => onTabChange(value as AppointmentTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="shared-appointments">Shared Appointments</TabsTrigger>
          <TabsTrigger value="assigned-appointments">
            {userRole === "business" ? "Team Appointments" : "Assigned Appointments"}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
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
          <span className="hidden sm:inline">
            {currentTab === "assigned-appointments" && userRole === "business" 
              ? "Assign Appointment" 
              : "Create Appointment"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default AppointmentControls;

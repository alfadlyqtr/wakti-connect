
import React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentTab } from "@/types/appointment.types";

interface AppointmentControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateAppointment: () => void;
  currentTab: AppointmentTab;
  onTabChange: (tab: AppointmentTab) => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business";
  availableTabs?: AppointmentTab[];
}

const AppointmentControls = ({
  searchQuery,
  onSearchChange,
  onCreateAppointment,
  currentTab,
  onTabChange,
  isPaidAccount,
  userRole,
  availableTabs = ["my-appointments", "shared-appointments", "assigned-appointments"]
}: AppointmentControlsProps) => {
  // Explicitly log user role for debugging
  console.log("AppointmentControls - isPaidAccount:", isPaidAccount, "userRole:", userRole);
  
  return (
    <div className="space-y-4">
      {isPaidAccount && (
        <Tabs 
          defaultValue={currentTab} 
          onValueChange={(value) => onTabChange(value as AppointmentTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="shared-appointments">Shared Appointments</TabsTrigger>
            <TabsTrigger value="team-appointments">
              {userRole === "business" ? "Team Appointments" : "Assigned Appointments"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
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
        
        <Button 
          onClick={onCreateAppointment} 
          className="flex items-center gap-2"
          disabled={!isPaidAccount}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">
            {currentTab === "team-appointments" && userRole === "business" 
              ? "Assign Appointment" 
              : "Create Appointment"}
          </span>
          <span className="inline sm:hidden">
            {currentTab === "team-appointments" && userRole === "business" 
              ? "Assign" 
              : "Create"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default AppointmentControls;

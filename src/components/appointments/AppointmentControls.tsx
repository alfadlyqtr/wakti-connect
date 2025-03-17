
import React from "react";
import { AppointmentTab } from "@/types/appointment.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, Users, UserCheck, ClipboardList } from "lucide-react";

interface AppointmentControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateAppointment: () => void;
  isPaidAccount: boolean;
  currentTab: AppointmentTab;
  onTabChange: (value: AppointmentTab) => void;
  userRole: "free" | "individual" | "business";
  availableTabs: AppointmentTab[];
  hasReachedMonthlyLimit?: boolean;
}

const AppointmentControls: React.FC<AppointmentControlsProps> = ({
  searchQuery,
  onSearchChange,
  onCreateAppointment,
  isPaidAccount,
  currentTab,
  onTabChange,
  userRole,
  availableTabs,
  hasReachedMonthlyLimit = false
}) => {
  const isTabAvailable = (tab: AppointmentTab) => {
    return availableTabs.includes(tab);
  };

  const handleTabChange = (value: string) => {
    onTabChange(value as AppointmentTab);
  };

  const tabOptions = [
    { id: "my-appointments", label: "My Appointments", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { id: "shared-appointments", label: "Shared", icon: <Users className="h-4 w-4 mr-2" /> },
    { id: "assigned-appointments", label: "Assigned to Me", icon: <UserCheck className="h-4 w-4 mr-2" /> },
    { id: "team-appointments", label: "Team", icon: <ClipboardList className="h-4 w-4 mr-2" /> },
    { id: "invitations", label: "Invitations", icon: <Calendar className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          onClick={onCreateAppointment} 
          disabled={!isPaidAccount || hasReachedMonthlyLimit}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" /> 
          New Appointment
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          {tabOptions.filter(tab => isTabAvailable(tab.id as AppointmentTab)).map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center whitespace-nowrap">
              {tab.icon} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AppointmentControls;

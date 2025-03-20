
import React from "react";
import { StaffWithSessions } from "@/hooks/useStaffData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import StaffCard from "./StaffCard";
import StaffWorkSessionTable from "./StaffWorkSessionTable";

interface StaffListProps {
  staffData?: StaffWithSessions[] | null;
  isLoading: boolean;
}

export const StaffList: React.FC<StaffListProps> = ({ staffData, isLoading }) => {
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null);
  
  const selectedStaff = selectedStaffId 
    ? staffData?.find(staff => staff.id === selectedStaffId)
    : null;
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!staffData || staffData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Staff Members</h3>
          <p className="text-muted-foreground">
            You don't have any staff members yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staffData.map((staff) => (
          <StaffCard 
            key={staff.id}
            staff={staff}
            isSelected={selectedStaffId === staff.id}
            onClick={() => setSelectedStaffId(staff.id)}
          />
        ))}
      </div>
      
      {selectedStaff && (
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                Work Sessions for {selectedStaff.name}
              </h3>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Sessions</TabsTrigger>
                  <TabsTrigger value="active">Active Sessions</TabsTrigger>
                  <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <StaffWorkSessionTable sessions={selectedStaff.sessions} />
                </TabsContent>
                
                <TabsContent value="active">
                  <StaffWorkSessionTable 
                    sessions={selectedStaff.sessions.filter(s => s.status === 'active')} 
                  />
                </TabsContent>
                
                <TabsContent value="completed">
                  <StaffWorkSessionTable 
                    sessions={selectedStaff.sessions.filter(s => s.status === 'completed')} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

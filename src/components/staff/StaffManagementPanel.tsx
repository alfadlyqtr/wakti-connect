
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffFormPanel from "./StaffFormPanel";
import StaffMembersList from "./StaffMembersList";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const StaffManagementPanel = () => {
  const [activeTab, setActiveTab] = React.useState("list");
  const [editingStaffId, setEditingStaffId] = React.useState<string | null>(null);
  
  // Fetch staff count
  const { data: staffCount, isLoading: countLoading } = useQuery({
    queryKey: ['staffCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const { count, error } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id)
        .eq('status', 'active');
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  const canAddMoreStaff = (staffCount || 0) < 6;
  
  const handleCreateStaff = () => {
    setEditingStaffId(null);
    setActiveTab("create");
  };
  
  const handleEditStaff = (staffId: string) => {
    setEditingStaffId(staffId);
    setActiveTab("create");
  };
  
  const handleStaffCreated = () => {
    setActiveTab("list");
    setEditingStaffId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">
            Manage your staff accounts and permissions
          </p>
        </div>
        
        {canAddMoreStaff ? (
          <Button onClick={handleCreateStaff} disabled={activeTab === "create"}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff Account
          </Button>
        ) : (
          <Button disabled variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Staff limit reached (6/6)
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Staff List</TabsTrigger>
          <TabsTrigger value="create" disabled={!canAddMoreStaff && !editingStaffId}>
            {editingStaffId ? "Edit Staff" : "Create Staff"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="pt-4">
          <StaffMembersList onEditStaff={handleEditStaff} />
        </TabsContent>
        
        <TabsContent value="create" className="pt-4">
          <Card className="p-6">
            <StaffFormPanel 
              staffId={editingStaffId} 
              onSuccess={handleStaffCreated} 
              onCancel={() => setActiveTab("list")} 
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagementPanel;

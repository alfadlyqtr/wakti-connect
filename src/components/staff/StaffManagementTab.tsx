
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Briefcase, UserPlus } from "lucide-react";
import CreateStaffDialog from "./CreateStaffDialog";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
}

const StaffManagementTab = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*');
        
      if (staffError) throw staffError;
      return staffData as StaffMember[];
    }
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffLoading ? (
          <Card className="col-span-full flex justify-center p-8">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </Card>
        ) : staffError ? (
          <Card className="col-span-full p-8">
            <p className="text-center text-destructive">Error loading staff members</p>
          </Card>
        ) : !staffMembers || staffMembers.length === 0 ? (
          <Card className="col-span-full p-8">
            <div className="text-center">
              <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
              <p className="text-muted-foreground mb-4">Add staff members to your business.</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          </Card>
        ) : (
          staffMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {member.name ? member.name.substring(0, 2).toUpperCase() : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant={member.role === "admin" ? "secondary" : "outline"}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{member.name || "Unnamed Staff"}</CardTitle>
                <CardDescription>{member.position || "Staff Member"}</CardDescription>
                {member.email && (
                  <CardDescription className="text-xs">{member.email}</CardDescription>
                )}
                {member.staff_id !== member.id && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Active Account
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};

export default StaffManagementTab;

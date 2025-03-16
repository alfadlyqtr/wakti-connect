
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  role: string;
  created_at: string;
  profile?: Profile | null;
}

const StaffManagementTab = () => {
  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First fetch the business staff records
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', session.session.user.id);
        
      if (staffError) throw staffError;
      
      // Now fetch profile data for each staff member
      const staffWithProfiles = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', staff.staff_id)
            .single();
            
          return {
            ...staff,
            profile: profileError ? null : profileData
          } as StaffMember;
        })
      );
      
      return staffWithProfiles;
    }
  });

  const handleInviteStaff = () => {
    toast({
      title: "Invite sent",
      description: "Staff invitation has been sent successfully.",
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleInviteStaff}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Staff
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
        ) : staffMembers?.length === 0 ? (
          <Card className="col-span-full p-8">
            <div className="text-center">
              <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
              <p className="text-muted-foreground mb-4">Invite new staff members to your business.</p>
              <Button onClick={handleInviteStaff}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Staff
              </Button>
            </div>
          </Card>
        ) : (
          staffMembers?.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profile?.avatar_url || ""} alt={member.profile?.full_name || "Staff"} />
                    <AvatarFallback>
                      {member.profile?.full_name?.substring(0, 2) || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant={member.role === "admin" ? "secondary" : "outline"}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{member.profile?.full_name || "Unnamed Staff"}</CardTitle>
                <CardDescription>Joined {new Date(member.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>3 services assigned</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>12 bookings this month</span>
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
    </>
  );
};

export default StaffManagementTab;

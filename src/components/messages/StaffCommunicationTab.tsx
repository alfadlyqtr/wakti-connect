
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ConversationsList from "./ConversationsList";
import { Button } from "@/components/ui/button";

interface StaffCommunicationTabProps {
  businessId?: string | null;
}

interface StaffMember {
  id: string;
  staff_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
}

const StaffCommunicationTab: React.FC<StaffCommunicationTabProps> = ({ businessId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      if (!businessId) return [];
      
      // First fetch staff records
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select(`
          id,
          staff_id,
          name,
          email,
          role
        `)
        .eq('business_id', businessId)
        .eq('status', 'active');
        
      if (staffError) {
        console.error("Error fetching staff members:", staffError);
        throw staffError;
      }

      // For each staff member, get their profile data to access avatar_url
      const staffWithProfiles = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', staff.staff_id)
            .single();
            
          return {
            ...staff,
            avatar_url: profileData?.avatar_url || null
          };
        })
      );
      
      return staffWithProfiles as StaffMember[];
    },
    enabled: !!businessId
  });
  
  // Function to handle messaging a staff member
  const handleMessageStaff = (staffId: string) => {
    // Navigate to the messaging page with the staff member's ID
    navigate(`/dashboard/messages/${staffId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Communication
          </h2>
          <p className="text-muted-foreground">
            Message your team members directly
          </p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recent Staff Conversations</h3>
          </div>
          <ConversationsList staffOnly={true} />
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="font-medium text-lg">Error Loading Staff</h3>
              <p className="text-muted-foreground">
                There was an error loading your staff members.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : staffMembers && staffMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((staff) => (
            <Card 
              key={staff.id} 
              className="overflow-hidden hover:bg-accent/5 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{staff.role}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleMessageStaff(staff.staff_id);
                    }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="font-medium text-lg">No Staff Members</h3>
              <p className="text-muted-foreground">
                You don't have any staff members yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffCommunicationTab;


import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";
import { forceSyncStaffContacts } from "@/services/contacts/contactSync";
import { toast } from "@/components/ui/use-toast";

interface ContactsStaffRestrictionProps {
  businessId?: string;
  businessName?: string;
}

interface StaffMemberData {
  id: string;
  name: string;
  avatar?: string | null;
}

const ContactsStaffRestriction: React.FC<ContactsStaffRestrictionProps> = ({ 
  businessId: propBusinessId,
  businessName: propBusinessName 
}) => {
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(propBusinessId || null);
  const [businessName, setBusinessName] = useState<string>(propBusinessName || "your business");
  const [isSyncing, setIsSyncing] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMemberData[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        if (!propBusinessId) {
          const businessId = await getStaffBusinessId();
          setBusinessId(businessId);
          
          if (businessId) {
            const { data } = await supabase
              .from('profiles')
              .select('business_name, full_name')
              .eq('id', businessId)
              .single();
              
            if (data?.business_name || data?.full_name) {
              setBusinessName(data.business_name || data.full_name || "your business");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch business details:", error);
      }
    };

    const fetchStaffMembers = async () => {
      setIsLoadingStaff(true);
      try {
        const bizId = propBusinessId || await getStaffBusinessId();
        
        if (!bizId) {
          setIsLoadingStaff(false);
          return;
        }
        
        // Get all active staff members from this business
        const { data: staffData, error } = await supabase
          .from('business_staff')
          .select(`
            id, 
            staff_id,
            staff_id:profiles(
              display_name,
              full_name,
              avatar_url
            )
          `)
          .eq('business_id', bizId)
          .eq('status', 'active');
          
        if (error) {
          console.error("Error fetching staff:", error);
          return;
        }
        
        // Format staff data for display
        const formattedStaff = staffData.map(staff => {
          // Safe access of nested properties using optional chaining
          const profileData = staff.staff_id as any; // Type assertion for nested join
          return {
            id: staff.staff_id as string,
            name: profileData?.display_name || profileData?.full_name || "Staff Member",
            avatar: profileData?.avatar_url
          };
        });
        
        setStaffMembers(formattedStaff);
      } catch (error) {
        console.error("Error loading staff members:", error);
      } finally {
        setIsLoadingStaff(false);
      }
    };
    
    fetchBusinessInfo();
    fetchStaffMembers();
  }, [propBusinessId]);

  const handleSyncContacts = async () => {
    setIsSyncing(true);
    try {
      const result = await forceSyncStaffContacts();
      if (result.success) {
        toast({
          title: "Connections Refreshed",
          description: "Your messaging connections with the business and other staff have been updated.",
        });
      } else {
        toast({
          title: "Sync Failed",
          description: result.message || "Could not sync business messaging connections.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing contacts:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col items-center text-center gap-2">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h3 className="text-xl font-semibold">Staff Messaging System</h3>
          
          <p className="text-muted-foreground max-w-md">
            As a staff member, you can only message 
            {businessName !== "your business" ? ` ${businessName}` : " your business"} and 
            other staff members.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4 justify-center">            
            {businessId && (
              <Button 
                onClick={() => navigate(`/dashboard/messages/${businessId}`)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message Business Owner
              </Button>
            )}
            
            <Button 
              variant="secondary"
              onClick={handleSyncContacts}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Refresh Messaging Connections'}
            </Button>
          </div>
          
          {staffMembers.length > 0 && (
            <div className="mt-4 w-full">
              <h4 className="text-sm font-medium mb-2 flex items-center justify-center gap-1">
                <Users className="h-4 w-4" /> Other Staff Members
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {staffMembers.map(staff => (
                  <Button 
                    key={staff.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate(`/dashboard/messages/${staff.id}`)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {staff.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {isLoadingStaff && (
            <p className="text-sm text-muted-foreground mt-2">Loading staff members...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsStaffRestriction;

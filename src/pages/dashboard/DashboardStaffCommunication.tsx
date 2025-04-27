
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContacts } from "@/hooks/useContacts";
import ContactsList from "@/components/contacts/ContactsList";
import { syncStaffBusinessContacts } from "@/services/contacts";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const DashboardStaffCommunication = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [userType, setUserType] = useState<'business' | 'staff' | 'other'>('other');
  
  const {
    staffContacts,
    isLoadingStaffContacts,
    refreshContacts
  } = useContacts();
  
  useEffect(() => {
    const checkUserType = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Check if user is a business owner
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', data.session.user.id)
          .single();
          
        if (profile?.account_type === 'business') {
          setIsBusinessOwner(true);
          setUserType('business');
          return;
        }
        
        // Check if user is staff
        const bizId = await getStaffBusinessId();
        if (bizId) {
          setUserType('staff');
        }
      }
    };
    
    checkUserType();
  }, []);
  
  const handleSyncContacts = async () => {
    setIsSyncing(true);
    try {
      const result = await syncStaffBusinessContacts();
      if (result.success) {
        toast({
          title: "Staff contacts synced",
          description: "All staff contacts have been synchronized"
        });
        refreshContacts();
      } else {
        throw new Error(result.message || "Failed to sync contacts");
      }
    } catch (error) {
      console.error("Error syncing staff contacts:", error);
      toast({
        title: "Sync failed",
        description: "Could not sync staff contacts",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Communications</h1>
        <p className="text-muted-foreground">
          {isBusinessOwner 
            ? "Communicate with your staff members" 
            : "Communicate with your business and other staff members"}
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff Contacts</CardTitle>
            <CardDescription>
              {isBusinessOwner 
                ? "Your staff members are automatically connected for messaging" 
                : "Your business owner and fellow staff members"}
            </CardDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncContacts}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Contacts'}
          </Button>
        </CardHeader>
        <CardContent>
          <ContactsList 
            contacts={staffContacts || []} 
            isLoading={isLoadingStaffContacts}
            // Staff contacts cannot be deleted as they are maintained by the system
            onDeleteContact={undefined}
          />
        </CardContent>
      </Card>
      
      {staffContacts && staffContacts.length === 0 && !isLoadingStaffContacts && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader>
            <CardTitle>No Staff Contacts Found</CardTitle>
            <CardDescription>
              {isBusinessOwner 
                ? "Add staff members to your business to see them here" 
                : "You don't have any staff contacts yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-6">
              <Users className="h-16 w-16 text-blue-300" />
            </div>
            {isBusinessOwner && (
              <div className="flex justify-center mt-4">
                <Button onClick={() => window.location.href = '/dashboard/staff'}>
                  Manage Staff
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStaffCommunication;

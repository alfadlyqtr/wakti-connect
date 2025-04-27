import React, { useState, useEffect } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserSearch, UserPlus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import ContactsList from "@/components/contacts/ContactsList";
import PendingRequestsList from "@/components/contacts/PendingRequestsList";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import AutoApproveToggle from "@/components/contacts/AutoApproveToggle";
import StaffSyncSection from "@/components/contacts/StaffSyncSection";
import ContactsStaffRestriction from "@/components/contacts/ContactsStaffRestriction";
import { supabase } from "@/integrations/supabase/client";
import { getStaffBusinessId } from "@/utils/staffUtils";
import PendingRequestsTabs from "@/components/contacts/PendingRequestsTabs";
import { UserContact } from "@/types/invitation.types";

const DashboardContacts = () => {
  const { 
    contacts, 
    isLoading, 
    pendingRequests, 
    isLoadingRequests,
    autoApprove,
    isUpdatingAutoApprove,
    isSyncingContacts,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    refreshContacts
  } = useContacts();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Check if user is a business owner
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('account_type, business_name')
          .eq('id', data.session.user.id)
          .single();
          
        if (!error && profile) {
          setIsBusiness(profile.account_type === 'business');
        }
        
        // Check if user is a staff member
        const staffBizId = await getStaffBusinessId();
        if (staffBizId) {
          setIsStaff(true);
          setBusinessId(staffBizId);
          
          // Get business name
          const { data: bizData } = await supabase
            .from('profiles')
            .select('business_name, full_name')
            .eq('id', staffBizId)
            .single();
            
          if (bizData) {
            setBusinessName(bizData.business_name || bizData.full_name || "your business");
          }
        }
      }
    };
    
    checkUserType();
  }, []);

  const handleAddContact = async (contactId: string) => {
    if (!contactId.trim()) {
      return;
    }
    
    try {
      await sendContactRequest.mutateAsync(contactId);
      setIsAddContactOpen(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    try {
      await respondToContactRequest.mutateAsync({ requestId, accept });
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact.mutateAsync(contactId);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const filteredContacts = searchQuery && contacts 
    ? contacts.filter(contact => {
        const displayName = contact.contactProfile?.displayName || contact.contactProfile?.fullName || '';
        const businessName = contact.contactProfile?.businessName || '';
        const email = contact.contactProfile?.email || '';
        
        return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : contacts;

  if (isStaff) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Staff Communications</h1>
          <p className="text-muted-foreground">
            As a staff member, you can communicate with your business and other staff
          </p>
        </div>
        
        <ContactsStaffRestriction 
          businessId={businessId || undefined}
          businessName={businessName || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your personal contacts network
        </p>
      </div>
      
      {isBusiness && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Staff Communication</CardTitle>
            <CardDescription>
              Staff communication is managed separately under the Staff Communication page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/dashboard/staff-communication'}
            >
              Go to Staff Communications
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto items-center space-x-4">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setIsAddContactOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshContacts}
            disabled={isSyncingContacts}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingContacts ? 'animate-spin' : ''}`} />
            {isSyncingContacts ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <AutoApproveToggle 
            autoApprove={autoApprove}
            isUpdating={isUpdatingAutoApprove}
            onToggle={handleToggleAutoApprove}
          />
        </div>
      </div>
      
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="requests">
            Pending Requests
            {((pendingRequests.incoming.length + pendingRequests.outgoing.length) > 0) && (
              <Badge variant="secondary" className="ml-2">
                {pendingRequests.incoming.length + pendingRequests.outgoing.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>View and manage your contacts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsList 
                contacts={filteredContacts || []} 
                isLoading={isLoading}
                isSyncing={false}
                onDeleteContact={handleDeleteContact}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and respond to contact requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingRequestsTabs
                incomingRequests={pendingRequests.incoming}
                outgoingRequests={pendingRequests.outgoing as UserContact[]}
                isLoading={isLoadingRequests}
                onRespondToRequest={handleRespondToRequest}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddContactDialog
        isOpen={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onAddContact={handleAddContact}
      />
    </div>
  );
};

export default DashboardContacts;


import React, { useState, useEffect } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserSearch, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

// Import the components
import ContactsList from "@/components/contacts/ContactsList";
import PendingRequestsList from "@/components/contacts/PendingRequestsList";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import AutoApproveToggle from "@/components/contacts/AutoApproveToggle";
import StaffSyncSection from "@/components/contacts/StaffSyncSection";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const checkUserType = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', data.session.user.id)
          .single();
          
        if (!error && profile) {
          setIsBusiness(profile.account_type === 'business');
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

  // Filter contacts by search query if provided
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your contacts and network.
        </p>
      </div>
      
      <StaffSyncSection 
        isBusiness={isBusiness} 
        onContactsRefresh={refreshContacts} 
      />
      
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
        
        <AutoApproveToggle 
          autoApprove={autoApprove}
          isUpdating={isUpdatingAutoApprove}
          onToggle={handleToggleAutoApprove}
        />
      </div>
      
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="requests">
            Pending Requests
            {pendingRequests && pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
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
                isSyncing={isSyncingContacts}
                onRefresh={refreshContacts}
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
              <PendingRequestsList 
                pendingRequests={pendingRequests || []} 
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

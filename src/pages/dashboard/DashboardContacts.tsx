
import React, { useState, useEffect } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserSearch, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateAutoApproveContacts } from "@/services/contacts/contactsService";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import the newly created components
import ContactsList from "@/components/contacts/ContactsList";
import PendingRequestsList from "@/components/contacts/PendingRequestsList";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import AutoApproveToggle from "@/components/contacts/AutoApproveToggle";

const DashboardContacts = () => {
  const { 
    contacts, 
    isLoading, 
    pendingRequests, 
    isLoadingRequests,
    sendContactRequest,
    respondToContactRequest
  } = useContacts();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [autoApprove, setAutoApprove] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState(false);

  // Fetch user's auto-approve setting
  useEffect(() => {
    const fetchAutoApproveSetting = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('auto_approve_contacts')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setAutoApprove(!!data.auto_approve_contacts);
          }
        }
      } catch (error) {
        console.error("Error fetching auto-approve setting:", error);
      }
    };
    
    fetchAutoApproveSetting();
  }, []);

  const handleAddContact = async (contactId: string) => {
    if (!contactId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive"
      });
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

  const handleToggleAutoApprove = async () => {
    setIsUpdatingAutoApprove(true);
    try {
      const success = await updateAutoApproveContacts(!autoApprove);
      
      if (success) {
        setAutoApprove(!autoApprove);
        toast({
          title: "Setting Updated",
          description: !autoApprove 
            ? "Contact requests will now be automatically approved" 
            : "Contact requests will now require manual approval"
        });
      }
    } catch (error) {
      console.error("Error updating auto-approve setting:", error);
      toast({
        title: "Update Failed",
        description: "Could not update auto-approve setting",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAutoApprove(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your contacts and network.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
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
                contacts={contacts || []} 
                isLoading={isLoading} 
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

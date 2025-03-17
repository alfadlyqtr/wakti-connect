
import React, { useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserSearch, Users, CheckCircle, XCircle, UserPlus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserContact } from "@/types/invitation.types";
import { updateAutoApproveContacts } from "@/services/contacts/contactsService";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [newContactId, setNewContactId] = useState("");
  const [autoApprove, setAutoApprove] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isUpdatingAutoApprove, setIsUpdatingAutoApprove] = useState(false);

  // Fetch user's auto-approve setting
  React.useEffect(() => {
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

  const handleAddContact = async () => {
    if (!newContactId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await sendContactRequest.mutateAsync(newContactId);
      setNewContactId("");
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

  const renderContactList = (contactList: UserContact[]) => {
    if (contactList.length === 0) {
      return (
        <div className="py-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No contacts found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {contactList.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
                <AvatarFallback>
                  {contact.contactProfile?.displayName?.charAt(0) || 
                   contact.contactProfile?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {contact.contactProfile?.displayName || 
                   contact.contactProfile?.fullName || 'Unknown User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contact.contactId}
                </p>
              </div>
            </div>
            <Badge>{contact.status}</Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderPendingRequests = () => {
    if (!pendingRequests || pendingRequests.length === 0) {
      return (
        <div className="py-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No pending requests</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={request.contactProfile?.avatarUrl || ''} />
                <AvatarFallback>
                  {request.contactProfile?.displayName?.charAt(0) || 
                   request.contactProfile?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {request.contactProfile?.displayName || 
                   request.contactProfile?.fullName || 'Unknown User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.userId}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRespondToRequest(request.id, true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRespondToRequest(request.id, false)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
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
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="auto-approve" 
            checked={autoApprove} 
            onCheckedChange={handleToggleAutoApprove}
            disabled={isUpdatingAutoApprove}
          />
          <Label htmlFor="auto-approve">Auto-approve contact requests</Label>
        </div>
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
              {isLoading ? (
                <div className="py-10 text-center">
                  <p>Loading contacts...</p>
                </div>
              ) : (
                renderContactList(contacts || [])
              )}
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
              {isLoadingRequests ? (
                <div className="py-10 text-center">
                  <p>Loading requests...</p>
                </div>
              ) : (
                renderPendingRequests()
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter the user ID of the person you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-id">User ID</Label>
              <Input
                id="contact-id"
                placeholder="Enter user ID"
                value={newContactId}
                onChange={(e) => setNewContactId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardContacts;

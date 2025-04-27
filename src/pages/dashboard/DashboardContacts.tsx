
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Info, MailPlus, Plus, RefreshCcw, UserPlus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ContactsList from "@/components/contacts/ContactsList";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import PendingRequestsTabs from "@/components/contacts/PendingRequestsTabs";
import StaffSyncSection from "@/components/contacts/StaffSyncSection";
import { useContacts } from "@/hooks/useContacts";
import { UserContact } from "@/types/invitation.types";
import MessageComposerDialog from "@/components/messages/MessageComposerDialog";

const DashboardContacts: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [selectedMessageContact, setSelectedMessageContact] = useState<UserContact | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const {
    contacts,
    staffContacts,
    pendingRequests,
    autoApprove,
    autoAddStaff,
    isLoading,
    isLoadingRequests,
    isLoadingStaffContacts,
    isUpdatingAutoApprove,
    isUpdatingAutoAddStaff,
    isSyncingContacts,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    handleToggleAutoAddStaff,
    refreshContacts
  } = useContacts();

  // Handle adding a contact
  const handleAddContact = async (contactId: string) => {
    await sendContactRequest.mutateAsync(contactId);
  };

  // Handle responding to contact requests
  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    await respondToContactRequest.mutateAsync({ requestId, accept });
  };

  // Handle deleting a contact
  const handleDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteConfirmOpen(true);
  };

  // Confirm contact deletion
  const confirmDeleteContact = async () => {
    if (contactToDelete) {
      try {
        await deleteContact.mutateAsync(contactToDelete);
        toast({
          title: "Contact deleted",
          description: "The contact has been removed successfully."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete contact. Please try again.",
          variant: "destructive",
        });
      } finally {
        setContactToDelete(null);
        setDeleteConfirmOpen(false);
      }
    }
  };

  // Handle opening the message composer dialog
  const handleOpenMessageDialog = (contact: UserContact) => {
    setSelectedMessageContact(contact);
    setIsMessageDialogOpen(true);
  };

  // Determine if the user has a business account
  const isBusiness = contacts?.some(contact => 
    contact.contactProfile?.accountType === 'business'
  ) || false;

  return (
    <div className="flex flex-col w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage your network and contacts.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshContacts}
            disabled={isSyncingContacts}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isSyncingContacts ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Staff contacts sync section (only shown for business accounts) */}
      <StaffSyncSection 
        isBusiness={isBusiness} 
        onContactsRefresh={refreshContacts} 
      />
      
      {/* Auto-approve settings section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailPlus className="h-5 w-5" />
            Contact Settings
          </CardTitle>
          <CardDescription>
            Configure how you handle contact requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Contact Management</AlertTitle>
            <AlertDescription>
              Configure settings for how contact requests are handled.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
            <div className="flex flex-1 items-center space-x-2">
              <Label htmlFor="auto-approve" className="text-sm font-medium">
                Auto-approve contact requests
              </Label>
            </div>
            <Switch
              id="auto-approve"
              checked={autoApprove}
              onCheckedChange={handleToggleAutoApprove}
              disabled={isUpdatingAutoApprove}
            />
          </div>
          
          {staffContacts && staffContacts.length > 0 && (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
              <div className="flex flex-1 items-center space-x-2">
                <Label htmlFor="auto-add-staff" className="text-sm font-medium">
                  Auto-add staff to contacts
                </Label>
              </div>
              <Switch
                id="auto-add-staff"
                checked={autoAddStaff}
                onCheckedChange={handleToggleAutoAddStaff}
                disabled={isUpdatingAutoAddStaff}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Main content tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <ContactsList
            contacts={contacts || []}
            isLoading={isLoading}
            showChat={true}
            onDeleteContact={handleDeleteContact}
            onMessageContact={handleOpenMessageDialog}
          />
        </TabsContent>
        
        <TabsContent value="staff" className="mt-4">
          <ContactsList
            contacts={staffContacts || []}
            isLoading={isLoadingStaffContacts}
            isSyncing={isSyncingContacts}
            showChat={true}
            onMessageContact={handleOpenMessageDialog}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <PendingRequestsTabs
            incomingRequests={pendingRequests?.incoming || []}
            outgoingRequests={pendingRequests?.outgoing || []}
            isLoading={isLoadingRequests}
            onRespondToRequest={handleRespondToRequest}
          />
        </TabsContent>
      </Tabs>
      
      {/* Add contact dialog */}
      <AddContactDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddContact={handleAddContact}
      />
      
      {/* Message composer dialog */}
      <MessageComposerDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        contact={selectedMessageContact}
      />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this contact? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteContact}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardContacts;

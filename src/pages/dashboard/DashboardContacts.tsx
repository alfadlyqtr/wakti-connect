
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactsList from "@/components/contacts/ContactsList";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { UserContact } from "@/types/invitation.types";
import MessageComposerDialog from "@/components/messages/MessageComposerDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const DashboardContacts = () => {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<UserContact | null>(null);

  const {
    contacts = [],
    staffContacts = [],
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
    refreshContacts,
  } = useContacts();

  const handleAddContact = async (contactId: string) => {
    try {
      await sendContactRequest.mutateAsync(contactId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    setDeleteContactId(contactId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!deleteContactId) return;
    await deleteContact.mutateAsync(deleteContactId);
    setIsDeleteDialogOpen(false);
    setDeleteContactId(null);
  };

  const handleMessageContact = (contact: UserContact) => {
    setSelectedContact(contact);
    setIsMessageDialogOpen(true);
  };

  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    try {
      await respondToContactRequest.mutateAsync({ requestId, accept });
    } catch (error) {
      console.error("Error responding to contact request:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshContacts()}
            disabled={isSyncingContacts}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            {isSyncingContacts ? "Syncing..." : "Sync"}
          </Button>
          <Button size="sm" onClick={() => setIsAddContactDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="mb-4">
          <TabsTrigger value="contacts">My Contacts</TabsTrigger>
          <TabsTrigger value="staff">
            Staff Contacts {staffContacts.length > 0 && `(${staffContacts.length})`}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {pendingRequests.incoming.length > 0 &&
              ` (${pendingRequests.incoming.length})`}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <div className="bg-white rounded-lg shadow p-6">
            <ContactsList
              contacts={contacts}
              isLoading={isLoading}
              isSyncing={isSyncingContacts}
              onDeleteContact={handleDeleteContact}
              onMessageContact={handleMessageContact}
            />
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <div className="bg-white rounded-lg shadow p-6">
            <ContactsList
              contacts={staffContacts}
              isLoading={isLoadingStaffContacts}
              isSyncing={isSyncingContacts}
              showChat={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Incoming requests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Incoming Requests</h2>
              {isLoadingRequests ? (
                <p>Loading requests...</p>
              ) : pendingRequests.incoming.length === 0 ? (
                <p className="text-muted-foreground">No incoming requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.incoming.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={request.contactProfile?.avatarUrl || ""}
                          />
                          <AvatarFallback>
                            {(
                              request.contactProfile?.displayName ||
                              request.contactProfile?.fullName ||
                              "U"
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.contactProfile?.displayName ||
                              request.contactProfile?.fullName ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.contactProfile?.email ||
                              request.contact_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-100"
                          onClick={() =>
                            handleRespondToRequest(request.id, true)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-100"
                          onClick={() =>
                            handleRespondToRequest(request.id, false)
                          }
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing requests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Outgoing Requests</h2>
              {isLoadingRequests ? (
                <p>Loading requests...</p>
              ) : pendingRequests.outgoing.length === 0 ? (
                <p className="text-muted-foreground">No outgoing requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.outgoing.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={request.contactProfile?.avatarUrl || ""}
                          />
                          <AvatarFallback>
                            {(
                              request.contactProfile?.displayName ||
                              request.contactProfile?.fullName ||
                              "U"
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.contactProfile?.displayName ||
                              request.contactProfile?.fullName ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.contactProfile?.email ||
                              request.contact_id}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Pending approval
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertTitle>Contact Settings</AlertTitle>
                <AlertDescription>
                  Configure how your contacts system works
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-approve" className="font-medium">
                    Auto-approve contact requests
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve all incoming contact requests
                  </p>
                </div>
                <Switch
                  id="auto-approve"
                  checked={autoApprove}
                  onCheckedChange={handleToggleAutoApprove}
                  disabled={isUpdatingAutoApprove}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-add-staff" className="font-medium">
                    Auto-add business staff contacts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically add staff members as contacts when they join
                    your business
                  </p>
                </div>
                <Switch
                  id="auto-add-staff"
                  checked={autoAddStaff}
                  onCheckedChange={handleToggleAutoAddStaff}
                  disabled={isUpdatingAutoAddStaff}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Contact Dialog */}
      <AddContactDialog
        isOpen={isAddContactDialogOpen}
        onOpenChange={setIsAddContactDialogOpen}
        onAddContact={handleAddContact}
      />

      {/* Message Dialog */}
      <MessageComposerDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        contact={selectedContact}
      />

      {/* Delete Contact Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this contact? They will need to send you a new contact request to reconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteContact}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardContacts;

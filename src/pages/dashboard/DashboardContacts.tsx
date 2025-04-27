import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, RefreshCw, MessageSquare, X, Trash2, Info as InfoIcon } from "lucide-react";
import ContactsList from "@/components/contacts/ContactsList";
import { useContacts } from "@/hooks/useContacts";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import PendingRequestsList from "@/components/contacts/PendingRequestsList";
import PendingRequestsTabs from "@/components/contacts/PendingRequestsTabs";
import StaffSyncSection from "@/components/contacts/StaffSyncSection";
import { UserContact, ContactRequestStatus } from '@/types/invitation.types';
import MessageComposerDialog from "@/components/messages/MessageComposerDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

interface ContactListProps {
  contacts: UserContact[];
  isLoading: boolean;
  isSyncing?: boolean;
  showChat?: boolean;
  onDeleteContact?: (contactId: string) => void;
  onMessageContact?: (contact: UserContact) => void;
}

const DashboardContacts = () => {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<UserContact | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    contacts = [],
    staffContacts = [],
    pendingRequests,
    autoApprove,
    autoAddStaff,
    isLoading,
    isLoadingRequests,
    isLoadingStaffContacts,
    isSyncingContacts,
    sendContactRequest,
    respondToContactRequest,
    deleteContact,
    handleToggleAutoApprove,
    handleToggleAutoAddStaff,
    refreshContacts
  } = useContacts();

  const handleOpenMessageDialog = (contact: UserContact) => {
    setSelectedContact(contact);
    setIsMessageDialogOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (contactToDelete) {
      await deleteContact.mutateAsync(contactToDelete);
      setIsDeleteConfirmOpen(false);
      setContactToDelete(null);
    }
  };

  // Determine if there are any pending requests
  const hasPendingRequests = pendingRequests && 
    (pendingRequests.incoming.length > 0 || pendingRequests.outgoing.length > 0);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => refreshContacts()}
            disabled={isSyncingContacts}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {isSyncingContacts ? "Syncing..." : "Sync"}
          </Button>
          <Button size="sm" onClick={() => setIsAddContactDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          {hasPendingRequests && (
            <TabsTrigger value="pending" className="relative">
              Pending
              {hasPendingRequests && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingRequests.incoming.length + pendingRequests.outgoing.length}
                </span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Contacts</CardTitle>
              <CardDescription>
                View and manage all your contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsList
                contacts={[...contacts, ...staffContacts]}
                isLoading={isLoading || isLoadingStaffContacts}
                isSyncing={isSyncingContacts}
                showChat={true}
                onDeleteContact={handleDeleteContact}
                onMessageContact={handleOpenMessageDialog}
              />
            </CardContent>
          </Card>

          <StaffSyncSection 
            autoAddStaff={autoAddStaff}
            isUpdating={false}
            onToggleAutoAddStaff={handleToggleAutoAddStaff}
          />

          <Card>
            <CardHeader>
              <CardTitle>Auto-approve settings</CardTitle>
              <CardDescription>
                Configure how contact requests are handled.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="info" className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Contact approval settings</AlertTitle>
                <AlertDescription>
                  When auto-approve is enabled, all contact requests will be automatically accepted.
                </AlertDescription>
              </Alert>

              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-approve">
                  Auto-approve contact requests
                </Label>
                <Switch
                  id="auto-approve"
                  checked={autoApprove}
                  onCheckedChange={handleToggleAutoApprove}
                />
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Label htmlFor="auto-add-staff">
                  Auto-add staff as contacts
                </Label>
                <Switch
                  id="auto-add-staff"
                  checked={autoAddStaff}
                  onCheckedChange={handleToggleAutoAddStaff}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Contacts</CardTitle>
              <CardDescription>
                Your business staff contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsList
                contacts={staffContacts}
                isLoading={isLoadingStaffContacts}
                showChat={true}
                onMessageContact={handleOpenMessageDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Contacts</CardTitle>
              <CardDescription>
                Your business contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsList
                contacts={contacts.filter(c => c.contactProfile?.accountType === 'business')}
                isLoading={isLoading}
                showChat={true}
                onDeleteContact={handleDeleteContact}
                onMessageContact={handleOpenMessageDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Contacts</CardTitle>
              <CardDescription>
                Your individual contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsList
                contacts={contacts.filter(c => c.contactProfile?.accountType !== 'business')}
                isLoading={isLoading}
                showChat={true}
                onDeleteContact={handleDeleteContact}
                onMessageContact={handleOpenMessageDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <PendingRequestsTabs
            pendingRequests={pendingRequests}
            isLoading={isLoadingRequests}
            onAccept={(requestId) => respondToContactRequest.mutate({ requestId, accept: true })}
            onReject={(requestId) => respondToContactRequest.mutate({ requestId, accept: false })}
          />
        </TabsContent>
      </Tabs>

      <AddContactDialog
        isOpen={isAddContactDialogOpen}
        onOpenChange={setIsAddContactDialogOpen}
        onAddContact={sendContactRequest.mutateAsync}
      />

      <MessageComposerDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        contact={selectedContact}
      />

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
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
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteContact}
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

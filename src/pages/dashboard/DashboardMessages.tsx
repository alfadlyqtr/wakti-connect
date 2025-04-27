
import React, { useState } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import ConversationsList from "@/components/messages/ConversationsList";
import MessageComposerDialog from "@/components/messages/MessageComposerDialog";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, UserPlus, StaffStack } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContact } from "@/types/invitation.types";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import { useContacts } from "@/hooks/useContacts";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardMessages: React.FC = () => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<UserContact | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [conversationFilter, setConversationFilter] = useState<'all' | 'staff'>('all');
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const { 
    conversations, 
    isLoadingConversations, 
    refetchConversations,
    unreadCount 
  } = useMessaging({ staffOnly: conversationFilter === 'staff' });
  
  const { sendContactRequest } = useContacts();
  
  const handleOpenComposer = (contact: UserContact) => {
    setSelectedContact(contact);
    setIsComposerOpen(true);
  };

  const handleRefreshConversations = () => {
    refetchConversations();
    toast({
      title: "Refreshed",
      description: "Your conversations have been updated",
    });
  };

  const handleAddContact = async (contactId: string) => {
    try {
      await sendContactRequest.mutateAsync(contactId);
      toast({
        title: "Contact request sent",
        description: "The user will be notified of your request",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error sending contact request:", error);
      toast({
        title: "Error",
        description: "Failed to send contact request",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const showConversationsList = !userId || !isMobile;

  return (
    <div className="flex h-full">
      {showConversationsList && (
        <div className={`border-r flex flex-col ${isMobile || userId ? 'w-full' : 'w-1/3'}`}>
          <div className="p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshConversations}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddContactOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/contacts')} 
                variant="outline" 
                size="sm" 
                title="Manage Contacts"
              >
                <StaffStack className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={conversationFilter} 
            onValueChange={(value) => setConversationFilter(value as 'all' | 'staff')}
            className="w-full"
          >
            <div className="px-3 pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All Conversations</TabsTrigger>
                <TabsTrigger value="staff" className="flex-1">Staff Only</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0 flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="p-3 space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ConversationsList />
              )}
            </TabsContent>
            
            <TabsContent value="staff" className="m-0 flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="p-3 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ConversationsList staffOnly />
              )}
            </TabsContent>
          </Tabs>
          
          <div className="p-3 border-t mt-auto">
            <Button 
              onClick={() => setIsComposerOpen(true)} 
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> New Message
            </Button>
          </div>
        </div>
      )}
      
      {(!isMobile || (isMobile && userId)) && (
        <div className="flex-1 flex flex-col h-full">
          {!userId && !isMobile ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground mb-4">Choose a conversation from the list or start a new one</p>
              <Button onClick={() => setIsComposerOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Message
              </Button>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      )}
      
      <MessageComposerDialog 
        isOpen={isComposerOpen} 
        onOpenChange={setIsComposerOpen}
        contact={selectedContact}
      />
      
      <AddContactDialog
        isOpen={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        onAddContact={handleAddContact}
      />
    </div>
  );
};

export default DashboardMessages;

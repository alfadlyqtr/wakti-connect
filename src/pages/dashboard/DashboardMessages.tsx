
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, Inbox, Users, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ConversationsList from "@/components/messages/ConversationsList";
import ChatInterface from "@/components/messages/ChatInterface";
import EmptyMessagesState from "@/components/messages/EmptyMessagesState";
import { useMessaging } from "@/hooks/useMessaging";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContactSubmissions from "@/components/messages/ContactSubmissions";
import { useContactSubmissionsQuery } from "@/hooks/business-page/useContactSubmissionsQuery";
import { getStaffBusinessId } from "@/utils/staffUtils";
import ContactsStaffRestriction from "@/components/contacts/ContactsStaffRestriction";
import StaffCommunicationTab from "@/components/messages/StaffCommunicationTab";

const DashboardMessagesHome = () => {
  const navigate = useNavigate();
  const { conversations } = useMessaging({});
  const [activeTab, setActiveTab] = useState<string>("messages");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const { data: userProfile } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      setCurrentUserId(session.user.id);
      
      if (localStorage.getItem('userRole') === 'staff') {
        setIsStaff(true);
        const bizId = await getStaffBusinessId();
        setBusinessId(bizId);
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      return data;
    },
  });
  
  const { data: contactSubmissions = [], isLoading: submissionsLoading } = useContactSubmissionsQuery(currentUserId);
  
  const canSendMessages = userProfile?.account_type !== 'free';
  const isBusinessAccount = userProfile?.account_type === 'business';
  
  useEffect(() => {
    if (isStaff) {
      const syncContacts = async () => {
        const { forceSyncStaffContacts } = await import('@/services/contacts/contactSync');
        await forceSyncStaffContacts();
      };
      
      syncContacts();
    }
  }, [isStaff]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            {isStaff 
              ? "Connect with your business owner and other staff members."
              : canSendMessages 
                ? "Connect with others through messaging. Messages expire after 24 hours."
                : "Free accounts cannot send messages. Upgrade to start messaging."}
          </p>
        </div>
        
        {canSendMessages && !isStaff && (
          <Button 
            onClick={() => navigate('/dashboard/contacts')}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Message</span>
          </Button>
        )}
      </div>
      
      {isStaff && (
        <ContactsStaffRestriction businessId={businessId || undefined} />
      )}
      
      {isBusinessAccount && (
        <Tabs 
          defaultValue="messages" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4 relative">
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-1 px-1 md:px-2 text-xs md:text-sm overflow-hidden"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Messages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="staff" 
              className="flex items-center gap-1 px-1 md:px-2 text-xs md:text-sm overflow-hidden"
            >
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Staff Communication</span>
            </TabsTrigger>
            <TabsTrigger 
              value="submissions" 
              className="flex items-center gap-1 px-1 md:px-2 text-xs md:text-sm overflow-hidden"
            >
              <Inbox className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Contact Submissions</span>
              {contactSubmissions.filter(s => !s.is_read).length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] md:text-xs text-white min-w-[18px] text-center">
                  {contactSubmissions.filter(s => !s.is_read).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
            <div className="grid h-[calc(100vh-300px)] grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="border-r md:col-span-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">Conversations</h2>
                  {isStaff && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      Staff Chat
                    </div>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {conversations && conversations.length > 0 ? (
                    <ConversationsList />
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground text-sm">No conversations yet</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2 overflow-hidden flex flex-col">
                {conversations && conversations.length > 0 ? (
                  <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                    <p>Select a conversation to view messages</p>
                  </div>
                ) : (
                  <EmptyMessagesState 
                    canSendMessages={canSendMessages} 
                    userType={userProfile?.account_type || 'free'}
                    isStaff={isStaff}
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="staff" className="mt-0">
            <StaffCommunicationTab businessId={currentUserId} />
          </TabsContent>
          
          <TabsContent value="submissions" className="mt-0">
            <ContactSubmissions 
              submissions={contactSubmissions} 
              isLoading={submissionsLoading} 
            />
          </TabsContent>
        </Tabs>
      )}
      
      {!isBusinessAccount && (
        <div className="grid h-[calc(100vh-220px)] grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="border-r md:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Conversations</h2>
              {isStaff && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  Staff Chat
                </div>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations && conversations.length > 0 ? (
                <ConversationsList />
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 overflow-hidden flex flex-col">
            {conversations && conversations.length > 0 ? (
              <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                <p>Select a conversation to view messages</p>
              </div>
            ) : (
              <EmptyMessagesState 
                canSendMessages={canSendMessages} 
                userType={userProfile?.account_type || 'free'}
                isStaff={isStaff}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardMessageChat = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isStaff, setIsStaff] = useState(false);
  const { conversations } = useMessaging({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkStaffStatus = async () => {
      const staffRole = localStorage.getItem('userRole') === 'staff';
      setIsStaff(staffRole);
    };
    checkStaffStatus();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            {isStaff 
              ? "Staff messaging with your business owner and team" 
              : "Messages expire after 24 hours."}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/messages')}
          className="md:hidden"
        >
          Back to Conversations
        </Button>
      </div>
      
      <div className="grid h-[calc(100vh-220px)] grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="hidden md:flex border-r md:col-span-1 overflow-hidden flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">Conversations</h2>
            {isStaff && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                Staff Chat
              </div>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            <ConversationsList />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 overflow-hidden flex flex-col">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

const DashboardMessages = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  
  const isAtChatRoute = location.pathname.match(/\/dashboard\/messages\/[^\/]+$/);
  
  if (isAtChatRoute && userId) {
    return <DashboardMessageChat />;
  }
  
  return <DashboardMessagesHome />;
};

export default DashboardMessages;

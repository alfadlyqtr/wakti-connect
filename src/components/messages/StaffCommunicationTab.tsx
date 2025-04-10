
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MessageComposerDialog from "./chat/MessageComposerDialog";
import MessageList from "./chat/MessageList";
import { getMessages } from "@/services/messages";

interface StaffCommunicationTabProps {
  businessId?: string | null;
}

interface StaffMember {
  id: string;
  staff_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  status: string;
}

const StaffCommunicationTab: React.FC<StaffCommunicationTabProps> = ({ businessId }) => {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedMessageForReply, setSelectedMessageForReply] = useState<any | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  
  // Fetch the current user ID
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Fetch all messages for the staff
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['staffMessages'],
    queryFn: async () => {
      // Get all messages without filtering by conversation
      const allMessages = await getMessages();
      
      // Sort messages by date (newest first)
      return allMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });
  
  const { data: staffMembers, isLoading: isLoadingStaff, error: staffError } = useQuery({
    queryKey: ['businessStaff', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      // First fetch staff records, ensuring we only get active staff
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select(`
          id,
          staff_id,
          name,
          email,
          role,
          status,
          profile_image_url
        `)
        .eq('business_id', businessId)
        .eq('status', 'active');
        
      if (staffError) {
        console.error("Error fetching staff members:", staffError);
        throw staffError;
      }

      // For each staff member, get their profile data to access avatar_url
      const staffWithProfiles = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', staff.staff_id)
            .maybeSingle();
            
          return {
            ...staff,
            avatar_url: profileData?.avatar_url || staff.profile_image_url || null
          };
        })
      );
      
      return staffWithProfiles as StaffMember[];
    },
    enabled: !!businessId
  });
  
  const handleMessageSent = () => {
    // Refresh messages after sending
    setTimeout(() => {
      refetchMessages();
    }, 500);
    setIsReplyDialogOpen(false);
  };
  
  const handleReplyClick = (message: any) => {
    // Determine the recipient based on the sender of the original message
    const recipientId = message.senderId === currentUserId 
      ? message.recipientId 
      : message.senderId;
      
    const recipientName = message.senderId === currentUserId
      ? message.recipientName
      : message.senderName;
    
    // Store the message info and open the dialog
    setSelectedMessageForReply({
      recipientId,
      recipientName,
      message
    });
    setIsReplyDialogOpen(true);
  };
  
  if (messagesError) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Failed to load messages. Please try again.</p>
            <Button onClick={() => refetchMessages()} className="mt-4" variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Communication
          </h2>
          <p className="text-muted-foreground">
            Message your team members directly
          </p>
        </div>
      </div>
      
      {/* Messages Inbox */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Messages Inbox</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetchMessages()}
              title="Refresh messages"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoadingMessages ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-md animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Messages from your business owner or other staff will appear here</p>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              currentUserId={currentUserId || undefined} 
              onReplyClick={handleReplyClick}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Staff Cards Section */}
      <h3 className="font-medium text-lg mt-8">Message Staff Members</h3>
      {isLoadingStaff ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : staffError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="font-medium text-lg">Error Loading Staff</h3>
              <p className="text-muted-foreground">
                There was an error loading your staff members.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : staffMembers && staffMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((staff) => (
            <Card 
              key={staff.id} 
              className="overflow-hidden hover:bg-accent/5 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
                    {staff.avatar_url ? (
                      <img 
                        src={staff.avatar_url} 
                        alt={staff.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      staff.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{staff.name || 'Staff Member'}</h3>
                    <p className="text-sm text-muted-foreground truncate">{staff.role || 'Staff'}</p>
                  </div>
                  <MessageComposerDialog
                    recipientId={staff.staff_id}
                    recipientName={staff.name}
                    recipientAvatar={staff.avatar_url || undefined}
                    onMessageSent={handleMessageSent}
                    triggerElement={
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Message</span>
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="font-medium text-lg">No Staff Members</h3>
              <p className="text-muted-foreground">
                You don't have any staff members yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Reply Dialog - Only render when needed */}
      {selectedMessageForReply && (
        <MessageComposerDialog
          key={`reply-${selectedMessageForReply.recipientId}`}
          recipientId={selectedMessageForReply.recipientId}
          recipientName={selectedMessageForReply.recipientName}
          open={isReplyDialogOpen}
          onOpenChange={setIsReplyDialogOpen}
          onMessageSent={handleMessageSent}
        />
      )}
    </div>
  );
};

export default StaffCommunicationTab;


import React, { useEffect, useState } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";

interface EmptyMessagesStateProps {
  canSendMessages: boolean;
  userType: string;
  isStaff?: boolean;
}

const EmptyMessagesState: React.FC<EmptyMessagesStateProps> = ({ 
  canSendMessages, 
  userType,
  isStaff = false
}) => {
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  // For staff, get the business owner ID
  useEffect(() => {
    const fetchBusinessOwner = async () => {
      if (isStaff) {
        try {
          const bizId = await getStaffBusinessId();
          setBusinessId(bizId);
          
          if (bizId) {
            // Get business name
            const { data: bizData } = await supabase
              .from('profiles')
              .select('business_name, full_name')
              .eq('id', bizId)
              .single();
              
            setBusinessName(bizData?.business_name || bizData?.full_name || "your business owner");
          }
        } catch (error) {
          console.error("Error fetching business owner:", error);
        }
      }
    };
    
    fetchBusinessOwner();
  }, [isStaff]);

  if (isStaff) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Staff Messaging System</h2>
        <p className="max-w-md mb-6 text-muted-foreground">
          As a staff member, you can message your business owner and other staff members.
          Start a conversation by selecting a contact from the sidebar.
        </p>
        {businessId && (
          <Button 
            onClick={() => navigate(`/dashboard/messages/${businessId}`)}
            className="min-w-[200px]"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message {businessName || "Business Owner"}
          </Button>
        )}
      </div>
    );
  }

  if (!canSendMessages) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Messaging Not Available</h2>
        <p className="max-w-md mb-6 text-muted-foreground">
          Free accounts cannot send messages. Upgrade to an Individual or Business account to start messaging.
        </p>
        <Button 
          onClick={() => navigate('/dashboard/settings/subscription')} 
          variant="default"
          className="min-w-[200px]"
        >
          Upgrade Account
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2">No Messages Yet</h2>
      <p className="max-w-md mb-6 text-muted-foreground">
        Start a conversation by adding contacts and sending them a message.
        All messages expire after 24 hours.
      </p>
      <Button 
        onClick={() => navigate('/dashboard/contacts')}
        className="min-w-[200px]"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Manage Contacts
      </Button>
    </div>
  );
};

export default EmptyMessagesState;

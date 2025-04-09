import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";
import { forceSyncStaffContacts } from "@/services/contacts/contactSync";
import { toast } from "@/components/ui/use-toast";

interface ContactsStaffRestrictionProps {
  businessId?: string;
  businessName?: string;
}

const ContactsStaffRestriction: React.FC<ContactsStaffRestrictionProps> = ({ 
  businessId: propBusinessId,
  businessName: propBusinessName 
}) => {
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(propBusinessId || null);
  const [businessName, setBusinessName] = useState<string>(propBusinessName || "your business");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        if (!propBusinessId) {
          const businessId = await getStaffBusinessId();
          setBusinessId(businessId);
          
          if (businessId) {
            const { data } = await supabase
              .from('profiles')
              .select('business_name, full_name')
              .eq('id', businessId)
              .single();
              
            if (data?.business_name || data?.full_name) {
              setBusinessName(data.business_name || data.full_name || "your business");
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch business details:", error);
      }
    };
    
    fetchBusinessId();
  }, [propBusinessId]);

  const handleSyncContacts = async () => {
    setIsSyncing(true);
    try {
      const result = await forceSyncStaffContacts();
      if (result.success) {
        toast({
          title: "Contacts Synced",
          description: "Your staff contacts have been refreshed.",
        });
      } else {
        toast({
          title: "Sync Failed",
          description: result.message || "Could not sync staff contacts.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing contacts:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col items-center text-center gap-2">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h3 className="text-xl font-semibold">Staff Messaging System</h3>
          
          <p className="text-muted-foreground max-w-md">
            As a staff member, you can only message 
            {businessName !== "your business" ? ` ${businessName}` : " your business"} and 
            other staff members if you have permission.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            
            {businessId && (
              <Button 
                onClick={() => navigate(`/dashboard/messages/${businessId}`)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message Business Owner
              </Button>
            )}
            
            <Button 
              variant="secondary"
              onClick={handleSyncContacts}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Refresh Staff Contacts'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsStaffRestriction;

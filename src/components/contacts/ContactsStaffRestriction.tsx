
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { supabase } from "@/integrations/supabase/client";

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

  // Fetch business ID if not provided
  useEffect(() => {
    if (!propBusinessId) {
      const fetchBusinessId = async () => {
        try {
          const businessId = await getStaffBusinessId();
          setBusinessId(businessId);
          
          if (businessId) {
            // Get business name
            const { data } = await supabase
              .from('profiles')
              .select('business_name')
              .eq('id', businessId)
              .single();
              
            if (data?.business_name) {
              setBusinessName(data.business_name);
            }
          }
        } catch (error) {
          console.error("Failed to fetch business details:", error);
        }
      };
      
      fetchBusinessId();
    }
  }, [propBusinessId]);

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col items-center text-center gap-2">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h3 className="text-xl font-semibold">Contact Management Restricted</h3>
          
          <p className="text-muted-foreground max-w-md">
            As a staff member, you cannot add or manage contacts. You can only message 
            {businessName !== "your business" ? ` ${businessName}` : " your business"} and 
            other staff members if you have permission.
          </p>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            
            {businessId && (
              <Button 
                onClick={() => navigate(`/dashboard/messages/${businessId}`)}
              >
                Message Business
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsStaffRestriction;

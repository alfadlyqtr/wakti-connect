
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StaffWelcomeMessageProps {
  businessId: string | null;
  staffId: string | null;
}

const StaffWelcomeMessage: React.FC<StaffWelcomeMessageProps> = ({ businessId, staffId }) => {
  const [businessName, setBusinessName] = useState<string>('');
  const [isNew, setIsNew] = useState<boolean>(false);
  
  useEffect(() => {
    const checkStaffJoinDate = async () => {
      if (!businessId || !staffId) return;
      
      try {
        // Get business name
        const { data: businessData } = await supabase
          .from('profiles')
          .select('business_name')
          .eq('id', businessId)
          .single();
          
        if (businessData?.business_name) {
          setBusinessName(businessData.business_name);
        }
        
        // Check how recent the staff relationship is
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('created_at')
          .eq('staff_id', staffId)
          .eq('business_id', businessId)
          .single();
          
        if (staffData) {
          const joinDate = new Date(staffData.created_at);
          const now = new Date();
          // If joined less than 24 hours ago, show the welcome message
          if ((now.getTime() - joinDate.getTime()) < 24 * 60 * 60 * 1000) {
            setIsNew(true);
          }
        }
      } catch (error) {
        console.error("Error checking staff join date:", error);
      }
    };
    
    checkStaffJoinDate();
  }, [businessId, staffId]);
  
  // Only show welcome for new staff members
  if (!isNew || !businessName) return null;
  
  return (
    <Alert className="mb-6 bg-green-50 border-green-200">
      <Check className="h-4 w-4 text-green-500" />
      <AlertTitle className="text-green-800">Welcome to {businessName}!</AlertTitle>
      <AlertDescription className="text-green-700 mt-2">
        <p>Your staff account is now active. Here are some things you can do:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>View your <Link to="/dashboard/tasks" className="text-green-800 font-medium underline">assigned tasks</Link></li>
          <li>Check your <Link to="/dashboard/work-logs" className="text-green-800 font-medium underline">work schedule</Link></li>
          <li>Contact your colleagues through <Link to="/dashboard/messages" className="text-green-800 font-medium underline">messages</Link></li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default StaffWelcomeMessage;

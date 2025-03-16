
import React from "react";
import SubscribersList from "@/components/business/subscribers/SubscribersList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DashboardSubscribers = () => {
  // Fetch the current user's business_id
  const { data: businessData, isLoading } = useQuery({
    queryKey: ['currentUserBusiness'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, account_type')
        .eq('id', userData.user.id)
        .single();
        
      if (error || data.account_type !== 'business') {
        throw new Error("Not a business account");
      }
      
      return { businessId: data.id };
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!businessData?.businessId) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Business Account Required</h2>
        <p className="text-muted-foreground">
          You need a business account to access subscriber management.
        </p>
      </div>
    );
  }

  return <SubscribersList businessId={businessData.businessId} />;
};

export default DashboardSubscribers;

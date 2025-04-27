
import React from "react";
import BusinessContactsList from "@/components/contacts/BusinessContactsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DashboardBusinessContacts = () => {
  // Fetch the current user's account type
  const { data: userData, isLoading } = useQuery({
    queryKey: ['currentUserType'],
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
        
      if (error) {
        throw new Error("Could not fetch user profile");
      }
      
      return { 
        accountType: data.account_type,
        userId: data.id 
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userData?.accountType === 'business') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Individual Account Required</h2>
        <p className="text-muted-foreground">
          This page is designed for individual accounts to manage their business contacts.
        </p>
      </div>
    );
  }

  return <BusinessContactsList />;
};

export default DashboardBusinessContacts;


import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpFAQs } from "@/components/help/HelpFAQs";
import { HelpGuides } from "@/components/help/HelpGuides";
import { HelpContact } from "@/components/help/HelpContact";
import { HelpSearch } from "@/components/help/HelpSearch";
import { HelpPlatformInfo } from "@/components/help/HelpPlatformInfo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DashboardHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user profile to customize help content
  const { data: profile } = useQuery({
    queryKey: ['helpPageProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('account_type, full_name')
        .eq('id', session.user.id)
        .single();
        
      return data;
    },
  });

  const accountType = profile?.account_type || 'free';

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, guides, and support for using WAKTI effectively
        </p>
      </div>

      <HelpSearch 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        onClear={() => setSearchQuery("")}
      />

      <HelpPlatformInfo accountType={accountType} />

      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="pt-6">
          <HelpFAQs searchQuery={searchQuery} accountType={accountType} />
        </TabsContent>

        <TabsContent value="guides" className="pt-6">
          <HelpGuides searchQuery={searchQuery} accountType={accountType} />
        </TabsContent>

        <TabsContent value="contact" className="pt-6">
          <HelpContact accountType={accountType} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardHelp;


import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsersRound, CheckCircle } from "lucide-react";

export const IndividualDashboardStats = () => {
  const { t } = useTranslation();
  
  // Get completed tasks count
  const { data: tasksData } = useQuery({
    queryKey: ['completedTasksCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'completed');
        
      if (error) {
        console.error("Error fetching completed tasks count:", error);
        return null;
      }
      
      return { completedCount: count || 0 };
    }
  });
  
  // Get contacts count
  const { data: contactsData } = useQuery({
    queryKey: ['contactsCount'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'accepted');
        
      if (error) {
        console.error("Error fetching contacts count:", error);
        return null;
      }
      
      return { contactsCount: count || 0 };
    }
  });
  
  return (
    <>
      <SectionHeading 
        title={t('dashboard.myProductivity')}
        centered={false}
        className="mt-8 mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('task.status.completed')}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksData?.completedCount !== undefined ? tasksData.completedCount : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.completionRateThis')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.contacts')}
            </CardTitle>
            <UsersRound className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contactsData?.contactsCount !== undefined ? contactsData.contactsCount : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.peopleInNetwork')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

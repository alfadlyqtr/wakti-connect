
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BillingInfoType, InvoiceType } from "@/components/billing/types";

export const useBillingInfo = () => {
  const { data: billingInfo, isLoading } = useQuery({
    queryKey: ['billingInfo'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // In a real implementation, this would fetch actual billing info from Supabase/Stripe
      // For now, we'll use placeholder data
      const { data: userData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.session.user.id)
        .single();
        
      return {
        plan: userData?.account_type || "free",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: userData?.account_type === "individual" ? 9.99 : userData?.account_type === "business" ? 29.99 : 0,
        interval: "month"
      } as BillingInfoType;
    }
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      // In a real implementation, this would fetch actual invoices from Supabase/Stripe
      // For now, we'll use placeholder data
      return [
        {
          id: "INV-001",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: billingInfo?.amount || 0,
          status: "paid",
          downloadUrl: "#"
        },
        {
          id: "INV-002",
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          amount: billingInfo?.amount || 0,
          status: "paid",
          downloadUrl: "#"
        }
      ] as InvoiceType[];
    },
    enabled: !!billingInfo && billingInfo.plan !== "free"
  });

  return { billingInfo, invoices, isLoading };
};

export default useBillingInfo;


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth/useAuth";

export const useBusinessData = () => {
  const [business, setBusiness] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) {
        setBusiness(null);
        setIsLoading(false);
        return;
      }

      // Only try to fetch business data if the user is a business owner or staff
      if (!user.businessId && (user.plan !== 'business' && user.plan !== 'staff' && user.plan !== 'admin' && user.plan !== 'co-admin')) {
        setBusiness(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const businessId = user.businessId || user.id;

        // Fix: Use a table that exists in Supabase schema
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", businessId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setBusiness(data);
      } catch (err: any) {
        console.error("Error fetching business data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  return { business, isLoading, error };
};

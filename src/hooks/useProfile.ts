
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (err) {
        throw err;
      }

      setProfile(data);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  return { profile, isLoading, error, refetch: fetchProfile };
};

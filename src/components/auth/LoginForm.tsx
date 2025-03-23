
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { fromTable } from "@/integrations/supabase/helper";

interface LoginFormProps {
  setError?: React.Dispatch<React.SetStateAction<string>>;
}

const LoginForm = ({ setError }: LoginFormProps = {}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setInternalError(null);
    if (setError) setError("");
    
    try {
      // Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // After login, check if user is a staff member using helper
      const { data: staffData } = await fromTable('business_staff')
        .select('id, business_id, role')
        .eq('staff_id', data.user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (staffData) {
        // Store staff status and info in localStorage for quicker access
        localStorage.setItem('isStaff', 'true');
        localStorage.setItem('staffRelationId', staffData.id);
        localStorage.setItem('staffBusinessId', staffData.business_id);
        localStorage.setItem('userRole', staffData.role);
        
        // Redirect staff to staff dashboard
        navigate('/dashboard/staff-dashboard');
      } else {
        // Regular user redirect
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      const errorMessage = error.message || "Invalid email or password";
      setInternalError(errorMessage);
      if (setError) setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {internalError && (
        <p className="text-sm text-destructive text-center">{internalError}</p>
      )}
      
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;

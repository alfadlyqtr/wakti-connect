
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface SignupFormProps {
  setError: (error: string) => void;
}

const SignupForm = ({ setError }: SignupFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState("free");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: accountType,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Note: we don't redirect here as the user needs to verify their email first
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full-name">{t('auth.fullName')}</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="full-name" 
            type="text" 
            placeholder="John Doe" 
            className="pl-10"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t('auth.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="name@example.com" 
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">{t('auth.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            id="signup-password" 
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-type">{t('auth.accountType')}</Label>
        <RadioGroup 
          defaultValue="free" 
          value={accountType}
          onValueChange={setAccountType}
          className="grid grid-cols-3 gap-2 pt-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer">{t('auth.free')}</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="cursor-pointer">{t('auth.individual')}</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="business" id="business" />
            <Label htmlFor="business" className="cursor-pointer">{t('auth.business')}</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="terms" required />
        <Label 
          htmlFor="terms" 
          className="text-sm font-normal cursor-pointer"
        >
          {t('auth.termsAgreement')}
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{t('auth.creatingAccount')}</span>
          </div>
        ) : (
          <span>{t('auth.createAccount')}</span>
        )}
      </Button>
    </form>
  );
};

export default SignupForm;

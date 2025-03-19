
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

// Import refactored components
import FormField from "./signup/FormField";
import AccountTypeSelection from "./signup/AccountTypeSelection";
import BusinessNameField from "./signup/BusinessNameField";
import TermsAgreement from "./signup/TermsAgreement";
import SubmitButton from "./signup/SubmitButton";

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
  const [businessName, setBusinessName] = useState("");
  
  const needsBusinessName = accountType === "business";

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate business name if account type is business
    if (needsBusinessName && !businessName.trim()) {
      setError("Business name is required for business accounts");
      toast({
        variant: "destructive",
        title: "Missing business name",
        description: "Please provide a business name for your business account",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: accountType,
            business_name: needsBusinessName ? businessName : null,
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

  const passwordToggleButton = (
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
  );

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <FormField
        id="full-name"
        label={t('auth.fullName')}
        type="text"
        placeholder="John Doe"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        icon={<User />}
      />
      
      <FormField
        id="signup-email"
        label={t('auth.email')}
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail />}
      />
      
      <FormField
        id="signup-password"
        label={t('auth.password')}
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        icon={<Lock />}
        showPasswordToggle={passwordToggleButton}
      />
      
      <AccountTypeSelection
        value={accountType}
        onChange={setAccountType}
      />
      
      {needsBusinessName && (
        <BusinessNameField
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      )}
      
      <TermsAgreement />
      
      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default SignupForm;

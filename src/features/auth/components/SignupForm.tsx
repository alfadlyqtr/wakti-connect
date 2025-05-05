
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../context/AuthContext";

import FormInputField from "./signup/FormInputField";
import AccountTypeSelector from "./signup/AccountTypeSelector";
import BusinessNameField from "./signup/BusinessNameField";
import TermsCheckbox from "./signup/TermsCheckbox";
import SubmitButton from "./signup/SubmitButton";
import TroubleshootingTips from "./signup/TroubleshootingTips";

interface SignupFormProps {
  setError: (error: string) => void;
}

const SignupForm = ({ setError }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [businessName, setBusinessName] = useState("");
  const [registerAttempts, setRegisterAttempts] = useState(0);
  const { register } = useAuth();
  
  const needsBusinessName = accountType === "business";

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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
      console.log("Registering with account type:", accountType);
      
      const result = await register(email, password, fullName, accountType, businessName);
      
      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      setRegisterAttempts(prev => prev + 1);
    } catch (error: any) {
      console.error("Signup error:", error);
      
      setRegisterAttempts(prev => prev + 1);
      
      let errorMessage = error.message || "Failed to create account. Please try again.";
      
      if (registerAttempts >= 2 && (error.message?.includes("database") || error.message?.includes("profiles"))) {
        errorMessage = "We're experiencing technical difficulties. Please try again later.";
      }
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <FormInputField
        id="full-name"
        label="Full Name"
        type="text"
        placeholder="Hassan Abdullah"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        icon={<User />}
      />
      
      <FormInputField
        id="signup-email"
        label="Email"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail />}
      />
      
      <FormInputField
        id="signup-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        icon={<Lock />}
        rightIcon={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 h-full px-3"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        }
        helpText="Password must be at least 6 characters"
      />
      
      <AccountTypeSelector 
        value={accountType}
        onChange={setAccountType}
      />
      
      {needsBusinessName && (
        <BusinessNameField
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required={needsBusinessName}
        />
      )}
      
      <TermsCheckbox />
      
      <SubmitButton isLoading={isLoading} />
      
      <TroubleshootingTips attemptCount={registerAttempts} />
    </form>
  );
};

export default SignupForm;

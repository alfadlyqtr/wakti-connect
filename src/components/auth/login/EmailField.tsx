
import React from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface EmailFieldProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ email, setEmail }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{t('auth.email')}</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          className="pl-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default EmailField;

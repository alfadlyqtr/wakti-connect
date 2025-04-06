
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShareLinksTabProps {
  onSendEmail?: (email: string) => void;
}

const ShareLinksTab: React.FC<ShareLinksTabProps> = ({ onSendEmail }) => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSendEmail = () => {
    if (onSendEmail && email) {
      onSendEmail(email);
      setEmail("");
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="example@email.com"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleSendEmail}
              disabled={!email}
            >
              <Send className="mr-2 h-4 w-4" />
              {t('common.send')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLinksTab;


import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export const AIUpgradeRequired: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
          {t("ai.premiumFeature")}
        </CardTitle>
        <CardDescription>
          {t("ai.requiresPlan")}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm pb-2">
        <p>{t("ai.upgradeToAccess")}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full">
          <Link to="/dashboard/settings">
            {t("ai.upgradeNow")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIUpgradeRequired;


import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  errorMessage: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("booking.notFound")}</CardTitle>
          <CardDescription>
            {errorMessage || t("booking.notFoundMessage")}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/")}>{t("common.returnHome")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorState;

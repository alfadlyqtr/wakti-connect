
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const { t } = useTranslation();
  const defaultMessage = t("jobCards.loadingJobs");
  
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{message || defaultMessage}</span>
    </div>
  );
};

interface ErrorAlertProps {
  title: string;
  message: string;
  suggestion?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, message, suggestion }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      {message}
      {suggestion && (
        <div className="mt-2">
          <p className="text-sm">{suggestion}</p>
        </div>
      )}
    </AlertDescription>
  </Alert>
);

interface InfoAlertProps {
  title: string;
  message: string;
}

export const InfoAlert: React.FC<InfoAlertProps> = ({ title, message }) => (
  <Alert variant="default">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

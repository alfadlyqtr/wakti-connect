
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialAuth from "./SocialAuth";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        navigate("/dashboard");
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/dashboard");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl animate-in">
      <Tabs defaultValue={defaultTab} className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              asChild
            >
              <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                <span>{t('auth.back')}</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <TabsList className="grid w-32 sm:w-48 grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.signUp')}</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{t('auth.welcomeToWakti')}</CardTitle>
          <CardDescription className="text-center">
            {t('auth.manageEfficiently')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <TabsContent value="login" className="mt-0">
            <LoginForm setError={setError} />
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <SignupForm setError={setError} />
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('auth.continueWith')}
              </span>
            </div>
          </div>
          
          <SocialAuth />
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default AuthForm;

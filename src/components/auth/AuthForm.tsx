
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
import LanguageSwitcher from "@/components/ui/language-switcher";

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("AuthForm mounted with defaultTab:", defaultTab);
    
    const checkSession = async () => {
      console.log("Checking for existing session");
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        console.log("Session found, redirecting to dashboard");
        navigate("/dashboard");
      } else {
        console.log("No active session found");
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to dashboard");
          navigate("/dashboard");
        }
      }
    );

    return () => {
      console.log("AuthForm unmounting, cleaning up listener");
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
                <span>Back to Home</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <TabsList className="grid w-32 sm:w-48 grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to WAKTI</CardTitle>
          <CardDescription className="text-center">
            Manage your tasks, appointments, and business efficiently
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
                Continue with
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

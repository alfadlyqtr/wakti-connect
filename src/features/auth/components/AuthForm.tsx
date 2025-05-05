
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialAuth from "./SocialAuth";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  defaultTab?: 'login' | 'register';
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log("AuthForm mounted with defaultTab:", defaultTab);
  }, [defaultTab]);

  // If authenticated and not loading, redirect to returnUrl
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to:", returnUrl);
      navigate(returnUrl);
    }
  }, [isAuthenticated, isLoading, navigate, returnUrl]);

  return (
    <Card className="w-full max-w-sm mx-auto border-border/50 shadow-xl animate-in">
      <Tabs defaultValue={defaultTab} className="w-full">
        <CardHeader className="space-y-4">
          {/* WAKTI Logo */}
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              asChild
            >
              <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </Button>
            <LanguageSwitcher />
          </div>
          
          <div className="text-center space-y-1.5">
            <CardTitle className="text-2xl">Welcome to WAKTI</CardTitle>
            <CardDescription>
              Manage your tasks, appointments, and business efficiently
            </CardDescription>
          </div>
          
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <TabsContent value="login" className="mt-0 space-y-4">
            <LoginForm setError={setError} />
          </TabsContent>

          <TabsContent value="register" className="mt-0 space-y-4">
            <SignupForm setError={setError} />
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-6">
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

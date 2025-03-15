
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl animate-in">
      <Tabs defaultValue="login" className="w-full">
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
                <span>Back</span>
              </Link>
            </Button>
            <TabsList className="grid w-32 sm:w-48 grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to Wakti</CardTitle>
          <CardDescription className="text-center">
            Manage your tasks and appointments efficiently
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/reset-password" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
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
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => 
                    setRememberMe(checked as boolean)
                  }
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </div>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="full-name" 
                    type="text" 
                    placeholder="John Doe" 
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="signup-password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
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
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select defaultValue="free">
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox id="terms" required />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-normal cursor-pointer"
                >
                  I agree to the <Link to="/terms" className="underline underline-offset-2">Terms of Service</Link> and <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 w-full">
            <Button variant="outline" type="button" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default AuthForm;

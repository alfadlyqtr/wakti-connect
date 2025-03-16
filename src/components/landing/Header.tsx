
import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-wakti-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl">Wakti</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="text-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <Button asChild size="sm" className="ml-2">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="rounded-full bg-muted text-foreground ml-2">
            <Link to="/auth" aria-label="Sign in">
              <User className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="text-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 w-[200px] p-4">
                    <NavigationMenuLink asChild>
                      <Link to="/pricing" className="block py-2 px-3 hover:bg-muted rounded-md">
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/features" className="block py-2 px-3 hover:bg-muted rounded-md">
                        Features
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/contact" className="block py-2 px-3 hover:bg-muted rounded-md">
                        Contact
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/auth" className="flex items-center py-2 px-3 hover:bg-muted rounded-md">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </NavigationMenuLink>
                    <div className="pt-2 mt-2 border-t border-border">
                      <Button asChild size="sm" className="w-full">
                        <Link to="/auth">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

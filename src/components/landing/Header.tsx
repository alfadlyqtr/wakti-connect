
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LanguageSwitcher from "@/components/ui/language-switcher";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI" 
              className="w-10 h-10 rounded-md object-cover"
            />
            <span className="font-bold text-xl">WAKTI</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
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
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            aria-label={theme === "dark" ? "Light Mode" : "Dark Mode"} 
            title={theme === "dark" ? "Light Mode" : "Dark Mode"} 
            className="text-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button asChild size="sm" className="ml-2">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="rounded-full bg-muted text-foreground ml-2">
            <Link to="/auth" aria-label="Sign In" title="Sign In">
              <User className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </div>
        
        {/* Mobile navigation button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            aria-label={theme === "dark" ? "Light Mode" : "Dark Mode"} 
            title={theme === "dark" ? "Light Mode" : "Dark Mode"} 
            className="text-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 px-4 py-2 rounded-md bg-background/70"
            onClick={toggleMenu}
          >
            <span className="font-medium">Menu</span>
            {isMenuOpen ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-popover border-t border-border animate-fade-in">
          <div className="container py-3 flex flex-col space-y-3">
            <Link 
              to="/pricing" 
              className="flex items-center px-4 py-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Pricing</span>
            </Link>
            <Link 
              to="/features" 
              className="flex items-center px-4 py-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Features</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center px-4 py-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-medium">Contact</span>
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center px-4 py-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">Sign In</span>
            </Link>
            <div className="pt-2 px-4">
              <Button asChild size="sm" className="w-full">
                <Link 
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                >Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

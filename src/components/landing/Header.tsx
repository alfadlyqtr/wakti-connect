
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
    <header className="bg-white backdrop-blur-md border-b border-wakti-navy/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI" 
              className="w-10 h-10 rounded-md object-cover"
            />
            <span className="font-bold text-xl text-wakti-navy">WAKTI</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/pricing" className="text-sm font-medium text-wakti-navy hover:text-wakti-navy/80 transition-colors">
            Pricing
          </Link>
          <Link to="/features" className="text-sm font-medium text-wakti-navy hover:text-wakti-navy/80 transition-colors">
            Features
          </Link>
          <Link to="/contact" className="text-sm font-medium text-wakti-navy hover:text-wakti-navy/80 transition-colors">
            Contact
          </Link>
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="text-wakti-navy hover:text-wakti-navy/80"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button asChild size="sm" className="bg-wakti-navy text-white hover:bg-wakti-navy/90">
            <Link to="/auth/login">Sign In / Create Account</Link>
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
            className="text-wakti-navy hover:text-wakti-navy/80"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          {/* Beige box with navy highlighted "Menu" text, navy border */}
          <button
            className={`flex items-center gap-1 px-4 py-2 rounded-md border-2 border-wakti-navy bg-wakti-beige text-wakti-navy ${
              isMenuOpen ? "ring-2 ring-wakti-navy" : ""
            }`}
            style={{ fontWeight: 600 }}
            onClick={toggleMenu}
          >
            <span>Menu</span>
            {isMenuOpen ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-wakti-beige border-t border-wakti-navy/20 animate-fade-in z-[60] shadow-lg">
          <div className="container py-3 flex flex-col space-y-3">
            <Link 
              to="/pricing" 
              className="flex items-center px-4 py-3 rounded-md transition-colors text-wakti-navy hover:bg-wakti-navy/10 font-semibold"
              onClick={() => setIsMenuOpen(false)}
              style={{ background: "transparent" }}
            >
              <span>Pricing</span>
            </Link>
            <Link 
              to="/features" 
              className="flex items-center px-4 py-3 rounded-md transition-colors text-wakti-navy hover:bg-wakti-navy/10 font-semibold"
              onClick={() => setIsMenuOpen(false)}
              style={{ background: "transparent" }}
            >
              <span>Features</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center px-4 py-3 rounded-md transition-colors text-wakti-navy hover:bg-wakti-navy/10 font-semibold"
              onClick={() => setIsMenuOpen(false)}
              style={{ background: "transparent" }}
            >
              <span>Contact</span>
            </Link>
            <Link 
              to="/auth/login" 
              className="flex items-center px-4 py-3 rounded-md transition-colors text-wakti-navy hover:bg-wakti-navy/10 font-semibold"
              onClick={() => setIsMenuOpen(false)}
              style={{ background: "transparent" }}
            >
              <User className="h-4 w-4 mr-2 text-wakti-navy" />
              <span>Sign In / Create Account</span>
            </Link>
            <div className="pt-2 px-4">
              <Button asChild size="sm" className="w-full bg-wakti-navy text-white hover:bg-wakti-navy/90">
                <Link 
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                >Sign In / Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


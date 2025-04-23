
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import LanguageSwitcher from "@/components/ui/language-switcher";

const NAV_LINKS = [
  { path: "/features", label: "Features" },
  { path: "/pricing", label: "Pricing" },
  { path: "/contact", label: "Contact" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png"
            alt="WAKTI"
            className="w-9 h-9 rounded-md object-cover"
          />
          <span className="font-bold text-2xl text-[#0A1172]">WAKTI</span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-base font-medium text-[#0A1172] hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            asChild
            size="sm"
            className="ml-1 bg-[#0A1172] text-white hover:bg-[#232D4B]"
          >
            <Link to="/auth/login">
              <User className="h-4 w-4 mr-1" />
              Sign In / Register
            </Link>
          </Button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <button
            className="p-2 border border-[#0A1172] rounded-md bg-[#E8DCC4] text-[#0A1172] font-semibold flex items-center gap-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
      {/* Mobile Dropdown */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[60] animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="py-2 text-[#0A1172] text-base font-semibold rounded-md hover:bg-[#E8DCC4]/70 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth/login"
              className="py-2 flex items-center gap-2 text-[#0A1172] font-semibold rounded-md hover:bg-[#E8DCC4]/70 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Sign In / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogIn, LogOut, Award, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { mockLogin, MockUser } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ecoScore, setEcoScore] = useState<number>(72);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check if user is saved in session storage for continuity
    const savedUser = sessionStorage.getItem("eco_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Set theme on mount
    const savedTheme = localStorage.getItem("eco_theme") as "dark" | "light" | null;
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Close mobile menu on page transitions
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("light");
      localStorage.setItem("eco_theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("eco_theme", "dark");
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const mockUserData = await mockLogin();
      setUser(mockUserData);
      sessionStorage.setItem("eco_user", JSON.stringify(mockUserData));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("eco_user");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/simulator", label: "Simulator" },
    { href: "/coach", label: "AI Coach" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-foreground hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="tracking-tight font-sans font-bold">
              EcoMind <span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-primary" : "text-foreground/75"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Auth / Profile / Theme Toggle / Hamburger */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary text-foreground/75 hover:text-foreground transition-all border border-border cursor-pointer"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* User Account / Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Eco Score Badge */}
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary border border-primary/20">
                <Award className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eco Score:</span> {ecoScore}
              </div>

              {/* User profile details */}
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="h-8 w-8 rounded-full border border-border"
                />
                <span className="hidden lg:inline text-sm font-medium text-foreground">{user.displayName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary text-foreground/70 hover:text-foreground transition-colors border border-border cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors border border-transparent disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{isLoggingIn ? "Logging in..." : "Google Login"}</span>
            </button>
          )}

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary border border-border text-foreground transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/75 hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

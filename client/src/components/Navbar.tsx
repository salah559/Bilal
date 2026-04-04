import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, Search, SlidersHorizontal, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/1000268407-removebg-preview_1770170356230.png";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/products", label: t('nav.products') },
    { href: "/contact", label: t('nav.contact') },
  ];

  return (
    <nav
      className={cn(
        "fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center",
        scrolled ? "px-4" : "px-6"
      )}
    >
      <div className={cn(
        "flex items-center justify-between w-full max-w-6xl px-6 py-2 transition-all duration-500 rounded-2xl border shadow-2xl backdrop-blur-2xl bg-background/80 border-white/10 relative",
        scrolled ? "scale-95 shadow-primary/10" : "scale-100 shadow-black/50"
      )}>
        {/* Subtle Highlight line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="flex items-center gap-12">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 py-1">
            <img 
              src={logo} 
              alt="Bilel Quincaillerie" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "relative text-xs font-semibold tracking-wide cursor-pointer transition-all duration-300",
                  location === link.href 
                    ? "text-primary font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  {link.label}
                  {location === link.href && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/contact">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20">
              {t('nav.contact')}
            </button>
          </Link>

          <div className="h-6 w-[1px] bg-white/10 hidden md:block mx-1" />

          <LanguageSelector />

          <Link href="/checkout">
            <button className="relative p-2.5 text-muted-foreground hover:text-foreground transition-all group bg-white/5 rounded-xl border border-white/5 hover:border-white/10">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-secondary/30 ring-2 ring-background">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 text-muted-foreground hover:text-foreground transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/5"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2.5 text-foreground bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="lg:hidden absolute top-[80px] left-4 right-4 bg-background/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-40 p-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={cn(
                      "text-sm font-semibold tracking-wide block py-4 px-6 rounded-2xl transition-all",
                      location === link.href ? "text-white bg-primary shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-white/5 my-2 pt-4">
                <Link href="/contact">
                  <button className="w-full py-4 bg-primary text-white font-bold uppercase text-xs tracking-wider rounded-2xl shadow-lg shadow-primary/20">
                    {t('nav.contact')}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

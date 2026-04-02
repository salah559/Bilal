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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        "flex items-center justify-between w-full max-w-5xl px-6 py-2 transition-all duration-500 rounded-full border shadow-2xl backdrop-blur-xl bg-[#1a1c22]/90 border-white/10 relative",
        scrolled ? "scale-95 shadow-brand-blue/10" : "scale-100 shadow-black/50"
      )}>
        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5 opacity-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-scan" />
        </div>
        <div className="flex items-center gap-12 flex-1">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex flex-col">
              <span className="font-display text-lg font-black tracking-tight text-brand-blue group-hover:text-white transition-colors">
                BILEL
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] text-gray-500 uppercase font-bold">
                Hardware
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "relative text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all duration-300",
                  location === link.href 
                    ? "text-brand-blue" 
                    : "text-gray-400 hover:text-white"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/contact">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-full bg-[#00e1ff] text-[#000000] hover:scale-105 transition-all duration-300 font-display text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,225,255,0.3)]">
              {t('nav.contact')}
            </button>
          </Link>

          <LanguageSelector />

          <Link href="/checkout">
            <button className="relative p-2.5 text-gray-400 hover:text-white transition-all group">
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/20">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            className="lg:hidden absolute top-[70px] left-4 right-4 bg-[#1a1c22]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-40 p-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={cn(
                      "text-sm font-display font-bold uppercase tracking-widest block py-3 px-4 rounded-xl transition-all",
                      location === link.href ? "text-white bg-brand-blue" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/contact">
                <button className="w-full py-4 bg-[#00e1ff] text-[#000000] font-black uppercase text-[10px] tracking-widest rounded-xl mt-2">
                  {t('nav.contact')}
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

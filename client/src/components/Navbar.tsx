import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/1000268407-removebg-preview_1770170356230.png";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/products", label: "Produits" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-white/5 py-3 shadow-2xl" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-blue/20 blur-xl rounded-full group-hover:bg-brand-blue/40 transition-colors"></div>
              <img 
                src={logo} 
                alt="Bilel" 
                className="h-10 md:h-14 w-auto relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(0,85,255,0.3)]" 
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display text-xl md:text-2xl font-black tracking-tighter text-white leading-none">
                BILEL
              </span>
              <span className="text-[10px] font-mono tracking-[0.4em] text-brand-orange uppercase font-bold">
                Quincaillerie
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered Glassmorphism */}
          <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "relative px-6 py-2 text-xs font-bold tracking-widest uppercase cursor-pointer transition-all duration-300 rounded-full",
                  location === link.href 
                    ? "text-white bg-brand-blue shadow-lg shadow-brand-blue/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Toggle */}
            <div className="relative hidden md:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-white/5 border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-brand-blue transition-all"
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle (Products Page Only) */}
            {location === "/products" && (
              <button className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-full transition-all md:hidden lg:flex">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-orange text-white hover:bg-white hover:text-brand-orange transition-all duration-300 font-display text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-orange/20">
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>

            <button className="relative p-2.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-full transition-all group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 bg-brand-blue text-[9px] font-black text-white w-4 h-4 flex items-center justify-center rounded-full border-2 border-background shadow-lg">
                0
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2.5 text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced Minimalist Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-t border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={cn(
                      "text-2xl font-display font-black uppercase tracking-tighter block py-2 transition-all",
                      location === link.href ? "text-brand-blue translate-x-4" : "text-gray-400 hover:text-white hover:translate-x-2"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-4 bg-brand-orange text-white font-bold uppercase text-xs tracking-widest rounded-xl">
                  <Phone className="w-4 h-4" /> Appeler
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-white/5 text-white font-bold uppercase text-xs tracking-widest rounded-xl border border-white/10">
                  Panier (0)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

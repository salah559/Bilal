import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, Hammer } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/1000268407-removebg-preview_1770170356230.png";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-background/95 backdrop-blur-md border-white/10 py-3 shadow-2xl" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-blue blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <img 
                src={logo} 
                alt="Quincaillerie Bilel" 
                className="h-12 w-auto relative z-10 transition-transform group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-wider text-white group-hover:text-brand-blue transition-colors">
                BILEL
              </span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-orange uppercase">
                Quincaillerie
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "relative text-sm font-medium tracking-widest uppercase cursor-pointer py-2 transition-colors",
                  location === link.href 
                    ? "text-brand-blue" 
                    : "text-gray-300 hover:text-white"
                )}>
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_10px_var(--brand-blue)]"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-sm border border-brand-orange/30 text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange transition-all font-mono text-sm uppercase">
              <Phone className="w-4 h-4" />
              <span>Appeler</span>
            </button>
            <button className="relative p-2 text-white hover:text-brand-blue transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-brand-blue text-[10px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="p-2 text-white hover:text-brand-blue transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-brand-blue text-[10px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
            <button 
              className="text-white p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={cn(
                      "text-lg font-display uppercase tracking-wider block py-2 border-b border-white/5",
                      location === link.href ? "text-brand-blue" : "text-gray-300"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-4 flex gap-4">
                <button className="flex-1 py-3 bg-brand-orange text-white font-bold uppercase tracking-wider hover:bg-brand-orange/90">
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

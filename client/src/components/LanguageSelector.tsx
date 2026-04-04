import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const languages = [
  { code: "ar", name: "العربية", flag: "DZ" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "en", name: "English", flag: "US" }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[1];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2.5 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full border border-white/5"
      >
        <Globe className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
          {currentLanguage.code}
        </span>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 right-0 w-48 bg-background/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-50 p-2"
          >
            <div className="flex flex-col gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                    i18n.language === lang.code 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="opacity-60">{lang.flag === "DZ" ? "🇩🇿" : lang.flag === "FR" ? "🇫🇷" : "🇺🇸"}</span>
                    <span>{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-card border-t border-border py-8 relative overflow-hidden transition-colors mt-auto">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground text-xs font-mono uppercase font-bold tracking-widest text-center">
          © {new Date().getFullYear()} BILEL. {t('footer.rights') || "Tous droits réservés."}
        </p>
        <a 
          href="http://novawebdv.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-brand-orange hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group mt-4 flex items-center gap-1"
        >
          Devlped by <span className="group-hover:underline">novaweb</span>
        </a>
      </div>
    </footer>
  );
}

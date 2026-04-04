import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-card border-t border-white/5 py-12 relative overflow-hidden mt-auto">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm" />
          </div>
          <span className="text-sm font-bold tracking-widest text-foreground uppercase">
            Bilel Quincaillerie
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} BILEL. {t('footer.rights') || "Tous droits réservés."}
          </p>
          
          <a 
            href="http://novawebdv.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-secondary/60 hover:text-secondary transition-colors text-[9px] font-bold uppercase tracking-[0.3em] group mt-2 flex items-center gap-1.5"
          >
            Developed by <span className="text-white group-hover:underline">novaweb</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

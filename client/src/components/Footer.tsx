import { Hammer, Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Hammer className="w-8 h-8 text-brand-orange" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-wider">BILEL</span>
                <span className="text-[10px] font-mono tracking-[0.3em] text-brand-blue uppercase">Quincaillerie</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour tous vos besoins en outillage et quincaillerie. Qualité professionnelle et service exceptionnel.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-blue flex items-center justify-center transition-colors border border-white/10">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-orange flex items-center justify-center transition-colors border border-white/10">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-display text-white text-lg mb-6 border-l-4 border-brand-blue pl-3">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", href: "/" },
                { label: "Produits", href: "/products" },
                { label: "À propos", href: "/about" },
                { label: "Contact", href: "/contact" }
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-gray-400 hover:text-brand-orange transition-colors cursor-pointer text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-blue rounded-full"></span>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h4 className="font-display text-white text-lg mb-6 border-l-4 border-brand-orange pl-3">Catégories</h4>
            <ul className="space-y-3">
              {["Outillage", "Peinture", "Électricité", "Plomberie", "Jardinage"].map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${cat}`}>
                    <span className="text-gray-400 hover:text-brand-blue transition-colors cursor-pointer text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      {cat}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-display text-white text-lg mb-6 border-l-4 border-white pl-3">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <span className="text-sm">123 Rue de l'Industrie, Zone d'Activité, Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-sm">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm">contact@quincaillerie-bilel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-mono uppercase">
            © {new Date().getFullYear()} Quincaillerie Bilel. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-xs font-mono uppercase">Confidentialité</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs font-mono uppercase">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

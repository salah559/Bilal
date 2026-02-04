import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase mb-4">
            Contactez <span className="text-brand-orange">Nous</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Une question sur un produit ? Besoin d'un devis ? Notre équipe est à votre écoute pour vous accompagner dans vos projets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-white/10 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-bl-full -mr-12 -mt-12"></div>
            
            <h3 className="text-2xl font-display font-bold text-white mb-8 uppercase">Envoyez un message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Nom</label>
                  <input type="text" className="w-full bg-background border border-white/10 p-3 text-white focus:border-brand-blue outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Email</label>
                  <input type="email" className="w-full bg-background border border-white/10 p-3 text-white focus:border-brand-blue outline-none transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Sujet</label>
                <select className="w-full bg-background border border-white/10 p-3 text-white focus:border-brand-blue outline-none transition-colors appearance-none">
                  <option>Demande de devis</option>
                  <option>Information produit</option>
                  <option>Service après-vente</option>
                  <option>Autre</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Message</label>
                <textarea rows={5} className="w-full bg-background border border-white/10 p-3 text-white focus:border-brand-blue outline-none transition-colors"></textarea>
              </div>

              <button type="button" className="w-full py-4 bg-brand-blue text-white font-bold uppercase tracking-wider hover:bg-white hover:text-brand-blue transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Envoyer le message
              </button>
            </form>
          </motion.div>

          {/* Info & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, title: "Adresse", text: "123 Rue de l'Industrie, Alger" },
                { icon: Phone, title: "Téléphone", text: "+213 555 123 456" },
                { icon: Mail, title: "Email", text: "contact@bilel.com" },
                { icon: Clock, title: "Horaires", text: "Sam - Jeu: 8h - 18h" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-white/5 border border-white/10 p-6 flex flex-col items-center text-center hover:border-brand-orange transition-colors group"
                >
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/10">
                    <item.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h4 className="text-white font-bold uppercase text-sm mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-64 w-full bg-gray-800 border border-white/10 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.669866838384!2d3.0560!3d36.7525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f76785055b%3A0x2863584852089!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sus!4v1645564852154!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
              <div className="absolute top-4 left-4 bg-background/90 p-2 px-4 border border-white/10 pointer-events-none">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notre Localisation</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

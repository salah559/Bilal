import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/use-products";
import heroVideo from "@assets/1770170031390_1770170383287.mp4";
import { ArrowRight, Box, Zap, Gavel, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";

export default function Home() {
  const { data: products, isLoading } = useProducts({ featured: true });
  const { data: categories } = useCategories();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </motion.div>

        {/* Hero Content */}
        <div className="container relative z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 border border-brand-orange/50 bg-brand-orange/10 backdrop-blur-sm rounded-full">
              <span className="text-brand-orange font-mono text-sm uppercase tracking-widest font-bold">
                Qualité Professionnelle
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white uppercase tracking-tighter mb-6 text-shadow-glow leading-none">
              Quincaillerie <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-white">Bilel</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-body mb-8 leading-relaxed">
              L'équipement ultime pour vos projets. Outillage, matériaux et expertise au service des professionnels et des passionnés.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <button className="px-8 py-4 bg-brand-blue text-white font-bold uppercase tracking-wider hover:bg-white hover:text-brand-blue transition-all border border-brand-blue shadow-[0_0_20px_-5px_var(--brand-blue)] hover:shadow-[0_0_30px_-5px_var(--brand-blue)] flex items-center justify-center gap-2 group">
                  Voir le Catalogue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 bg-transparent text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all border border-white/30 backdrop-blur-sm flex items-center justify-center">
                  Nous Contacter
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-blue to-transparent"></div>
        </motion.div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20 bg-card border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blue/5 skew-x-12 transform origin-top"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Zap, label: "Service Rapide", desc: "Livraison express sur tout le territoire" },
              { icon: Gavel, label: "Garantie Qualité", desc: "Produits certifiés et durables" },
              { icon: Box, label: "Large Stock", desc: "Plus de 5000 références disponibles" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
              >
                <div className="w-16 h-16 mx-auto bg-brand-blue/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.label}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-brand-orange font-mono uppercase tracking-widest text-sm font-bold">Sélection Premium</span>
              <h2 className="text-4xl md:text-5xl font-display text-white mt-2">
                Produits <span className="text-outline-blue">Populaires</span>
              </h2>
            </div>
            <Link href="/products">
              <span className="text-brand-blue hover:text-white transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider font-bold text-sm group">
                Tout voir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-card border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-12 text-center uppercase">
            Nos <span className="text-brand-orange">Univers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((cat, idx) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-80 overflow-hidden cursor-pointer border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                  <img 
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80"} // Fallback image
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <h3 className="text-2xl font-bold text-white uppercase font-display mb-2 group-hover:text-brand-blue transition-colors">
                      {cat.name}
                    </h3>
                    <div className="w-0 h-1 bg-brand-orange group-hover:w-16 transition-all duration-300"></div>
                  </div>
                </motion.div>
              </Link>
            )) || (
              // Fallback categories if none exist
              ["Outillage", "Construction", "Électricité"].map((cat, idx) => (
                 <div key={idx} className="h-80 bg-white/5 animate-pulse flex items-center justify-center border border-white/10">
                   <span className="text-white/20 font-display text-2xl uppercase">{cat}</span>
                 </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase">
            Prêt à <span className="text-brand-orange">construire ?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Visitez notre magasin ou contactez-nous pour un devis personnalisé pour vos grands projets.
          </p>
          <Link href="/contact">
            <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-wider hover:bg-brand-orange hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
              Demander un Devis
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/use-products";
import heroImg from "@assets/hero_hardware_montage.png";
import { ArrowRight, Box, Zap, Gavel, Loader2, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useProducts({ featured: true });
  const { data: categories } = useCategories();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[95vh] w-full overflow-hidden flex items-center justify-center">
        {/* New Hero Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/60 to-background z-10" />
          <img 
            src={heroImg} 
            alt="Hardware Montage" 
            className="w-full h-full object-cover scale-105"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="container relative z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-primary/30 bg-primary/10 backdrop-blur-md rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold text-xs uppercase tracking-widest">
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
              {t('hero.title1')} <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {t('hero.title2')}
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/products">
                <button className="px-10 py-4.5 bg-primary text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group">
                  {t('hero.cta_catalog')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-10 py-4.5 bg-white/5 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md flex items-center justify-center">
                  {t('hero.cta_contact')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1.5 opacity-50">
            <div className="w-1 h-2 bg-primary rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Trust/Stats Section */}
      <section className="py-24 bg-card/30 border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Zap, label: t('features.fast_service'), desc: t('features.fast_service_desc') },
              { icon: ShieldCheck, label: t('features.quality_guarantee'), desc: t('features.quality_guarantee_desc') },
              { icon: Truck, label: t('features.large_stock'), desc: t('features.large_stock_desc') }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="w-20 h-20 mx-auto bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all group-hover:scale-105 group-hover:shadow-3xl group-hover:shadow-primary/5">
                  <feature.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{feature.label}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-28 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                {t('home.featured_outline')}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-foreground mb-2">
                {t('home.featured_title')} 
              </h2>
            </div>
            <Link href="/products">
              <span className="text-primary border-b-2 border-primary/20 hover:border-primary transition-all cursor-pointer flex items-center gap-2 pb-1 font-bold">
                {t('home.view_all')} <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.slice(0, 4).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-28 bg-card border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 uppercase">
              {t('home.categories_title')} <span className="text-primary">{t('home.categories_outline')}</span>
            </h2>
            <p className="text-muted-foreground text-lg italic">{t('products.thousands_references')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories?.map((cat, idx) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-96 overflow-hidden cursor-pointer rounded-3xl border border-white/5 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10" />
                  <img 
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80"} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                    <h3 className="text-3xl font-black text-white uppercase group-hover:text-primary transition-colors mb-3">
                      {cat.name}
                    </h3>
                    <div className="w-12 h-1.5 bg-primary group-hover:w-24 transition-all duration-500 rounded-full"></div>
                  </div>
                </motion.div>
              </Link>
            )) || (
              ["Outillage", "Construction", "Électricité"].map((cat, idx) => (
                 <div key={idx} className="h-96 bg-white/5 animate-pulse flex items-center justify-center rounded-3xl border border-white/5">
                   <span className="text-white/10 font-bold text-2xl uppercase tracking-widest">{cat}</span>
                 </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-tight">
              {t('home.ready_to_build').split('?')[0]} <span className="text-primary">?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('home.cta_quote_desc')}
            </p>
            <Link href="/contact">
              <button className="px-14 py-6 bg-primary text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white hover:text-primary transition-all shadow-2xl shadow-primary/30 transform active:scale-95">
                {t('home.cta_quote')}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

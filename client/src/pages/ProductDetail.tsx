import { useState } from "react";
import { useRoute } from "wouter";
import { useFirebaseProduct } from "@/hooks/use-firebase-products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Check, ShoppingCart, Truck, Shield, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/products/:id");
  const id = params?.id || "";
  const { data: product, isLoading } = useFirebaseProduct(id);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (product) {
      addItem(product as any);
      toast({
        title: t("product_detail.product_added"),
        description: `${product.name} ${t("product_detail.added_to_cart_desc")}`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 relative overflow-hidden">
      <div className="bg-noise" />
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="aspect-square glass-card p-12 flex items-center justify-center relative overflow-hidden group rounded-[40px] border-white/10 shadow-[0_0_100px_-20px_hsla(var(--brand-blue)/0.2)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-orange/5 opacity-50 group-hover:opacity-100 transition-opacity" />
              <motion.img 
                key={activeImage || product.imageUrl}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage || product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-normal filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-1">
                <div className="w-12 h-[1px] bg-brand-blue" />
                <div className="w-8 h-[1px] bg-brand-blue/50" />
              </div>
            </div>

            {/* Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(url)}
                    className={cn(
                      "w-20 h-20 rounded-2xl overflow-hidden glass-card p-2 shrink-0 transition-all border-2",
                      (activeImage === url || (!activeImage && index === 0))
                        ? "border-brand-blue shadow-[0_0_15px_rgba(0,225,255,0.3)] animate-pulse-subtle" 
                        : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                    )}
                  >
                    <img src={url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-2">
              <span className="text-brand-blue font-mono uppercase tracking-widest text-sm font-bold bg-brand-blue/10 px-3 py-1 rounded-sm">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 leading-tight uppercase">
              {product.name}
            </h1>
            
            <div className="font-mono text-4xl text-brand-orange font-black tracking-tighter mb-8 flex items-baseline gap-2">
              {(product.price / 100).toLocaleString('en-DZ')} <span className="text-xl">DZD</span>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed border-l-2 border-border pl-4 font-body">
              {product.description}
            </p>

            {/* Works Section */}
            {product.works && product.works.length > 0 && (
              <div className="mb-8">
                <h3 className="text-foreground font-display font-black uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand-blue" /> {t("product_detail.works_available")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.works.map((work, i) => (
                    <span key={i} className="px-4 py-2 bg-muted border border-border rounded-xl text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                {t("product_detail.stock_available")}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-brand-blue" />
                </div>
                {t("product_detail.express_delivery")}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8 bg-muted border border-border p-6 rounded-3xl">
              <h3 className="text-foreground font-bold uppercase mb-4 text-xs tracking-widest">{t("product_detail.specifications")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">{key}</span>
                    <span className="text-foreground text-sm font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-brand-blue text-black py-5 font-display font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(0,225,255,0.3)] active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                {t("product_detail.add_to_cart")}
              </button>
              <button className="px-6 border border-white/20 text-white hover:bg-white hover:text-black transition-colors font-bold uppercase">
                ❤
              </button>
            </div>

          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

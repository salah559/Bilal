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
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-black uppercase tracking-widest">
        {t("products.no_results")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="aspect-square bg-card border border-white/5 rounded-[3rem] p-16 flex items-center justify-center relative overflow-hidden group shadow-2xl shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
              <motion.img 
                key={activeImage || product.imageUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage || product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-2xl brightness-110 relative z-10"
              />
            </div>

            {/* Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(url)}
                    className={cn(
                      "w-24 h-24 rounded-2xl overflow-hidden bg-card border flex-shrink-0 transition-all p-3 hover:border-primary/50",
                      (activeImage === url || (!activeImage && index === 0))
                        ? "border-primary ring-4 ring-primary/10" 
                        : "border-white/5 opacity-60"
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-primary/20">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter uppercase leading-tight">
              {product.name}
            </h1>
            
            <div className="text-5xl text-white font-black tracking-tighter mb-10 flex items-baseline gap-3">
              {(product.price / 100).toLocaleString('en-DZ')} <span className="text-xl text-primary">DZD</span>
            </div>

            <div className="mb-10 space-y-6">
              <h3 className="text-secondary font-bold uppercase tracking-widest text-xs">{t("product_detail.specifications")}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("product_detail.stock_available")}</span>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("product_detail.express_delivery")}</span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="mb-12 grid grid-cols-2 gap-6 bg-card border border-white/5 p-8 rounded-[2rem]">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] mb-1.5">{key}</span>
                  <span className="text-foreground text-sm font-bold">{value as string}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-secondary transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                {t("product_detail.add_to_cart")}
              </button>
            </div>

          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

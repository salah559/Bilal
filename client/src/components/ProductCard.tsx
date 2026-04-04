import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: t("product_detail.product_added"),
      description: `${product.name} ${t("product_detail.added_to_cart_desc")}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative h-full flex flex-col"
    >
      <div className="flex-1 bg-card border border-white/5 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 bg-gradient-to-b from-white/[0.02] to-transparent">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.03] p-10 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
             {product.isFeatured && (
               <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-secondary/20 backdrop-blur-md">
                 {t("product_card.featured")}
               </span>
             )}
          </div>
          
          <motion.img 
            src={(product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-2xl brightness-110"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link href={`/products/${product.id}`}>
              <button className="p-4 bg-white text-brand-dark hover:bg-primary hover:text-white rounded-2xl transition-all shadow-xl hover:scale-110">
                <Eye className="w-5 h-5" />
              </button>
            </Link>
            <button 
              onClick={handleAddToCart}
              className="p-4 bg-primary text-white hover:bg-secondary rounded-2xl transition-all shadow-xl hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col flex-grow">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-2.5 py-1 bg-primary/10 rounded-lg">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{t("product_card.price")}</span>
              <span className="text-2xl font-black text-white tracking-tighter">
                {(product.price / 100).toLocaleString('en-DZ')} <span className="text-xs text-primary ml-1">DZD</span>
              </span>
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
              product.stock > 0 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
            )}>
              {product.stock > 0 ? t("product_card.available") : t("product_card.sold_out")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

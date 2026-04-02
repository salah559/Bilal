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
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full perspective-1000"
    >
      <div className="glass-card h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_0_50px_-10px_hsla(var(--brand-blue)/0.3)] hover:-translate-y-2 border-white/5 active:scale-95">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white/5 p-8">
          <div className="absolute top-2 right-2 z-10">
             {product.isFeatured && (
               <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 shadow-lg shadow-brand-orange/20">
                 {t("product_card.featured")}
               </span>
             )}
          </div>
          
          <motion.img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-normal filter drop-shadow-xl"
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <Link href={`/products/${product.id}`}>
              <button className="p-3 bg-white text-black hover:bg-brand-blue hover:text-white rounded-full transition-colors transform hover:scale-110">
                <Eye className="w-5 h-5" />
              </button>
            </Link>
            <button 
              onClick={handleAddToCart}
              className="p-3 bg-brand-orange text-white hover:bg-white hover:text-brand-orange rounded-full transition-colors transform hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow border-t border-white/5">
          <div className="mb-2">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-display text-lg font-bold text-white leading-tight mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{t("product_card.price")}</span>
              <span className="font-mono text-xl text-brand-orange font-black tracking-tighter">
                {(product.price / 100).toLocaleString('en-DZ')} <span className="text-[10px]">DZD</span>
              </span>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
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

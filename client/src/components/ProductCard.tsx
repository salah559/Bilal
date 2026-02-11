import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full"
    >
      <div className="industrial-border h-full bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_-10px_hsla(var(--brand-blue)/0.3)]">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white/5 p-8">
          <div className="absolute top-2 right-2 z-10">
             {product.isFeatured && (
               <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 shadow-lg shadow-brand-orange/20">
                 Featured
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
            <button className="p-3 bg-brand-orange text-white hover:bg-white hover:text-brand-orange rounded-full transition-colors transform hover:scale-110">
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
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 border-dashed">
            <span className="font-mono text-xl text-brand-orange font-bold">
              {(product.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'DZD' })}
            </span>
            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-sm ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

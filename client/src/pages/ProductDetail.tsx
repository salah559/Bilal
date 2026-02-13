import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Check, ShoppingCart, Truck, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté au panier.`,
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
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-white/5 border border-white/10 p-12 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors" />
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-normal filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            {/* Thumbnails placeholder */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/5 border border-white/10 cursor-pointer hover:border-brand-blue transition-colors" />
              ))}
            </div>
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
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="text-3xl font-mono font-bold text-brand-orange mb-8 flex items-center gap-4">
              {(product.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'DZD' })}
              <span className="text-sm font-sans text-gray-500 font-normal line-through">
                {((product.price * 1.2) / 100).toLocaleString('en-US', { style: 'currency', currency: 'DZD' })}
              </span>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed border-l-2 border-white/20 pl-4">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                Stock Disponible
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-brand-blue" />
                </div>
                Livraison Express
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-brand-orange" />
                </div>
                Garantie 2 Ans
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8 bg-card border border-white/10 p-6">
              <h3 className="text-white font-bold uppercase mb-4 text-sm tracking-wider">Spécifications</h3>
              <div className="grid grid-cols-2 gap-y-2">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase">{key}</span>
                    <span className="text-white text-sm">{value as string}</span>
                  </div>
                ))}
                {/* Fallback specs if empty */}
                {!Object.keys(product.specifications || {}).length && (
                  <>
                    <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase">Poids</span><span className="text-white text-sm">1.5 kg</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase">Matériau</span><span className="text-white text-sm">Acier Inoxydable</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase">Dimensions</span><span className="text-white text-sm">25 x 10 x 5 cm</span></div>
                    <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase">Origine</span><span className="text-white text-sm">Allemagne</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-auto flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-brand-orange text-white py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-brand-orange transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_var(--brand-orange)]"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
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

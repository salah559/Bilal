import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Loader2, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: products, isLoading: productsLoading } = useProducts({
    category: selectedCategory,
    search: searchQuery,
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase mb-4">
            Nos <span className="text-brand-blue">Produits</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Explorez notre catalogue complet d'outils et de matériaux pour tous vos travaux de construction et de rénovation.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 p-6 bg-card border border-white/5 rounded-lg sticky top-24 z-30 shadow-2xl backdrop-blur-md bg-opacity-90">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-white/10 text-white focus:border-brand-blue focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-6 py-3 border whitespace-nowrap uppercase text-sm font-bold tracking-wider transition-colors ${
                !selectedCategory 
                  ? "bg-brand-blue border-brand-blue text-white" 
                  : "bg-transparent border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Tous
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-3 border whitespace-nowrap uppercase text-sm font-bold tracking-wider transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-brand-blue border-brand-blue text-white" 
                    : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
            <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white font-bold mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

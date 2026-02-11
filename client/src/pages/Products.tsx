import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFirebaseProducts, useFirebaseCategories } from "@/hooks/use-firebase-products";
import { Loader2, Search, Filter, Briefcase, Tags, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedProfession, setSelectedProfession] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const { data: products, isLoading: productsLoading } = useFirebaseProducts({
    category: selectedCategory,
    profession: selectedProfession,
    search: searchQuery,
  });
  
  const { data: categories } = useFirebaseCategories();

  const professions = [
    { id: "all", name: "Tous les métiers", icon: Briefcase },
    { id: "electrician", name: "Électricien", icon: Briefcase },
    { id: "plumber", name: "Plombier", icon: Briefcase },
    { id: "painter", name: "Peintre", icon: Briefcase },
    { id: "mason", name: "Maçon", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Modern Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-4"
            >
              <Tags className="w-3 h-3" /> Catalogue Professionnel
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-6">
              Équipez votre <br />
              <span className="text-brand-blue">Excellence</span>
            </h1>
            <p className="text-gray-400 text-lg font-body border-l-2 border-brand-orange pl-6 italic">
              Des milliers de références sélectionnées pour leur robustesse et leur performance sur le terrain.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un outil..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-body"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="p-4 bg-brand-blue text-white rounded-2xl hover:bg-brand-blue/80 transition-all shadow-lg shadow-brand-blue/20 group"
            >
              <Filter className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Profession Filters */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-12 scrollbar-hide">
          {professions.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setSelectedProfession(prof.id === "all" ? undefined : prof.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all whitespace-nowrap font-display text-sm font-bold uppercase tracking-wider",
                (selectedProfession === prof.id || (!selectedProfession && prof.id === "all"))
                  ? "bg-white text-black border-white shadow-xl scale-105"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
              )}
            >
              <prof.icon className="w-4 h-4" />
              {prof.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <Search className="w-20 h-20 text-gray-800 mx-auto mb-6" />
            <h3 className="text-2xl text-white font-display font-bold mb-2 uppercase">Aucun résultat</h3>
            <p className="text-gray-500 font-body">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products?.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Sidebar Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-white/10 z-[101] p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Filtres</h2>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="space-y-12">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-brand-orange uppercase tracking-[0.3em] mb-6">Par Catégorie</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setSelectedCategory(undefined)}
                      className={cn(
                        "text-left px-6 py-4 rounded-xl border transition-all font-display text-sm font-bold uppercase",
                        !selectedCategory ? "bg-brand-blue border-brand-blue text-white" : "bg-white/5 border-white/10 text-gray-400"
                      )}
                    >
                      Toutes les catégories
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          "text-left px-6 py-4 rounded-xl border transition-all font-display text-sm font-bold uppercase",
                          selectedCategory === cat.slug ? "bg-brand-blue border-brand-blue text-white" : "bg-white/5 border-white/10 text-gray-400"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-5 bg-white text-black font-display font-black uppercase tracking-widest rounded-2xl hover:bg-brand-orange hover:text-white transition-all mt-12 shadow-2xl"
                >
                  Appliquer les filtres
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

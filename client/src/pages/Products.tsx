import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFirebaseProducts, useFirebaseCategories, useFirebaseWorks } from "@/hooks/use-firebase-products";
import { Loader2, Search, Filter, Briefcase, Tags, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedWork, setSelectedWork] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const { data: products, isLoading: productsLoading } = useFirebaseProducts({
    category: selectedCategory,
    work: selectedWork,
    search: searchQuery,
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useFirebaseCategories();
  const categories = (categoriesData as any[]) || [];

  const { data: worksData } = useFirebaseWorks();
  const works = (worksData as any[]) || [];

  const filterWorks = [
    { id: "all", name: t("products.all_professions"), icon: Briefcase },
    ...works.map(w => ({ id: w.id, name: w.name, icon: Briefcase }))
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 relative">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Modern Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
            >
              <Tags className="w-4 h-4" /> {t("products.professional_catalog")}
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8">
              {t("products.equip")} <br />
              <span className="text-primary">{t("products.excellence")}</span>
            </h1>
            <p className="text-muted-foreground text-xl border-l-4 border-secondary pl-8 py-2 font-medium italic opacity-80">
              {t("products.thousands_references")}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t("products.search_placeholder")}
                className="w-full pl-14 pr-6 py-5 bg-card border border-white/5 rounded-2xl text-foreground focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="p-5 bg-primary text-white rounded-2xl hover:bg-secondary transition-all shadow-xl shadow-primary/20 group"
            >
              <Filter className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Quick Profession Filters */}
        <div className="flex gap-4 overflow-x-auto pb-8 mb-16 scrollbar-hide">
          {filterWorks.map((work) => (
            <button
              key={work.id}
              onClick={() => setSelectedWork(work.id === "all" ? undefined : work.id)}
              className={cn(
                "flex items-center gap-3 px-8 py-5 rounded-2xl border transition-all whitespace-nowrap text-sm font-bold uppercase tracking-wider",
                (selectedWork === work.id || (!selectedWork && work.id === "all"))
                  ? "bg-primary text-white border-primary shadow-2xl scale-105"
                  : "bg-card border-white/5 text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              <work.icon className="w-5 h-5" />
              {work.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {productsLoading || categoriesLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-card/30">
            <Search className="w-24 h-24 text-muted-foreground/30 mx-auto mb-8" />
            <h3 className="text-3xl text-foreground font-black mb-4 uppercase tracking-tight">{t("products.no_results")}</h3>
            <p className="text-muted-foreground text-lg">{t("products.try_modify_filters")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products?.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-white/5 z-[101] p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">{t("products.filters")}</h2>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-4 hover:bg-white/5 rounded-2xl transition-colors border border-white/5"
                >
                  <X className="w-7 h-7 text-foreground" />
                </button>
              </div>

              <div className="space-y-16">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-[0.3em] mb-8 px-1">
                    {t("products.by_category")}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => setSelectedCategory(undefined)}
                      className={cn(
                        "text-left px-8 py-5 rounded-2xl border transition-all text-sm font-bold uppercase tracking-wide",
                        !selectedCategory ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-card border-white/5 text-muted-foreground hover:border-primary/20 hover:text-primary"
                      )}
                    >
                      {t("products.all_categories")}
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          "text-left px-8 py-5 rounded-2xl border transition-all text-sm font-bold uppercase tracking-wide",
                          selectedCategory === cat.slug ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-card border-white/5 text-muted-foreground hover:border-primary/20 hover:text-primary"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full py-6 bg-white text-brand-dark font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                  >
                    {t("products.apply_filters")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

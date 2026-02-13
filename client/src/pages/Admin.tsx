import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Users,
  Loader2,
  Trash2,
  Edit2,
  X,
  Upload
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  useFirebaseProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useFirebaseCategories,
  type Product
} from "@/hooks/use-firebase-products";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useFirebaseProducts();
  const { data: categories } = useFirebaseCategories();
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "products", label: "Gestion Produits", icon: Package },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Produit supprimé avec succès" });
      } catch (error) {
        toast({ title: "Erreur lors de la suppression", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#1a1c22] border border-white/10 rounded-3xl p-4 sticky top-32">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                      activeTab === item.id 
                        ? "bg-[#00e1ff] text-[#000000] shadow-[0_0_20px_rgba(0,225,255,0.2)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-[#1a1c22] border border-white/10 rounded-3xl p-8 min-h-[600px]">
              {activeTab === "products" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
                      Produits
                    </h1>
                    <button 
                      onClick={() => {
                        setEditingProduct(null);
                        setIsFormOpen(true);
                      }}
                      className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#00e1ff] text-[#000000] font-display text-[10px] font-black uppercase tracking-widest"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Ajouter Produit
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Produit</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prix</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock</th>
                          <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                          <tr><td colSpan={4} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" /></td></tr>
                        ) : products?.map((prod) => (
                          <tr key={prod.id} className="group hover:bg-white/[0.02]">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-lg" />
                                <span className="text-sm font-bold text-white uppercase">{prod.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-sm font-mono text-gray-400">{(prod.price/100).toFixed(2)} DZD</td>
                            <td className="py-4">
                              <span className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-full",
                                prod.stock > 0 ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                              )}>
                                {prod.stock} en stock
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(prod)} className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#1a1c22] border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                  {editingProduct ? "Modifier Produit" : "Ajouter un Produit"}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              <ProductForm 
                product={editingProduct} 
                categories={categories}
                onSuccess={() => setIsFormOpen(false)} 
                mutation={editingProduct ? updateMutation : createMutation}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function ProductForm({ product, categories, onSuccess, mutation }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
      stock: 0,
      isFeatured: false,
      profession: "all"
    }
  });

  const imageUrl = watch("imageUrl");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setValue("imageUrl", data.data.url);
        toast({ title: "Image téléchargée avec succès" });
      }
    } catch (error) {
      toast({ title: "Erreur lors de l'upload", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (product) {
        await mutation.mutateAsync({ id: product.id, data });
      } else {
        await mutation.mutateAsync(data);
      }
      toast({ title: "Succès !" });
      onSuccess();
    } catch (error) {
      toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nom du produit</label>
            <input {...register("name")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Catégorie</label>
            <div className="flex gap-2">
              <select {...register("category")} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none" required>
                <option value="">Sélectionner</option>
                {categories?.map((cat: any) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
              </select>
              <button 
                type="button"
                onClick={async () => {
                  const name = prompt("Nom de la nouvelle catégorie :");
                  if (!name) return;
                  const slug = name.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                    .replace(/[^a-z0-9]/g, '-') // replace non-alphanumeric with -
                    .replace(/-+/g, '-') // collapse multiple -
                    .replace(/^-|-$/g, ''); // trim -
                  try {
                    const { addDoc, collection } = await import("firebase/firestore");
                    await addDoc(collection(db, "categories"), { 
                      name, 
                      slug,
                      imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80" // Default image
                    });
                    toast({ title: "Catégorie ajoutée : " + name });
                    window.location.reload(); 
                  } catch (e: any) {
                    console.error("Firestore Error:", e);
                    toast({ title: "Erreur: " + e.message, variant: "destructive" });
                  }
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-brand-blue hover:bg-white/10"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prix (Cents)</label>
              <input type="number" {...register("price", { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock</label>
              <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none" required />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Image du produit</span>
              </>
            )}
            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea {...register("description")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none h-24 resize-none" required />
          </div>
        </div>
      </div>

      <button 
        disabled={mutation.isPending || isUploading}
        className="w-full py-4 bg-[#00e1ff] text-[#000000] font-display font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all disabled:opacity-50"
      >
        {mutation.isPending ? "Enregistrement..." : "Enregistrer le produit"}
      </button>
    </form>
  );
}

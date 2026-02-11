import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useFirebaseProducts } from "@/hooks/use-firebase-products";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "products", label: "Gestion Produits", icon: Package },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

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
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-[#1a1c22] border border-white/10 rounded-3xl p-8 min-h-[600px]">
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
                      Dashboard
                    </h1>
                    <div className="text-[10px] font-mono text-[#00e1ff] uppercase tracking-widest px-3 py-1 bg-[#00e1ff]/10 rounded-full border border-[#00e1ff]/20">
                      Firebase Connected (Demo)
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Ventes Totales", value: "12,450 DT", color: "text-green-400" },
                      { label: "Nouveaux Produits", value: "24", color: "text-blue-400" },
                      { label: "Visites", value: "1,200", color: "text-purple-400" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className={cn("text-2xl font-display font-black", stat.color)}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-12">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Activité Récente</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white uppercase">Mise à jour stock</p>
                              <p className="text-[10px] text-gray-500 font-mono">ID: PROD-9923 | Il y a 2h</p>
                            </div>
                          </div>
                          <button className="text-[10px] font-bold text-[#00e1ff] uppercase tracking-widest hover:underline">
                            Détails
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "products" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
                      Produits
                    </h1>
                    <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#00e1ff] text-[#000000] font-display text-[10px] font-black uppercase tracking-widest">
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
                        {[
                          { name: "Perceuse Pro", price: "125.00 DT", stock: "15" },
                          { name: "Marteau Industriel", price: "45.00 DT", stock: "42" },
                          { name: "Peinture Lux", price: "32.00 DT", stock: "8" },
                        ].map((prod, i) => (
                          <tr key={i} className="group hover:bg-white/[0.02]">
                            <td className="py-4 text-sm font-bold text-white uppercase">{prod.name}</td>
                            <td className="py-4 text-sm font-mono text-gray-400">{prod.price}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 bg-green-400/10 text-green-400 text-[10px] font-bold rounded-full">
                                {prod.stock} en stock
                              </span>
                            </td>
                            <td className="py-4">
                              <button className="text-[10px] font-bold text-brand-blue uppercase hover:underline">Modifier</button>
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
      <Footer />
    </div>
  );
}

import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  Mail,
  LogOut, 
  Users,
  Loader2,
  Trash2,
  Edit2,
  X,
  Upload,
  ClipboardList,
  Briefcase,
  Truck,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Activity,
  Printer
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from "recharts";
import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useAdminAuth, useUpdateAdminPassword } from "@/hooks/use-admin-auth";
import { 
  useFirebaseProducts, 
  useFirebaseCategories, 
  useFirebaseWorks,
  useCreateWork,
  useDeleteWork,
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  type Product 
} from "@/hooks/use-firebase-products";
import { 
  useOrders, 
  useUpdateOrderStatus, 
  useDeleteOrder,
  ORDER_STATUS_LABELS,
  type Order 
} from "@/hooks/use-orders";
import { 
  useShippingRates, 
  useUpdateShippingRates,
  type ShippingRates 
} from "@/hooks/use-shipping";
import { 
  useMessages, 
  useUpdateMessageStatus, 
  useDeleteMessage, 
  type ContactMessage 
} from "@/hooks/use-messages";
import { useSettings, useUpdateSettings, type GlobalSettings } from "@/hooks/use-settings";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";

export default function Admin() {
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useFirebaseProducts();
  const { data: categories } = useFirebaseCategories();
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const { data: authSettings } = useAdminAuth();
  const updatePasswordMutation = useUpdateAdminPassword();

  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "products", label: "Gestion Produits", icon: Package },
    { id: "works", label: "Gestion Travaux (الوظائف)", icon: Briefcase },
    { id: "orders", label: "Commandes (الطلبات)", icon: ClipboardList },
    { id: "shipping", label: "Livraison (التوصيل)", icon: Truck },
    { id: "messages", label: "Messages (الرسائل)", icon: Mail },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = authSettings?.password || "SHARKSKY";
    if (password === correctPassword) {
      setIsAuthorized(true);
      sessionStorage.setItem("admin_auth", "true");
      toast({ title: "Accès autorisé" });
    } else {
      toast({ 
        title: "Code incorrect", 
        description: "Veuillez vérifier le code d'accès.",
        variant: "destructive" 
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">
              Accès <span className="text-brand-blue">Admin</span>
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Veuillez entrer le code d'accès
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Code d'accès"
              className="w-full bg-muted border border-border rounded-xl px-6 py-4 text-foreground placeholder:text-muted-foreground focus:border-brand-blue outline-none transition-all text-center tracking-[1em] font-black"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full py-4 bg-[#00e1ff] text-[#000000] font-display font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,225,255,0.2)]"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="bg-noise" />
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-3xl p-4 sticky top-32 shadow-xl">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                      activeTab === item.id 
                        ? "bg-[#00e1ff] text-[#000000] shadow-[0_0_20px_rgba(0,225,255,0.2)]" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("admin_auth");
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout') || 'Déconnexion'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-card border border-border rounded-3xl p-8 min-h-[600px] shadow-xl">
              {activeTab === "dashboard" && (
                <DashboardView />
              )}

              {activeTab === "works" && (
                <WorksView />
              )}

              {activeTab === "products" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">
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
                        <tr className="border-b border-border">
                          <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Produit</th>
                          <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prix</th>
                          <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stock</th>
                          <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                          <tr><td colSpan={4} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" /></td></tr>
                        ) : products?.map((prod) => (
                          <tr key={prod.id} className="group hover:bg-white/[0.02]">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                                <span className="text-sm font-bold text-foreground uppercase">{prod.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-sm font-mono text-muted-foreground">{(prod.price/100).toFixed(2)} DZD</td>
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

              {activeTab === "orders" && (
                <OrdersView />
              )}

              {activeTab === "shipping" && (
                <ShippingRatesView />
              )}

              {activeTab === "messages" && (
                <MessagesView />
              )}

              {activeTab === "settings" && (
                <SettingsView />
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
              className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-8 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter">
                  {editingProduct ? "Modifier Produit" : "Ajouter un Produit"}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-muted rounded-full"><X className="w-6 h-6 text-foreground" /></button>
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



function OrdersView() {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const getOrderPrintHTML = (order: Order) => {
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
        <td style="padding: 16px; font-size: 16px; font-weight: 700; color: #0f172a;">${item.name}</td>
        <td style="padding: 16px; text-align: center; font-size: 18px; font-weight: 900; background-color: #f8fafc; color: #0f172a; border-left: 1px solid #e2e8f0; width: 100px;">${item.quantity}</td>
      </tr>
    `).join('');

    return `
      <div class="print-page" style="width: 210mm; height: 296mm; margin: 0 auto; box-sizing: border-box; padding: 40px; display: flex; flex-direction: column; background: #ffffff; color: #0f172a; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0f172a; padding-bottom: 24px; margin-bottom: 32px;">
          <div>
            <h1 style="margin: 0; font-size: 36px; text-transform: uppercase; font-weight: 900; letter-spacing: -1px; color: #0f172a;">COMMANDE BILAL</h1>
            <p style="margin: 8px 0 0; font-size: 16px; color: #475569; font-family: monospace; font-weight: 600;">Réf: ${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; color: #0f172a; border-left: 4px solid #00e1ff; padding-left: 16px; display: inline-block;">Bon de Livraison</h2>
            <p style="margin: 6px 0 0; font-size: 14px; color: #475569; font-weight: 500;">Édité le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} a ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</p>
          </div>
        </div>

        <!-- Customer & Delivery Info -->
        <div style="display: flex; gap: 24px; margin-bottom: 32px;">
          <div style="flex: 1; border: 2px solid #e2e8f0; padding: 24px; border-radius: 16px; background-color: #f8fafc;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="background: #0f172a; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 14px;">1</div>
              <h3 style="margin: 0; font-size: 14px; color: #475569; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Client (الزبون)</h3>
            </div>
            <p style="margin: 0 0 12px; font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase;">${order.customerName}</p>
            <div style="display: inline-block; background: #e2e8f0; padding: 8px 16px; border-radius: 8px;">
              <p style="margin: 0; font-size: 18px; font-family: monospace; font-weight: 900; letter-spacing: 1px; color: #0f172a;">📞 ${order.customerPhone}</p>
            </div>
          </div>
          
          <div style="flex: 1; border: 2px solid #e2e8f0; padding: 24px; border-radius: 16px; background-color: #f8fafc;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="background: #0f172a; color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 14px;">2</div>
              <h3 style="margin: 0; font-size: 14px; color: #475569; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Destination (التوصيل)</h3>
            </div>
            <p style="margin: 0 0 12px; font-size: 22px; font-weight: 900; color: #0f172a;">📍 ${order.customerWilaya}</p>
            <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.5; font-weight: 600;">${order.customerAddress}</p>
          </div>
        </div>

        <!-- Items Table -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="background: #0f172a; width: 12px; height: 12px; border-radius: 50%;"></div>
            <h3 style="margin: 0; font-size: 18px; text-transform: uppercase; font-weight: 900; color: #0f172a; letter-spacing: 1px;">Articles Commandés (المنتجات)</h3>
          </div>
          <div style="border: 2px solid #0f172a; border-radius: 12px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; margin: 0;">
              <thead>
                <tr style="background-color: #0f172a;">
                  <th style="padding: 16px; text-align: left; font-size: 14px; font-weight: 800; text-transform: uppercase; color: #fff; letter-spacing: 1px;">Désignation Produit</th>
                  <th style="padding: 16px; text-align: center; font-size: 14px; font-weight: 800; text-transform: uppercase; color: #fff; letter-spacing: 1px; border-left: 1px solid #334155; width: 80px;">Qté</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total -->
        <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
          <div style="width: 380px; border: 3px solid #0f172a; padding: 24px; border-radius: 16px; text-align: center; background-color: #fff; box-shadow: 8px 8px 0px #00e1ff; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: #00e1ff;"></div>
            <h3 style="margin: 0 0 12px; font-size: 14px; color: #475569; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">Total à Payer (المبلغ الإجمالي)</h3>
            <p style="margin: 0; font-size: 42px; font-weight: 900; color: #0f172a; font-family: monospace; letter-spacing: -1px;">${(order.totalPrice / 100).toFixed(2)} DZD</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: auto; padding-top: 32px; text-align: center;">
          <div style="border-top: 2px dashed #cbd5e1; padding-top: 24px;">
            <p style="margin: 0 0 8px; font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 2px;">MERCI POUR VOTRE CONFIANCE / شكرا لثقتكم</p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 500;">Document généré le ${new Date().toLocaleDateString('fr-FR')} - Application BILAL</p>
          </div>
        </div>
      </div>
    `;
  };

  const executePrint = (html: string) => {
    // 1. Create a container and a unique style element
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container-mount';
    printContainer.innerHTML = html;
    
    const style = document.createElement('style');
    style.id = 'print-styles-mount';
    style.innerHTML = `
      @media print {
        /* Reset and set A4 defaults */
        @page { 
          size: A4 portrait; 
          margin: 0; 
        }
        
        /* Hide everything by default */
        body > * { 
          display: none !important; 
        }
        
        /* Show only our mount point and its children */
        body > #print-container-mount { 
          display: block !important; 
          width: 210mm; 
          margin: 0; 
          padding: 0;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
        }

        #print-container-mount * {
          visibility: visible !important;
        }

        /* Essential formatting for print pages */
        .print-page { 
          page-break-after: always !important; 
          page-break-inside: avoid !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 296mm;
          box-sizing: border-box !important;
          background: white !important;
        }
        .print-page:last-child { 
          page-break-after: auto !important; 
        }
      }
    `;
    
    // 2. Clear any old mounts to be safe
    const oldMount = document.getElementById('print-container-mount');
    if (oldMount) document.body.removeChild(oldMount);
    const oldStyle = document.getElementById('print-styles-mount');
    if (oldStyle) document.head.removeChild(oldStyle);

    // 3. Append new content
    document.head.appendChild(style);
    document.body.appendChild(printContainer);
    
    // 4. Give the browser a moment to process the styles and DOM
    setTimeout(() => {
      window.print();
      
      // 5. Cleanup
      document.body.removeChild(printContainer);
      document.head.removeChild(style);
    }, 150);
  };

  const handlePrintOrder = (order: Order) => {
    executePrint(getOrderPrintHTML(order));
  };

  const handleBulkPrint = () => {
    if (!orders || selectedOrderIds.length === 0) return;
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
    const fullHtml = selectedOrders.map(o => getOrderPrintHTML(o)).join('');
    executePrint(fullHtml);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Voulez-vous vraiment supprimer ${selectedOrderIds.length} commande(s) ?`)) {
      try {
        await Promise.all(selectedOrderIds.map(id => deleteOrderMutation.mutateAsync(id)));
        setSelectedOrderIds([]);
      } catch (error) {
        console.error("Erreur lors de la suppression par lot", error);
      }
    }
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && filteredOrders) {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">
          Commandes (الطلبات)
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:flex-none md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Rechercher nom ou tél..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted border border-border rounded-full pl-11 pr-4 py-2 text-xs font-bold focus:border-brand-blue outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 md:flex-none md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-muted border border-border rounded-full pl-11 pr-4 py-2 text-xs font-bold focus:border-brand-blue outline-none appearance-none cursor-pointer"
            >
              <option value="all">Toutes les étapes</option>
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedOrderIds.length > 0 && (
        <div className="bg-[#00e1ff]/10 border border-[#00e1ff]/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-bold text-[#00e1ff]">
            {selectedOrderIds.length} commande(s) sélectionnée(s)
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleBulkPrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#00e1ff] text-[#000000] rounded-lg font-bold text-xs uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(0,225,255,0.2)]"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button 
              onClick={handleBulkDelete}
              disabled={deleteOrderMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {deleteOrderMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={!!(filteredOrders && filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length)}
                  onChange={handleSelectAll}
                  className="rounded border-border cursor-pointer w-4 h-4"
                />
              </th>
              <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client / Contact</th>
              <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Items</th>
              <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</th>
              <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Statut</th>
              <th className="pb-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">{t('admin_orders.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" /></td></tr>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-muted/50 transition-colors">
                  <td className="py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-border cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground uppercase">{order.customerName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{order.customerPhone}</span>
                      <span className="text-[10px] text-muted-foreground/80 italic mt-1 font-body">{order.customerWilaya} - {order.customerAddress}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-sm font-mono text-muted-foreground font-bold">{(order.totalPrice / 100).toFixed(2)} DZD</td>
                  <td className="py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ orderId: order.id, status: e.target.value as any })}
                      className={cn(
                        "bg-muted border border-border rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-blue transition-colors",
                        order.status === 'pending' && "text-brand-orange border-brand-orange/30",
                        order.status === 'confirmed' && "text-blue-400 border-blue-400/30",
                        order.status === 'delivered' && "text-green-400 border-green-400/30"
                      )}
                    >
                      {Object.entries(ORDER_STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val} className="bg-card text-foreground">
                          {label} ({val})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handlePrintOrder(order)}
                      className="p-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-all"
                      title={t('admin_orders.print')}
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(t('admin_orders.delete_confirm'))) {
                          deleteOrderMutation.mutate(order.id);
                        }
                      }}
                      disabled={deleteOrderMutation.isPending}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title={t('admin_orders.delete')}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <ClipboardList className="w-8 h-8" />
                    <span className="text-xs font-bold uppercase tracking-widest">Aucune commande trouvée</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onSuccess, mutation }: any) {
  const { data: worksData } = useFirebaseWorks();
  const dynamicWorks = (worksData as any[]) || [];
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
      profession: "all",
      works: []
    }
  });

  const works = watch("works") || [];

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
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nom du produit</label>
            <input {...register("name")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-body" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Catégorie</label>
            <div className="flex gap-2">
              <select {...register("category")} className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-body appearance-none" required>
                <option value="">Sélectionner</option>
                {categories?.map((cat: any) => <option key={cat.id} value={cat.slug} className="bg-card text-foreground">{cat.name}</option>)}
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
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prix (Cents)</label>
              <input type="number" {...register("price", { valueAsNumber: true })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-mono" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stock</label>
              <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-mono" required />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Les travaux (الأعمال الممكنة)</label>
            <div className="flex flex-wrap gap-2">
              {dynamicWorks.length > 0 ? (
                dynamicWorks.map((work) => {
                  const isSelected = works.includes(work.id);
                  return (
                    <button
                      key={work.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setValue("works", works.filter((w: string) => w !== work.id));
                        } else {
                          setValue("works", [...works, work.id]);
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                        isSelected 
                          ? "bg-brand-blue border-brand-blue text-white shadow-[0_0_15px_rgba(0,225,255,0.3)]" 
                          : "bg-muted border-border text-muted-foreground hover:border-brand-blue/50"
                      )}
                    >
                      {work.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-[10px] text-muted-foreground italic">Aucun عمل défini. Ajoutez-en dans l'onglet Gestion Travaux.</p>
              )}
            </div>
            {works.length === 0 && dynamicWorks.length > 0 && (
              <p className="text-[9px] text-brand-orange mt-2 font-bold uppercase tracking-widest">Veuillez sélectionner au moins un عمل</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-video bg-muted border border-border rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 group">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-brand-blue transition-colors" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Image du produit</span>
              </>
            )}
            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>}
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</label>
            <textarea {...register("description")} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none h-24 resize-none font-body" required />
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

function ShippingRatesView() {
  const { data: currentRates, isLoading } = useShippingRates();
  const updateMutation = useUpdateShippingRates();
  const [localRates, setLocalRates] = useState<ShippingRates>({});

  const ALGERIA_WILAYAS = [
    "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
    "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
    "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
    "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
    "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
    "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
    "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès", 
    "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
    "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
    "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaa",
    "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", "55 - Touggourt",
    "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
  ];

  // Initialize local rates when data is loaded
  useState(() => {
    if (currentRates) setLocalRates(currentRates);
  });

  // Since we are using useState's initializer, we also need an effect if the data arrives late
  useEffect(() => {
    if (currentRates && Object.keys(localRates).length === 0) {
      setLocalRates(currentRates);
    }
  }, [currentRates]);

  const handleSave = async () => {
    try {
      console.log("Saving Shipping Rates to Firestore:", localRates);
      
      // Clean data: Ensure no NaN or non-numeric values
      const cleanedRates: ShippingRates = {};
      Object.entries(localRates).forEach(([key, value]) => {
        if (!isNaN(value) && typeof value === 'number') {
          cleanedRates[key] = value;
        }
      });

      await updateMutation.mutateAsync(cleanedRates);
      toast({ title: "Tarifs mis à jour successfully !" });
    } catch (e: any) {
      console.error("Firestore Save Error Details:", e);
      // Log specific error message to help the user
      const msg = e?.message || "Erreur inconnue";
      toast({ 
        title: "Erreur lors de la sauvegarde", 
        description: `Détail: ${msg}. Vérifiez vos 'Firestore Rules'.`,
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">
          Tarifs de Livraison (أسعار التوصيل)
        </h1>
        <button 
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#00e1ff] text-[#000000] font-display text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
          Enregistrer (حفظ)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGERIA_WILAYAS.map(wilaya => (
          <div key={wilaya} className="bg-muted/30 border border-border p-4 rounded-2xl flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{wilaya}</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={(localRates[wilaya] || 0) / 100}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLocalRates(prev => ({ 
                    ...prev, 
                    [wilaya]: val * 100 
                  }));
                }}
                placeholder="0.00"
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-foreground focus:border-brand-blue outline-none font-mono text-sm"
              />
              <span className="text-[10px] font-bold text-muted-foreground">DZD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView() {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useOrders();
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [dailyVisitsMap, setDailyVisitsMap] = useState<Record<string, number>>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Fetch visitor stats
  useEffect(() => {
    const statsRef = doc(db, "settings", "stats");
    const unsubscribeTotal = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setTotalVisits(doc.data().totalVisits || 0);
      }
    });

    const daysRef = collection(db, "settings", "stats", "days");
    const unsubscribeDays = onSnapshot(daysRef, (snapshot) => {
      const visitsData: Record<string, number> = {};
      snapshot.forEach(doc => {
        visitsData[doc.id] = doc.data().visits || 0;
      });
      setDailyVisitsMap(visitsData);
    });

    return () => {
      unsubscribeTotal();
      unsubscribeDays();
    };
  }, []);

  // Color Palette for Charts
  const COLORS = ['#00e1ff', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#64748b'];

  const stats = useMemo(() => {
    if (!orders) return null;

    // Filter orders to exclude pending and cancelled for revenue
    const activeOrders = orders.filter(o => o.status !== 'pending' && o.status !== 'cancelled');
    
    // Status specific counts
    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const shippedCount = orders.filter(o => o.status === 'shipped').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;

    // Daily stats
    const now = new Date();
    const todayOrders = activeOrders.filter(o => {
      const date = o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt instanceof Date ? o.createdAt : new Date());
      return date.getDate() === now.getDate() && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    });
    const todayRevenue = todayOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    const totalRevenue = activeOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
    
    // Group monthly revenue - Filter by Current Year
    const currentYear = new Date().getFullYear();
    const monthNames = [
      t('admin_stats.jan'), t('admin_stats.feb'), t('admin_stats.mar'), t('admin_stats.apr'),
      t('admin_stats.may'), t('admin_stats.jun'), t('admin_stats.jul'), t('admin_stats.aug'),
      t('admin_stats.sep'), t('admin_stats.oct'), t('admin_stats.nov'), t('admin_stats.dec')
    ];

    const monthlyRevenue = monthNames.map((name, index) => {
      const monthOrders = activeOrders.filter(o => {
        const date = o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt instanceof Date ? o.createdAt : new Date());
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });
      return {
        name,
        revenue: monthOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0) / 100
      };
    });

    // Group by status
    const statusCounts = Object.keys(ORDER_STATUS_LABELS).reduce((acc, statusKey) => {
      const statusLabel = ORDER_STATUS_LABELS[statusKey as keyof typeof ORDER_STATUS_LABELS];
      acc[statusLabel] = orders.filter(o => o.status === statusKey).length;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Daily report for selected month/year
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dailyReport = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayOrders = activeOrders.filter(o => {
        const date = o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt instanceof Date ? o.createdAt : new Date());
        return date.getDate() === day && date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      });

      return {
        dateStr,
        day: String(day).padStart(2, '0'),
        revenue: dayOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0) / 100,
        visits: dailyVisitsMap[dateStr] || 0
      };
    });

    return {
      totalRevenue: totalRevenue / 100,
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      avgOrderValue: avgOrderValue / 100,
      monthlyRevenue,
      statusData,
      dailyReport,
      counts: {
        confirmed: confirmedCount,
        shipped: shippedCount,
        delivered: deliveredCount,
        processing: processingCount
      },
      today: {
        revenue: todayRevenue / 100,
        orders: todayOrders.length
      }
    };
  }, [orders, t, selectedMonth, selectedYear, dailyVisitsMap]);

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-brand-blue" /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-12">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('admin_stats.today_revenue'), value: `${stats.today.revenue.toLocaleString()} DZD`, icon: DollarSign, color: "text-brand-blue" },
          { label: t('admin_stats.total_revenue'), value: `${stats.totalRevenue.toLocaleString()} DZD`, icon: Activity, color: "text-purple-400" },
          { label: t('admin_stats.total_visitors'), value: totalVisits.toLocaleString(), icon: Users, color: "text-brand-orange" },
          { label: t('admin_stats.total_orders'), value: stats.totalOrders, icon: ShoppingBag, color: "text-green-400" },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-white/5", metric.color)}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</h4>
            <div className="text-2xl font-display font-black text-foreground group-hover:text-brand-blue transition-colors">
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sub-Metric Cards for Statuses */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('admin_stats.confirmed_orders'), value: stats.counts.confirmed, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400" },
          { label: t('admin_stats.processing_orders'), value: stats.counts.processing, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400" },
          { label: t('admin_stats.shipped_orders'), value: stats.counts.shipped, color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400" },
          { label: t('admin_stats.delivered_orders'), value: stats.counts.delivered, color: "from-green-500/20 to-green-600/5", iconColor: "text-green-400" },
        ].map((met, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.05) }}
            className={cn("p-4 rounded-2xl border border-white/5 bg-gradient-to-br flex flex-col items-center justify-center text-center", met.color)}
          >
             <span className={cn("text-xs font-bold mb-1 opacity-80 uppercase tracking-tighter", met.iconColor)}>{met.label}</span>
             <span className="text-2xl font-black">{met.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Report Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-8 rounded-[36px] flex flex-col"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-blue" />
              {t('admin_stats.daily_report')}
            </h3>
            <div className="flex gap-2">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-muted border border-border rounded-xl px-4 py-2 text-xs font-bold focus:border-brand-blue outline-none cursor-pointer text-foreground"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('fr-FR', { month: 'long' }).toUpperCase()}
                  </option>
                ))}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-muted border border-border rounded-xl px-4 py-2 text-xs font-bold focus:border-brand-blue outline-none cursor-pointer text-foreground"
              >
                {[...Array(5)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyReport}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e1ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e1ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1c22', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area yAxisId="left" type="monotone" name={t('admin_stats.revenue')} dataKey="revenue" stroke="#00e1ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area yAxisId="right" type="step" name={t('admin_stats.visits')} dataKey="visits" stroke="#f97316" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-8 rounded-[36px]"
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-orange" />
              {t('admin_stats.status_distribution')}
          </h3>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1c22', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="grid grid-cols-1 gap-2 mt-4 w-full">
               {stats.statusData.map((item, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase truncate">{item.name}</span>
                   <span className="text-[10px] font-mono text-foreground ml-auto">{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function WorksView() {
  const { data: works, isLoading } = useFirebaseWorks();
  const createMutation = useCreateWork();
  const deleteMutation = useDeleteWork();
  const [newName, setNewName] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await createMutation.mutateAsync({ name: newName });
      setNewName("");
      toast({ title: "Travail ajouté successfully" });
    } catch {
      toast({ title: "Erreur lors de l'ajout", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce travail ? Cela n'affectera pas les produits existants mais ils n'auront plus ce tag.")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Travail supprimé" });
    } catch {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">
          Gestion des Travaux (إدارة الأعمال)
        </h1>
      </div>

      <div className="bg-muted/30 border border-border p-8 rounded-3xl space-y-6">
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Ajouter un nouveau travail</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: الكهرباء" 
              className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none"
            />
            <button 
              onClick={handleAdd}
              disabled={createMutation.isPending}
              className="px-6 bg-brand-blue text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-blue/80 disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Liste des travaux actuels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works?.map((work: any) => (
              <div key={work.id} className="bg-card border border-border px-4 py-3 rounded-xl flex items-center justify-between group">
                <span className="font-bold text-sm">{work.name}</span>
                <button 
                  onClick={() => handleDelete(work.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {works?.length === 0 && (
              <p className="text-muted-foreground text-xs italic">Aucun travail défini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const { t } = useTranslation();
  
  const updatePasswordMutation = useUpdateAdminPassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: globalSettings, isLoading } = useSettings();
  const updateGlobalMutation = useUpdateSettings();
  const [settingsForm, setSettingsForm] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    if (globalSettings && !settingsForm) {
      setSettingsForm(globalSettings);
    }
  }, [globalSettings]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: t('admin_settings.mismatch_error'), variant: "destructive" });
      return;
    }
    try {
      await updatePasswordMutation.mutateAsync(newPassword);
      toast({ title: t('admin_settings.save_success') });
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast({ title: t('admin_settings.save_error'), variant: "destructive" });
    }
  };

  const handleUpdateGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await updateGlobalMutation.mutateAsync(settingsForm);
      toast({ title: "Paramètres mis à jour", description: "Les informations ont été sauvegardées." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Auth Settings */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">Sécurité</h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{t('admin_settings.change_password')}</p>
        </div>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t('admin_settings.new_password')}</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t('admin_settings.placeholder')} className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:border-brand-blue outline-none" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t('admin_settings.confirm_password')}</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('admin_settings.placeholder')} className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:border-brand-blue outline-none" required />
          </div>
          <button type="submit" disabled={updatePasswordMutation.isPending} className="w-full py-3 bg-brand-orange text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white hover:text-brand-orange transition-all disabled:opacity-50">
            {updatePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Changer le code"}
          </button>
        </form>
      </div>

      {/* Global Information Settings */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tighter">Site Public</h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Informations Générales</p>
        </div>
        {isLoading || !settingsForm ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>
        ) : (
          <form onSubmit={handleUpdateGlobalSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Téléphone</label>
                <input value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Email</label>
                <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none" required />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Adresse</label>
              <input value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Horaires</label>
              <input value={settingsForm.hours} onChange={e => setSettingsForm({...settingsForm, hours: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Facebook URL</label>
              <input value={settingsForm.facebookUrl} onChange={e => setSettingsForm({...settingsForm, facebookUrl: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Iframe Maps</label>
              <textarea rows={2} value={settingsForm.mapIframeUrl} onChange={e => setSettingsForm({...settingsForm, mapIframeUrl: e.target.value})} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:border-brand-blue outline-none font-mono" required />
            </div>
            <button type="submit" disabled={updateGlobalMutation.isPending} className="w-full py-3 bg-[#00e1ff] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50">
              {updateGlobalMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sauvegarder"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function MessagesView() {
  const { data: messages, isLoading } = useMessages();
  const updateStatusMutation = useUpdateMessageStatus();
  const deleteMutation = useDeleteMessage();
  const [filter, setFilter] = useState("all");

  const filteredMsgs = messages?.filter(m => filter === "all" || m.status === filter);

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-display font-black text-foreground uppercase tracking-tighter">Boîte de Réception</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-muted border border-border rounded-xl px-4 py-2 text-xs font-bold text-foreground outline-none cursor-pointer">
          <option value="all">Tous les messages</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMsgs?.map(msg => (
          <div key={msg.id} className={cn("p-6 rounded-2xl border transition-colors relative", msg.status === 'unread' ? "bg-brand-blue/5 border-brand-blue/30" : "bg-card border-border")}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-foreground text-lg">{msg.subject}</h3>
                <div className="flex gap-4 text-xs mt-1">
                  <span className="text-muted-foreground font-mono">{msg.name}</span>
                  <span className="text-brand-orange font-bold">{msg.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateStatusMutation.mutate({ id: msg.id, status: msg.status === 'read' ? 'unread' : 'read' })} 
                  className={cn("px-3 py-1 text-[10px] font-bold uppercase rounded-full border transition-colors", msg.status === 'unread' ? "border-brand-blue text-brand-blue hover:bg-brand-blue/10" : "border-border text-muted-foreground hover:bg-muted")}
                >
                  {msg.status === 'read' ? 'Marquer non lu' : 'Marquer comme lu'}
                </button>
                <button 
                  onClick={() => { if(confirm("Supprimer?")) deleteMutation.mutate(msg.id); }} 
                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/80 font-body leading-relaxed max-w-4xl whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {filteredMsgs?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucun message trouvé</div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowLeft, Send, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useShippingRates } from "@/hooks/use-shipping";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import algeriaCities from "@/lib/algeria_cities.json";

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

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { items, totalPrice: cartTotalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const createOrderMutation = useCreateOrder();
  const { data: shippingRates } = useShippingRates();
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerWilaya: "",
      customerAddress: ""
    }
  });

  const selectedWilaya = watch("customerWilaya");

  useEffect(() => {
    if (selectedWilaya && shippingRates) {
      setShippingCost(shippingRates[selectedWilaya] || 0);
    } else {
      setShippingCost(0);
    }
  }, [selectedWilaya, shippingRates]);

  const communesList = useMemo(() => {
    if (!selectedWilaya) return [];
    const code = selectedWilaya.split(" - ")[0];
    return algeriaCities.filter((c: any) => c.wilaya_code === code).sort((a: any, b: any) => i18n.language === 'ar' ? a.commune_name.localeCompare(b.commune_name) : a.commune_name_ascii.localeCompare(b.commune_name_ascii));
  }, [selectedWilaya, i18n.language]);

  const finalTotalPrice = cartTotalPrice + shippingCost;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">{t('nav.cart')} {t('home.view_all').toLowerCase()}</h2>
        <button 
          onClick={() => setLocation("/products")}
          className="flex items-center gap-2 px-6 py-3 bg-[#00e1ff] text-black rounded-full font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('hero.cta_catalog')}
        </button>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      console.log("Submitting Order Data:", {
        ...data,
        items: orderItems,
        totalPrice: finalTotalPrice
      });

      await createOrderMutation.mutateAsync({
        ...data,
        items: orderItems,
        totalPrice: finalTotalPrice,
        shippingCost // Optional: for record keeping
      });

      setIsSuccess(true);
      clearCart();
      toast({ title: t('checkout.success') });
    } catch (error: any) {
      console.error("Order Submission Detail Error:", error);
      
      let errorMessage = "Une erreur inconnue est survenue";
      if (error?.code === 'permission-denied') {
        errorMessage = "خطأ في الصلاحيات (Permission Denied). يرجى التأكد من إعدادات Firestore Rules لتسمح بالكتابة.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({ 
        title: "حدث خطأ أثناء الطلب", 
        description: errorMessage,
        variant: "destructive" 
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/10 border border-green-500/20 p-12 rounded-[40px] flex flex-col items-center"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 text-foreground">
            {t('checkout.success')}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md font-body">
            {t('i18n.language' === 'ar' ? '' : '')}
            {i18n.language === 'ar' 
              ? "تم استلام طلبك بنجاح. سنقوم بالاتصال بك قريباً لتأكيد التوصيل."
              : "Nous avons bien reçu votre commande. Nous vous contacterons bientôt pour confirmer la livraison."}
          </p>
          <button 
            onClick={() => setLocation("/")}
            className="px-8 py-4 bg-[#00e1ff] text-black rounded-full font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105"
          >
            {t('nav.home')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tighter mb-8">
              {t('checkout.title')}
            </h2>
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xl">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex gap-4">
                    <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-lg" alt={item.name} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground uppercase">{item.name}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center bg-white/5 rounded-full border border-white/10 px-2 py-0.5">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-brand-orange transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-brand-blue transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground font-bold">
                    {((item.price * item.quantity) / 100).toFixed(2)} DZD
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.subtotal')}</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {(cartTotalPrice / 100).toFixed(2)} DZD
                </span>
              </div>

              {shippingCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.shipping')} ({selectedWilaya.split(' - ')[1]})</span>
                  <span className="text-sm font-mono text-brand-blue font-bold">
                    {(shippingCost / 100).toFixed(2)} DZD
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-lg font-display font-black text-foreground uppercase tracking-tighter">{t('checkout.total')}</span>
                <span className="text-2xl font-mono text-brand-blue font-black">
                  {(finalTotalPrice / 100).toFixed(2)} DZD
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="order-1 lg:order-2">
            <h2 className={cn("text-2xl font-display font-black text-foreground uppercase tracking-tighter mb-8", i18n.language === 'ar' ? "text-right" : "text-left")}>
              {i18n.language === 'ar' ? "معلومات التوصيل" : "Informations de livraison"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={cn("text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2", i18n.language === 'ar' ? "text-right" : "text-left")}>{t('checkout.full_name')}</label>
                  <input 
                    {...register("customerName", { required: true })} 
                    className={cn("w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-body", i18n.language === 'ar' && "text-right")} 
                  />
                  {errors.customerName && <span className="text-red-500 text-[10px] uppercase font-bold">Requis</span>}
                </div>
                
                <div>
                  <label className={cn("text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2", i18n.language === 'ar' ? "text-right" : "text-left")}>{t('checkout.phone')}</label>
                  <input 
                    {...register("customerPhone", { required: true })} 
                    className={cn("w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-mono", i18n.language === 'ar' && "text-right")} 
                    placeholder="05 / 06 / 07 ..."
                  />
                  {errors.customerPhone && <span className="text-red-500 text-[10px] uppercase font-bold">Requis</span>}
                </div>

                <div>
                  <label className={cn("text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2", i18n.language === 'ar' ? "text-right" : "text-left")}>{t('checkout.wilaya')}</label>
                  <select 
                    {...register("customerWilaya", { required: true })} 
                    className={cn("w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-body appearance-none", i18n.language === 'ar' && "text-right")}
                  >
                    <option value="">Sélectionner</option>
                    {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.customerWilaya && <span className="text-red-500 text-[10px] uppercase font-bold">Requis</span>}
                </div>

                <div>
                  <label className={cn("text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2", i18n.language === 'ar' ? "text-right" : "text-left")}>{t('checkout.address')}</label>
                  <select 
                    {...register("customerAddress", { required: true })} 
                    className={cn("w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:border-brand-blue outline-none font-body appearance-none", i18n.language === 'ar' && "text-right", !selectedWilaya && "opacity-50")}
                    disabled={!selectedWilaya}
                  >
                    <option value="">Sélectionner</option>
                    {communesList.map((c: any) => (
                       <option key={c.id} value={c.commune_name + " / " + c.commune_name_ascii} className="bg-card text-foreground">
                         {i18n.language === 'ar' ? c.commune_name : c.commune_name_ascii}
                       </option>
                    ))}
                  </select>
                  {errors.customerAddress && <span className="text-red-500 text-[10px] uppercase font-bold">Requis</span>}
                </div>
              </div>

              <button 
                disabled={createOrderMutation.isPending}
                className="w-full py-5 bg-[#00e1ff] text-black font-display font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,225,255,0.2)]"
              >
                {createOrderMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('checkout.confirm')}
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

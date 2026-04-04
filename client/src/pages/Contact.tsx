import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import { useCreateMessage } from "@/hooks/use-messages";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const { data: settings, isLoading } = useSettings();
  const createMutation = useCreateMessage();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const contactInfos = settings ? [
    { icon: MapPin, title: t("contact.address"), text: settings.address },
    { icon: Phone, title: t("contact.phone"), text: settings.phone },
    { icon: Mail, title: t("contact.email"), text: settings.email },
    { icon: Clock, title: t("contact.hours"), text: settings.hours },
    { icon: Facebook, title: "Facebook", text: t("contact.visit_page"), href: settings.facebookUrl },
  ] : [];

  return (
    <div className="min-h-screen text-foreground pt-24">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white uppercase mb-4">
            {t("contact.contact")} <span className="text-brand-orange">{t("contact.us")}</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-white/10 p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-bl-full -mr-12 -mt-12"></div>
            
            <h3 className="text-2xl font-display font-bold text-white mb-8 uppercase">{t("contact.send_message")}</h3>
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full space-y-4">
                 <CheckCircle2 className="w-16 h-16 text-brand-orange" />
                 <h4 className="text-2xl font-display font-bold text-white uppercase mt-4">{t("contact.message_sent")}</h4>
                 <p className="text-gray-400">{t("contact.reply_soon")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">{t("contact.name")}</label>
                    <input {...register("name", { required: true })} type="text" className={cn("w-full bg-background border p-3 text-white focus:border-brand-blue outline-none transition-colors", errors.name ? "border-red-500" : "border-white/10")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">{t("contact.email")}</label>
                    <input {...register("email", { required: true })} type="email" className={cn("w-full bg-background border p-3 text-white focus:border-brand-blue outline-none transition-colors", errors.email ? "border-red-500" : "border-white/10")} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">{t("contact.subject")}</label>
                  <select {...register("subject")} className="w-full bg-background border border-white/10 p-3 text-white focus:border-brand-blue outline-none transition-colors appearance-none">
                    <option>{t("contact.quote_request")}</option>
                    <option>{t("contact.product_info")}</option>
                    <option>{t("contact.after_sales")}</option>
                    <option>{t("contact.other")}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">{t("contact.message")}</label>
                  <textarea {...register("content", { required: true })} rows={5} className={cn("w-full bg-background border p-3 text-white focus:border-brand-blue outline-none transition-colors", errors.content ? "border-red-500" : "border-white/10")}></textarea>
                </div>

                <button type="submit" disabled={createMutation.isPending} className="w-full py-4 bg-brand-blue text-white font-bold uppercase tracking-wider hover:bg-white hover:text-brand-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> {t("contact.submit")}</>}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-blue" /></div>
              ) : contactInfos.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-white/5 border border-white/10 p-6 flex flex-col items-center text-center hover:border-brand-orange transition-colors group relative overflow-hidden"
                >
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />
                  ) : null}
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/10">
                    <item.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h4 className="text-white font-bold uppercase text-sm mb-2">{item.title}</h4>
                  <p className={cn("text-gray-400 text-sm", item.href && "group-hover:text-brand-orange transition-colors")}>{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-64 w-full bg-gray-800 border border-white/10 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
            >
              {settings?.mapIframeUrl ? (
                <iframe 
                  src={settings.mapIframeUrl}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Localisation Google Maps"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>
              )}
              <div className="absolute top-4 left-4 bg-background/90 p-2 px-4 border border-white/10 pointer-events-none">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{t("contact.our_location")}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

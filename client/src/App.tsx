import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Checkout from "@/pages/Checkout";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { ThemeProvider } from "next-themes";
import { db } from "./lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

// Scroll to top on route change
function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Visitor Tracking
function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      const hasVisited = sessionStorage.getItem("v1_visited");
      if (!hasVisited) {
        try {
          const now = new Date();
          const dateId = now.toISOString().split('T')[0];
          const statsRef = doc(db, "settings", "stats");
          const dailyRef = doc(db, "settings", "stats", "days", dateId);

          await setDoc(statsRef, { totalVisits: increment(1) }, { merge: true });
          await setDoc(dailyRef, { visits: increment(1) }, { merge: true });

          sessionStorage.setItem("v1_visited", "true");
        } catch (error) {
          console.error("Error tracking visit:", error);
        }
      }
    };
    trackVisit();
  }, []);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <VisitorTracker />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

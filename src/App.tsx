import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import CuisinePage from "@/pages/CuisinePageNew";
import ArtPage from "@/pages/ArtPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentPage from "@/pages/PaymentPage";
import ProfilePage from "@/pages/ProfilePage";
import UserProfile from "@/pages/UserProfile";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import { usePreloadData, useBackgroundPreload, useUserDataPreload } from "@/hooks/usePreloadData";
import { useCartSync, useCartPersistence } from "@/hooks/useCartSync";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes par défaut
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  // Précharger les données essentielles
  usePreloadData();
  // Précharger les données en arrière-plan
  useBackgroundPreload();
  // Précharger les données utilisateur après connexion
  useUserDataPreload();
  // Synchroniser le panier local avec l'API
  useCartSync();
  // Gérer la persistance du panier local
  useCartPersistence();

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cuisine" element={<CuisinePage />} />
              <Route path="/art" element={<ArtPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

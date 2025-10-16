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
import ArtGalleryPage from "@/pages/ArtGalleryPage";
import ArtistProfilePage from "@/pages/ArtistProfilePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentPage from "@/pages/PaymentPage";
import ProfilePage from "@/pages/ProfilePage";
import UserProfile from "@/pages/UserProfile";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import { usePreloadData } from "@/hooks/usePreloadData";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseDebug } from "@/components/SupabaseDebug";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: false
    }
  }
});

const AppContent = () => {
  usePreloadData();
  useCartSync();

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <SupabaseDebug />
            <Header />
            <main className="flex-1">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cuisine" element={<CuisinePage />} />
              <Route path="/art" element={<ArtPage />} />
              <Route path="/artists" element={<ArtGalleryPage />} />
              <Route path="/artists/:id" element={<ArtistProfilePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/payment/callback" element={<PaymentPage />} />
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

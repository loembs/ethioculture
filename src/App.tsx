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
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ConceptStorePage from "@/pages/ConceptStorePage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePreloadData } from "@/hooks/usePreloadData";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthProvider } from "@/contexts/AuthContext";
import { startSessionMonitoring } from "@/utils/sessionManager";
import { forceCleanupOnStart, disableBrowserCache, startPeriodicCleanup, checkAndRepairLocalStorage } from "@/utils/forceClearCache";
import { setupProductionLogging } from "@/utils/security";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";

// NETTOYAGE AGRESSIF DU CACHE AU DÉMARRAGE
if (typeof window !== 'undefined') {
  checkAndRepairLocalStorage();
  forceCleanupOnStart();
  disableBrowserCache();
  startPeriodicCleanup();
  setupProductionLogging(); // Désactiver les logs sensibles en production
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 secondes au lieu de 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes au lieu de 30 minutes
      retry: 1, // 1 essai au lieu de 2
      retryDelay: 500,
      refetchOnWindowFocus: true, // Recharger quand on revient sur la page
      refetchOnReconnect: true, // Recharger quand internet revient
      refetchOnMount: true // Toujours recharger au montage
    }
  }
});

const AppContent = () => {
  usePreloadData();
  useCartSync();

  // Démarrer la surveillance de session
  useEffect(() => {
    startSessionMonitoring();
    
    return () => {
      // Nettoyer à la fermeture
      import('@/utils/sessionManager').then(({ stopSessionMonitoring }) => {
        stopSessionMonitoring();
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/admin/*" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cuisine" element={<CuisinePage />} />
              <Route path="/art" element={<ArtPage />} />
              <Route path="/concept-store" element={<ConceptStorePage />} />
              <Route path="/artists" element={<ArtGalleryPage />} />
              <Route path="/artists/:id" element={<ArtistProfilePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Panier accessible sans connexion */}
              <Route path="/cart" element={<CartPage />} />
              
              {/* Routes protégées - nécessitent une connexion */}
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/payment/callback" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
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
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;

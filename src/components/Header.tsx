import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogIn, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartManager } from "@/hooks/useCart";
import { authService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { CurrencySelector } from "./CurrencySelector";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CacheClearButton } from "./CacheClearButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { cartItemCount, isLoading: cartLoading } = useCartManager();
  const { user, isAuthenticated: isLoggedIn } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      // Rediriger vers la page d'accueil
      navigate('/', { replace: true });
      // Recharger la page pour mettre à jour l'état
      window.location.reload();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Cuisine", path: "/cuisine" },
    { name: "Art & Culture", path: "/art" },
    { name: "Concept Store", path: "/concept-store" },
    ...(isAdmin ? [{ name: "Dashboard", path: "/admin", icon: BarChart3 }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
          {/* Logo - Gauche */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img 
                src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758210753/Geeza_Logo_lwpeuv.png" 
                alt="Geeza Culture Logo" 
                className="h-10 sm:h-12 lg:h-16 w-auto transition-transform group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Navigation Centrée */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1 bg-gray-50/50 rounded-full p-1 backdrop-blur-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      isActive(item.path) 
                        ? "text-white bg-ethiopian-gold shadow-lg transform scale-105" 
                        : "text-gray-700 hover:text-ethiopian-gold hover:bg-white/50"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                    {isActive(item.path) && (
                      <div className="absolute inset-0 rounded-full bg-ethiopian-gold -z-10 animate-pulse opacity-20" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Currency Selector */}
            <div className="hidden md:block">
              <CurrencySelector />
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="sm" className="relative p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 group-hover:text-ethiopian-gold transition-colors" />
                {cartLoading ? (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-gray-300 rounded-full animate-pulse" />
                ) : cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-ethiopian-gold text-black font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 hover:bg-gray-100 flex items-center gap-2">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                      <AvatarFallback className="bg-ethiopian-gold text-black text-xs font-semibold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-lg border-0 bg-white/95 backdrop-blur-md">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center px-3 py-2 text-sm">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center px-3 py-2 text-sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mes Commandes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <div className="px-2 py-2">
                    <CacheClearButton />
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  size="sm" 
                  className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-sm text-xs sm:text-sm"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Connexion</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 sm:py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-md animate-fade-in">
            <nav className="flex flex-col space-y-1 sm:space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base flex items-center gap-2 ${
                      isActive(item.path) 
                        ? "text-white bg-ethiopian-gold shadow-md transform scale-105" 
                        : "text-gray-700 hover:text-ethiopian-gold hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Currency Selector */}
              <div className="px-4 py-2">
                <CurrencySelector />
              </div>
              
              {!isLoggedIn && (
                <>
                  <div className="border-t border-gray-200/50 my-3"></div>
                  <Link
                    to="/login"
                    className="font-medium px-4 py-3 rounded-lg transition-all duration-300 text-ethiopian-gold bg-gray-50 hover:bg-ethiopian-gold hover:text-white text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2 inline" />
                    Connexion / Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
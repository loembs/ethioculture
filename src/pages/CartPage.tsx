import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCartManager } from "@/hooks/useCart";
import { formatPrice, getPreferredCurrency, Currency } from "@/utils/currency";
import { useState, useEffect } from "react";

const CartPage = () => {
  const { toast } = useToast();
  const { cartItems, cartTotal, updateCartItem, removeFromCart, isLoading } = useCartManager();
  
  // État local pour les quantités en temps réel
  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(getPreferredCurrency());
  
  // Synchroniser les quantités locales avec les données du panier
  useEffect(() => {
    if (cartItems) {
      const quantities: Record<number, number> = {};
      cartItems.forEach(item => {
        quantities[item.productId] = item.quantity;
      });
      setLocalQuantities(quantities);
    }
  }, [cartItems]);

  // Forcer la mise à jour du composant lors des changements du panier local
  useEffect(() => {
    const handleCartChange = () => {
      // Forcer un re-render pour mettre à jour les totaux
      setLocalQuantities(prev => ({ ...prev }));
    };
    
    window.addEventListener('localCartChanged', handleCartChange);
    
    return () => {
      window.removeEventListener('localCartChanged', handleCartChange);
    };
  }, []);

  // Écouter les changements de devise
  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrentCurrency(getPreferredCurrency());
    };
    
    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  const updateQuantity = async (productId: number, change: number) => {
    const item = cartItems?.find(item => item.productId === productId);
    if (item) {
      const currentQuantity = localQuantities[productId] || item.quantity;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      // Validation côté client
      if (newQuantity > 999) {
        toast({
          title: "Quantité maximale",
          description: "La quantité ne peut pas dépasser 999",
          variant: "destructive",
        });
        return;
      }
      
      // Mise à jour optimiste de l'état local
      setLocalQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
      
      if (newQuantity === 0) {
        try {
          await removeFromCart(productId);
          // Supprimer de l'état local
          setLocalQuantities(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
          });
        } catch (error) {
          // Revenir à l'état précédent en cas d'erreur
          setLocalQuantities(prev => ({
            ...prev,
            [productId]: currentQuantity
          }));
          toast({
            title: "Erreur",
            description: "Impossible de supprimer l'article",
            variant: "destructive",
          });
        }
      } else {
        try {
          await updateCartItem(productId, newQuantity);
          // Succès - pas besoin de toast, la mise à jour optimiste suffit
        } catch (error: any) {
          // Revenir à l'état précédent en cas d'erreur
          setLocalQuantities(prev => ({
            ...prev,
            [productId]: currentQuantity
          }));
          
          // Ne pas afficher d'erreur pour les erreurs serveur, le fallback local gère
          if (!error.message?.includes('500') && 
              !error.message?.includes('Erreur serveur') && 
              !error.message?.includes('Internal Server Error')) {
            toast({
              title: "Erreur",
              description: "Impossible de mettre à jour la quantité",
              variant: "destructive",
            });
          }
        }
      }
    }
  };

  const removeItem = async (productId: number) => {
    await removeFromCart(productId);
    toast({
      title: "Article supprimé",
      description: "L'article a été retiré de votre panier"
    });
  };

  // Recalculer les totaux en temps réel
  const subtotal = cartTotal || 0;
  const deliveryFee = cartItems?.some(item => item.product.category === 'food') ? 5 : 0;
  const total = subtotal + deliveryFee;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'food':
        return <Badge className="bg-ethiopian-green text-white">Cuisine</Badge>;
      case 'art':
        return <Badge className="bg-ethiopian-gold text-white">Art</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ethiopian-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement du panier...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Continuer les achats</span>
              <span className="sm:hidden">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Mon Panier</h1>
        </div>

        {!cartItems || cartItems.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Découvrez nos délicieux plats et œuvres d'art</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/cuisine">
                  <Button className="bg-primary hover:bg-primary/90">
                    Explorer la Cuisine
                  </Button>
                </Link>
                <Link to="/art">
                  <Button variant="outline">
                    Découvrir l'Art
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems?.map((item, index) => (
                <Card key={item.id} className="animate-cultural-fade" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img 
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg truncate">{item.product.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
                          </div>
                          <div className="flex-shrink-0">{getCategoryBadge(item.product.category)}</div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:border-red-300"
                              disabled={isLoading}
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="font-medium min-w-[1.5rem] sm:min-w-[2rem] text-center transition-all duration-200 text-sm sm:text-base">
                              {localQuantities[item.productId] ?? item.quantity}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-green-50 hover:border-green-300"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                            <span className="text-lg sm:text-xl font-bold text-ethiopian-green">
                              {formatPrice(item.price * (localQuantities[item.productId] ?? item.quantity), currentCurrency)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(item.productId)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary - Responsive */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 sm:top-20">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Sous-total</span>
                    <span className="transition-all duration-200">{formatPrice(subtotal, currentCurrency)}</span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Frais de livraison</span>
                      <span className="transition-all duration-200">{formatPrice(deliveryFee, currentCurrency)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-ethiopian-green transition-all duration-200">{formatPrice(total, currentCurrency)}</span>
                  </div>
                  
                  <Link to="/checkout" className="w-full block">
                    <Button className="w-full bg-primary hover:bg-primary/90 animate-ethiopian-pulse text-sm sm:text-base py-2 sm:py-3">
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Procéder au paiement
                    </Button>
                  </Link>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mt-2">
                    <div className="flex items-start gap-2">
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700">
                        <p className="font-medium">Authentification requise</p>
                        <p className="hidden sm:block">Vous devrez vous connecter ou créer un compte pour finaliser votre commande</p>
                        <p className="sm:hidden">Connexion requise pour finaliser</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link to="/" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
                      Continuer les achats
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
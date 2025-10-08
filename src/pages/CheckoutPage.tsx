import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Smartphone, Wallet, ArrowLeft, Lock, Truck, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCartManager } from "@/hooks/useCart";
import { formatPrice } from "@/utils/currency";
import { authService } from "@/services/authService";
import { orderService, CreateOrderRequest } from "@/services/orderService";

const CheckoutPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, cartTotal, isLoading } = useCartManager();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [deliveryMethod, setDeliveryMethod] = useState("livraison");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // États pour le formulaire de livraison
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Éthiopie',
    postalCode: '',
    notes: ''
  });

  // Calculer les totaux basés sur le vrai panier
  const subtotal = cartTotal || 0;
  const deliveryFee = deliveryMethod === "livraison" ? 5 : 0;
  const total = subtotal + deliveryFee;

  // Vérifier l'authentification au chargement et pré-remplir les informations
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier d'abord si l'utilisateur est déjà authentifié localement
        const isAuth = authService.isAuthenticated();
        if (isAuth) {
          setIsAuthenticated(true);
          
          // Pré-remplir avec les données locales d'abord
          const localUser = authService.getUser();
          if (localUser) {
            setShippingInfo(prev => ({
              ...prev,
              firstName: localUser.firstName || '',
              lastName: localUser.lastName || '',
              email: localUser.email || '',
              phone: localUser.phone || ''
            }));
          }
          
          // Essayer de rafraîchir les données en arrière-plan (optionnel)
          try {
            const user = await authService.getCurrentUser();
            if (user) {
              setShippingInfo(prev => ({
                ...prev,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone
              }));
            }
          } catch (refreshError) {
            console.warn('Impossible de rafraîchir les données utilisateur:', refreshError);
            // Ne pas déconnecter si le refresh échoue, utiliser les données locales
          }
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error);
        // Seulement déconnecter si c'est une erreur d'authentification grave
        if (error instanceof Error && error.message.includes('401')) {
          authService.logout();
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { replace: true });
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  // Ne pas rendre le composant si non authentifié
  if (!isCheckingAuth && !isAuthenticated) {
    return null;
  }

  // Afficher un loader pendant la vérification d'auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers le panier si vide
  if (!isLoading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
          <p className="text-muted-foreground mb-6">Votre panier est vide. Ajoutez des articles avant de procéder au paiement.</p>
          <Link to="/cart">
            <Button>Retour au panier</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);

    try {
      // Vérifier que tous les champs requis sont remplis
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email ||
          !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city ||
          !shippingInfo.country || !shippingInfo.postalCode) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs obligatoires (prénom, nom, email, téléphone, adresse, ville, pays, code postal)",
          variant: "destructive"
        });
        return;
      }

      // Vérifier que le panier n'est pas vide
      if (cartItems.length === 0) {
        toast({
          title: "Panier vide",
          description: "Votre panier est vide",
          variant: "destructive"
        });
        return;
      }


      // Mapper le paymentMethod vers les valeurs du backend
      const mapPaymentMethod = (method: string): string => {
        const mapping: Record<string, string> = {
          'carte': 'CREDIT_CARD',
          'stripe': 'CREDIT_CARD',
          'paypal': 'PAYPAL',
          'virement': 'BANK_TRANSFER',
          'livraison': 'CASH_ON_DELIVERY',
          'wave': 'CASH_ON_DELIVERY',  // Temporaire jusqu'à ajout dans le backend
          'orange': 'CASH_ON_DELIVERY'  // Temporaire jusqu'à ajout dans le backend
        };
        const mapped = mapping[method.toLowerCase()] || 'CREDIT_CARD';
        console.log('🔍 Payment method mapping:', { original: method, mapped });
        return mapped;
      };

      // Préparer les données de commande
      const orderData: CreateOrderRequest = {
        items: (cartItems || []).map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: shippingInfo.firstName.trim(),
          lastName: shippingInfo.lastName.trim(),
          street: shippingInfo.address.trim(),
          city: shippingInfo.city.trim(),
          country: shippingInfo.country.trim(),
          postalCode: shippingInfo.postalCode.trim(),
          phone: shippingInfo.phone.trim()
        },
        paymentMethod: mapPaymentMethod(paymentMethod) as any,
        notes: shippingInfo.notes ? shippingInfo.notes.trim() : undefined
      };

      console.log('🔍 ===== ORDER DATA BEING SENT TO BACKEND =====');
      console.log('🔍 Full orderData:', JSON.stringify(orderData, null, 2));
      console.log('🔍 Items:', {
        count: orderData.items.length,
        items: orderData.items
      });
      console.log('🔍 Shipping Address:', {
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        street: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        postalCode: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country,
        phone: orderData.shippingAddress.phone
      });
      console.log('🔍 Payment Method:', orderData.paymentMethod);
      console.log('🔍 Notes:', orderData.notes);
      console.log('🔍 ==========================================');

      // Validation côté client
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Le panier est vide. Ajoutez des articles avant de passer commande.');
      }

      // Vérifier que tous les articles ont un productId valide
      const invalidItems = orderData.items.filter(item => !item.productId || item.quantity <= 0);
      if (invalidItems.length > 0) {
        throw new Error('Certains articles du panier sont invalides. Veuillez réessayer.');
      }

      // Créer la commande
      const createdOrder = await orderService.createOrder(orderData);
      
      toast({
        title: "Commande créée avec succès",
        description: `Commande #${createdOrder.orderNumber} enregistrée`
      });

      // Rediriger vers le paiement avec l'ID de commande
      navigate(`/payment/${createdOrder.id}?amount=${total}&method=${paymentMethod}`);

    } catch (error: any) {
      console.error('❌ ===== ERREUR LORS DE LA CRÉATION DE LA COMMANDE =====');
      console.error('❌ Error object:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ ====================================================');
      
      // Gestion spécifique des erreurs de validation (400)
      let errorMessage = "Impossible de créer la commande. Veuillez réessayer.";
      let errorDetails = "";
      
      if (error.response?.status === 400) {
        // Erreur de validation
        const responseData = error.response.data;
        
        if (responseData?.data && typeof responseData.data === 'object') {
          // Afficher les erreurs de validation champ par champ
          const validationErrors = Object.entries(responseData.data)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          errorDetails = validationErrors;
          errorMessage = "Erreur de validation des données";
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('ERR_HTTP2_PING_FAILED') ||
            error.message.includes('ERR_NETWORK')) {
          errorMessage = "Serveur temporairement indisponible. Veuillez réessayer dans quelques minutes.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erreur de commande",
        description: errorDetails || errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const paymentOptions = [
    { id: "stripe", name: "Carte bancaire (Stripe)", icon: CreditCard, description: "Visa, Mastercard, Apple Pay, Google Pay" },
    { id: "paypal", name: "PayPal", icon: Wallet, description: "Paiement sécurisé via PayPal" },
    { id: "wave", name: "Wave Money", icon: Smartphone, description: "Paiement mobile en Afrique" },
    { id: "orange", name: "Orange Money", icon: Smartphone, description: "Service de paiement mobile" }
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/cart">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Retour au panier</span>
              <span className="sm:hidden">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input 
                        id="firstName" 
                        required 
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input 
                        id="lastName" 
                        required 
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      required 
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Mode de récupération
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 border rounded-lg">
                      <RadioGroupItem value="livraison" id="livraison" />
                      <Label htmlFor="livraison" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium text-sm sm:text-base">Livraison à domicile</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Frais de livraison : {formatPrice(5)} • Délai : 30-45 min</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 border rounded-lg">
                      <RadioGroupItem value="emporter" id="emporter" />
                      <Label htmlFor="emporter" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium text-sm sm:text-base">À emporter</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Gratuit • Prêt en 20-30 min</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryMethod === "livraison" && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg">Adresse de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse *</Label>
                      <Input 
                        id="address" 
                        required 
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input 
                          id="city" 
                          required 
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input 
                          id="postalCode" 
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Input 
                          id="country" 
                          required 
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                      <Textarea 
                        id="instructions" 
                        placeholder="Étage, code d'accès, etc."
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({...shippingInfo, notes: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Méthode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-2 sm:p-3 border rounded-lg">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <option.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm sm:text-base">{option.name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required className="mt-1" />
                    <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed">
                      J'accepte les{" "}
                      <a href="#" className="text-primary hover:underline">
                        conditions générales de vente
                      </a>{" "}
                      et la{" "}
                      <a href="#" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 animate-ethiopian-pulse text-sm sm:text-base py-2 sm:py-3" 
                size="lg"
                disabled={isCreatingOrder}
              >
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {isCreatingOrder ? "Création de la commande..." : `Payer ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary - Responsive */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 sm:top-20">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethiopian-gold mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Chargement du panier...</p>
                  </div>
                ) : (
                  <>
                    {cartItems?.map((item, index) => (
                      <div key={index} className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base truncate">{item.product.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Qté: {item.quantity}</div>
                        </div>
                        <span className="text-sm sm:text-base font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span>Sous-total</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {deliveryMethod === "livraison" && (
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>Livraison</span>
                          <span>{formatPrice(deliveryFee)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span>Total</span>
                      <span className="text-ethiopian-green">{formatPrice(total)}</span>
                    </div>
                  </>
                )}

                <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center mb-2">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-ethiopian-green" />
                    <span className="font-medium text-xs sm:text-sm">Paiement sécurisé</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Vos informations de paiement sont cryptées et sécurisées selon les normes PCI DSS.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
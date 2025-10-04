import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  ShoppingBag, 
  Ticket, 
  Heart, 
  Settings, 
  Download,
  Eye,
  Star,
  MapPin,
  Calendar,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { orderService, OrderStatus } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/utils/currency";

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });

  // Récupérer les données de l'utilisateur connecté
  const currentUser = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  // Récupérer les commandes de l'utilisateur (avec cache optimisé)
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['user-orders'],
    queryFn: () => orderService.getOrderHistory(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Récupérer les statistiques des commandes
  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-order-stats'],
    queryFn: () => orderService.getOrderStatistics(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialiser le formulaire avec les données utilisateur (une seule fois)
  useEffect(() => {
    if (currentUser && !isEditing) {
      setProfileForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        }
      });
    }
  }, [currentUser?.id, isAuthenticated]); // Utiliser seulement l'ID et l'authentification

  // Rediriger vers la connexion si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Données calculées pour l'utilisateur
  const userStats = {
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address ? `${currentUser.address.street}, ${currentUser.address.city}` : '',
    joinDate: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    }) : '',
    totalOrders: orderStats?.totalOrders || orders?.length || 0,
    totalRevenue: orderStats?.totalRevenue || 0,
    favoriteItems: 0 // TODO: Implémenter les favoris
  };

  // Fonction pour mettre à jour le profil
  const handleUpdateProfile = async () => {
    try {
      await authService.updateProfile(profileForm);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        }
      });
    }
    setIsEditing(false);
  };

  // Fonction pour obtenir le badge de statut des commandes
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [OrderStatus.CONFIRMED]: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      [OrderStatus.PROCESSING]: { color: 'bg-orange-100 text-orange-800', icon: Package },
      [OrderStatus.SHIPPED]: { color: 'bg-purple-100 text-purple-800', icon: Truck },
      [OrderStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [OrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: XCircle },
      [OrderStatus.REFUNDED]: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {orderService.getOrderStatusLabel(status)}
      </Badge>
    );
  };

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Si l'utilisateur n'est pas encore chargé, afficher un loader
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement de votre profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos commandes, billets et informations personnelles</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback className="bg-gradient-ethiopian text-white text-lg">
                    {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{userStats.name}</h2>
                <p className="text-muted-foreground text-sm mb-4">{userStats.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Membre depuis</span>
                    <span className="font-medium">{userStats.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commandes</span>
                    <span className="font-medium">{userStats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favoris</span>
                    <span className="font-medium">{userStats.favoriteItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Commandes
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Billets
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favoris
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Mes Commandes
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        Actualiser
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Chargement des commandes...</p>
                      </div>
                    ) : ordersError ? (
                      <div className="text-center py-8">
                        <p className="text-red-600">Erreur lors du chargement des commandes</p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => window.location.reload()}
                        >
                          Réessayer
                        </Button>
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold">Commande #{order.orderNumber}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                {getStatusBadge(order.status)}
                              </div>
                              
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Total:</span> {formatPrice(order.totalAmount)}
                                </div>
                                <div>
                                  <span className="font-medium">Articles:</span> {
                                    order.items && order.items.length > 0 
                                      ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                                      : 0
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Méthode:</span> {orderService.getPaymentMethodLabel(order.paymentMethod)}
                                </div>
                              </div>
                              
                              <div className="mt-3 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => console.log('Order details:', order)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir les détails
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => console.log('🔍 Full order data:', order)}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Debug
                                </Button>
                                {order.status === OrderStatus.DELIVERED && (
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger la facture
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Aucune commande</h3>
                        <p className="text-muted-foreground mb-4">
                          Vous n'avez pas encore passé de commande
                        </p>
                        <Button asChild>
                          <a href="/cuisine">Découvrir nos plats</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tickets Tab */}
              <TabsContent value="tickets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Mes Billets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Aucun billet</h3>
                      <p className="text-muted-foreground mb-4">
                        Vous n'avez pas encore acheté de billets pour nos événements
                      </p>
                      <Button asChild>
                        <a href="/art">Découvrir nos événements</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Mes Favoris
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Aucun favori</h3>
                      <p className="text-muted-foreground mb-4">
                        Ajoutez des articles à vos favoris pour les retrouver facilement
                      </p>
                      <Button asChild>
                        <a href="/cuisine">Découvrir nos produits</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informations personnelles
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={handleUpdateProfile}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Sauvegarder
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input 
                          id="firstName" 
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input 
                          id="lastName" 
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        L'email ne peut pas être modifié
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input 
                          id="phone" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Rôle</Label>
                        <Input 
                          id="role" 
                          value={currentUser?.role || 'CLIENT'}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Adresse</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="street">Rue</Label>
                          <Input 
                            id="street" 
                            placeholder="123 Rue de la Paix"
                            value={profileForm.address.street}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, street: e.target.value}
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input 
                            id="city" 
                            placeholder="Paris"
                            value={profileForm.address.city}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, city: e.target.value}
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="postalCode">Code postal</Label>
                          <Input 
                            id="postalCode" 
                            placeholder="75001"
                            value={profileForm.address.postalCode}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, postalCode: e.target.value}
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Pays</Label>
                          <Input 
                            id="country" 
                            placeholder="France"
                            value={profileForm.address.country}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, country: e.target.value}
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          💡 <strong>Conseil:</strong> Assurez-vous que vos informations sont exactes pour une meilleure expérience de livraison.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
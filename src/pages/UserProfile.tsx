import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { orderService, OrderStatus } from '@/services/orderService';
import { authService } from '@/services/authService';

const UserProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const currentUser = authService.getUser();
  
  // Récupérer les commandes de l'utilisateur
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: () => orderService.getOrderHistory(),
    enabled: !!currentUser,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées",
    });
    setIsEditing(false);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles, commandes et préférences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoris
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Informations personnelles</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Annuler" : "Modifier"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        defaultValue={currentUser?.firstName || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        defaultValue={currentUser?.lastName || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={currentUser?.email || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        defaultValue={currentUser?.phone || ''}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <Button onClick={handleSaveProfile}>
                        Sauvegarder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Adresse */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Rue</Label>
                      <Input
                        id="street"
                        defaultValue={currentUser?.address?.street || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        defaultValue={currentUser?.address?.city || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        defaultValue={currentUser?.address?.postalCode || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        defaultValue={currentUser?.address?.country || ''}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commandes */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Chargement des commandes...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold">Commande #{order.orderNumber}</h3>
                                <p className="text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 inline mr-1" />
                                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="text-right">
                                {getStatusBadge(order.status)}
                                <p className="text-lg font-bold mt-1">
                                  {order.totalAmount.toFixed(2)}€
                                </p>
                              </div>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Articles</h4>
                                <div className="space-y-1">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                      <span>{item.product.name} x{item.quantity}</span>
                                      <span>{item.price.toFixed(2)}€</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Livraison</h4>
                                <div className="text-sm text-muted-foreground">
                                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                            </div>
                            
                            {order.trackingNumber && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm">
                                  <strong>Numéro de suivi:</strong> {order.trackingNumber}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                      <p className="text-muted-foreground">
                        Vous n'avez pas encore passé de commande
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favoris */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Favoris</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                    <p className="text-muted-foreground">
                      Ajoutez des produits à vos favoris pour les retrouver facilement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications par email</h4>
                        <p className="text-sm text-muted-foreground">
                          Recevez des notifications sur vos commandes
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Activé
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Newsletter</h4>
                        <p className="text-sm text-muted-foreground">
                          Recevez nos actualités et offres spéciales
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Activé
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Changer le mot de passe
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Supprimer le compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

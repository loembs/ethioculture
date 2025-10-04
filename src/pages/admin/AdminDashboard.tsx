import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Calendar,
  Ticket,
  Upload,
  QrCode,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { adminService, DashboardData, AdminOrder, AdminProduct } from '@/services/adminService';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // États pour les données du dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // États pour le formulaire d'événement
  const [eventForm, setEventForm] = useState({
    productId: '',
    eventDate: '',
    eventEndDate: '',
    location: '',
    maxCapacity: '',
    ticketPrice: '',
    description: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    ticketTemplateUrl: '',
    qrCodeRequired: true,
  });

  const resetEventForm = () => {
    setEventForm({
      productId: '',
      eventDate: '',
      eventEndDate: '',
      location: '',
      maxCapacity: '',
      ticketPrice: '',
      description: '',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      ticketTemplateUrl: '',
      qrCodeRequired: true,
    });
    setIsAddingEvent(false);
  };

  // Vérification de l'authentification et du rôle admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Vérifier si l'utilisateur est admin
          const adminUser = authService.isAdmin();
          setIsAdmin(adminUser);
          
          if (!adminUser) {
            toast({
              title: "Accès refusé",
              description: "Vous n'avez pas les permissions pour accéder à cette page",
              variant: "destructive"
            });
            navigate('/', { replace: true });
            return;
          }
        } else {
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive"
          });
          navigate('/login?redirect=/admin', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier vos permissions",
          variant: "destructive"
        });
        navigate('/login?redirect=/admin', { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (isAuthenticated && isAdmin) {
        setIsLoadingData(true);
        try {
          const response = await adminService.getDashboardData();
          if (response.success && response.data) {
            setDashboardData(response.data);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données du dashboard:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du dashboard",
            variant: "destructive"
          });
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadDashboardData();
  }, [isAuthenticated, isAdmin, toast]);

  // Charger les commandes
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await adminService.getOrders({ page: 0, size: 20 });
      if (response.success && response.data) {
        setOrders(response.data.content || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Charger les produits
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await adminService.getProducts({ page: 0, size: 20 });
      if (response.success && response.data) {
        setProducts(response.data.content || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Charger les données selon l'onglet actif
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      if (activeTab === 'orders' && orders.length === 0) {
        loadOrders();
      } else if (activeTab === 'products' && products.length === 0) {
        loadProducts();
      }
    }
  }, [activeTab, isAuthenticated, isAdmin]);

  const handleCreateEvent = () => {
    // TODO: Implémenter la création d'événement
    toast({ title: "Événement créé avec succès" });
    resetEventForm();
  };

  // Afficher un loader pendant la vérification d'auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Ne pas rendre le dashboard si non authentifié ou non admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-muted-foreground">
              Gérez votre plateforme EthioCulture
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Événements
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Tickets
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Chargement des données...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total des Ventes</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardData?.statistics?.totalRevenue ? 
                          `${dashboardData.statistics.totalRevenue.toLocaleString()} ETB` : 
                          '0 ETB'
                        }
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.salesEvolution ? 
                          `+${(((dashboardData.salesEvolution.thisMonth - dashboardData.salesEvolution.lastMonth) / dashboardData.salesEvolution.lastMonth) * 100).toFixed(1)}% ce mois` :
                          'Aucune donnée'
                        }
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardData?.statistics?.totalOrders || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.statistics?.pendingOrders || 0} en attente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Produits</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardData?.statistics?.totalProducts || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData?.statistics?.availableProducts || 0} disponibles
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Produits en Vedette</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardData?.statistics?.featuredProducts || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Produits mis en avant
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Événements */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Événements</h2>
                <Button onClick={() => setIsAddingEvent(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvel Événement
                </Button>
                    </div>

              {/* Formulaire d'ajout/modification d'événement */}
              {isAddingEvent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Créer un Nouvel Événement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                        <Label htmlFor="eventProductId">Produit associé</Label>
                        <Select
                          value={eventForm.productId}
                          onValueChange={(value) => setEventForm({ ...eventForm, productId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Festival Culturel</SelectItem>
                            <SelectItem value="2">Atelier Cuisine</SelectItem>
                          </SelectContent>
                        </Select>
                          </div>
                          
                            <div>
                        <Label htmlFor="eventLocation">Lieu</Label>
                        <Input
                          id="eventLocation"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder="Lieu de l'événement"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="eventDate">Date de l'événement</Label>
                        <Input
                          id="eventDate"
                          type="datetime-local"
                          value={eventForm.eventDate}
                          onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxCapacity">Capacité maximale</Label>
                        <Input
                          id="maxCapacity"
                          type="number"
                          value={eventForm.maxCapacity}
                          onChange={(e) => setEventForm({ ...eventForm, maxCapacity: e.target.value })}
                          placeholder="100"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="ticketPrice">Prix du ticket</Label>
                        <Input
                          id="ticketPrice"
                          type="number"
                          value={eventForm.ticketPrice}
                          onChange={(e) => setEventForm({ ...eventForm, ticketPrice: e.target.value })}
                          placeholder="15000"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="organizerName">Nom de l'organisateur</Label>
                        <Input
                          id="organizerName"
                          value={eventForm.organizerName}
                          onChange={(e) => setEventForm({ ...eventForm, organizerName: e.target.value })}
                          placeholder="EthioCulture"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="eventDescription">Description</Label>
                      <Textarea
                        id="eventDescription"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Description de l'événement"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={eventForm.qrCodeRequired}
                          onChange={(e) => setEventForm({ ...eventForm, qrCodeRequired: e.target.checked })}
                        />
                        QR Code requis
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleCreateEvent}>
                        Créer l'événement
                      </Button>
                      <Button variant="outline" onClick={resetEventForm}>
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liste des événements */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Festival Culturel Éthiopien 2024</CardTitle>
                      <Badge variant="secondary">Actif</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        15 Mars 2024 - 18h00
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📍 Centre Culturel, Addis-Abeba
                      </p>
                      <p className="text-sm text-muted-foreground">
                        👥 75/100 places réservées
                      </p>
                      <p className="text-sm font-medium">
                        💰 15,000 ETB par ticket
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" />
                        Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Atelier de Cuisine Éthiopienne</CardTitle>
                      <Badge variant="secondary">Actif</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        22 Mars 2024 - 14h00
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📍 Cuisine École, Addis-Abeba
                      </p>
                      <p className="text-sm text-muted-foreground">
                        👥 18/25 places réservées
                      </p>
                      <p className="text-sm font-medium">
                        💰 25,000 ETB par ticket
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" />
                        Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tickets */}
            <TabsContent value="tickets" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Tickets</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Valider QR
                  </Button>
                </div>
              </div>

              {/* Statistiques des tickets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tickets Vendus</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">247</div>
                    <p className="text-xs text-muted-foreground">
                      +12% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tickets Utilisés</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">189</div>
                    <p className="text-xs text-muted-foreground">
                      76.5% du total vendu
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Tickets</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,705,000 ETB</div>
                    <p className="text-xs text-muted-foreground">
                      +18% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tickets en Attente</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">58</div>
                    <p className="text-xs text-muted-foreground">
                      À valider à l'entrée
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Liste des tickets */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Liste des Tickets</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un ticket..."
                          className="pl-8 w-64"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="valid">Valides</SelectItem>
                          <SelectItem value="used">Utilisés</SelectItem>
                          <SelectItem value="cancelled">Annulés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Ticket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">TKT-1734567890-ABC12345</p>
                          <p className="text-sm text-muted-foreground">
                            Festival Culturel Éthiopien 2024
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Acheté par: John Doe • 15,000 ETB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Valide</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Ticket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">TKT-1734567891-DEF67890</p>
                          <p className="text-sm text-muted-foreground">
                            Atelier de Cuisine Éthiopienne
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Acheté par: Jane Smith • 25,000 ETB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Utilisé</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholders pour les autres onglets */}
            <TabsContent value="products" className="space-y-6">
              <h2 className="text-2xl font-bold">Gestion des Produits</h2>
              <p className="text-muted-foreground">Fonctionnalité en développement...</p>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-bold">Gestion des Commandes</h2>
              <p className="text-muted-foreground">Fonctionnalité en développement...</p>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
              <p className="text-muted-foreground">Fonctionnalité en développement...</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
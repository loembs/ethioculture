import { useState } from 'react';
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
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product } from '@/services/productService';
import { orderService, OrderStatus } from '@/services/orderService';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour le formulaire de produit
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food' as 'food' | 'art',
    subcategory: '',
    imageUrl: '',
    stock: '',
    available: true,
    isFeatured: false,
  });

  // Récupérer les statistiques
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => orderService.getOrderStatistics(),
  });

  // Récupérer les produits
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: () => productService.getAllProducts({ 
      search: searchTerm || undefined,
      size: 50 
    }),
  });

  // Récupérer les commandes
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAllOrders({ size: 20 }),
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Produit créé avec succès" });
      resetForm();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Produit mis à jour avec succès" });
      resetForm();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Produit supprimé avec succès" });
    },
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'food',
      subcategory: '',
      imageUrl: '',
      stock: '',
      available: true,
      isFeatured: false,
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, product: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory || '',
      imageUrl: product.image,
      stock: product.stock.toString(),
      available: product.available,
      isFeatured: product.isFeatured || false,
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-orange-100 text-orange-800',
      [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [OrderStatus.REFUNDED]: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={statusConfig[status]}>
        {orderService.getOrderStatusLabel(status)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
            <p className="text-muted-foreground">
              Gérez votre plateforme EthioCulture
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produits
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(2) || '0.00'}€</div>
                    <p className="text-xs text-muted-foreground">
                      +15.3% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Nécessitent une attention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commandes Terminées</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.completedOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Ce mois-ci
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques et tableaux récents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ordersData?.content?.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-sm font-medium">{order.totalAmount.toFixed(2)}€</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Produits Populaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productsData?.content?.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category === 'food' ? 'Cuisine' : 'Art'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{product.totalSales || 0} ventes</p>
                            <p className="text-sm text-muted-foreground">{product.price.toFixed(2)}€</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Produits */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gestion des Produits</CardTitle>
                    <Button onClick={() => setIsAddingProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Barre de recherche */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>

                  {/* Liste des produits */}
                  {productsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {productsData?.content?.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {product.category === 'food' ? 'Cuisine' : 'Art'} • {product.price.toFixed(2)}€
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={product.available ? "default" : "secondary"}>
                                  {product.available ? 'Disponible' : 'Indisponible'}
                                </Badge>
                                {product.isFeatured && (
                                  <Badge variant="outline">En vedette</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commandes */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ordersData?.content?.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium">Commande #{order.orderNumber}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.totalAmount.toFixed(2)}€
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Client:</strong> {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p><strong>Email:</strong> {order.userId}</p>
                            </div>
                            <div>
                              <p><strong>Livraison:</strong> {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                              <p><strong>Paiement:</strong> {orderService.getPaymentMethodLabel(order.paymentMethod)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Utilisateurs */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Gestion des utilisateurs</h3>
                    <p className="text-muted-foreground">
                      Fonctionnalité à implémenter
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal d'ajout/édition de produit */}
          {isAddingProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Prix (€)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value: 'food' | 'art') => 
                            setProductForm({ ...productForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Cuisine</SelectItem>
                            <SelectItem value="art">Art</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Sous-catégorie</Label>
                        <Input
                          id="subcategory"
                          value={productForm.subcategory}
                          onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL de l'image</Label>
                        <Input
                          id="imageUrl"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.available}
                          onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                        />
                        Disponible
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        />
                        En vedette
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                        {editingProduct ? 'Mettre à jour' : 'Créer'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
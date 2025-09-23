import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { useCartManager } from "@/hooks/useCart";

const CuisinePage = () => {
  const { toast } = useToast();
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const { addToCart } = useCartManager();
  
  // Filtrer pour la catégorie cuisine
  const cuisineFilters = { ...filters, category: 'food' as const };
  const { data: productsData, isLoading, error } = useProducts(cuisineFilters);

  const categories = [
    { id: "tous", name: "Tous les plats" },
    { id: "plats-principaux", name: "Plats Principaux" },
    { id: "vegetariens", name: "Végétariens" },
    { id: "boissons", name: "Boissons" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [showFilters, setShowFilters] = useState(false);

  // Gérer les erreurs de chargement
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-4">
            Impossible de charger les produits. Vérifiez votre connexion.
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Filtrer les produits selon la catégorie sélectionnée
  const filteredProducts = productsData?.content?.filter(product => {
    if (selectedCategory === "tous") return true;
    return product.subcategory === selectedCategory;
  }) || [];

  const featuredProducts = filteredProducts.filter(product => product.isFeatured);
  const popularProducts = filteredProducts.filter(product => (product.totalSales || 0) > 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-warm flex items-center justify-center text-white">
        <div className="absolute inset-0 flex">
          <img 
            src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg" 
            alt="Cuisine éthiopienne traditionnelle" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-black/60 to-blue-900/60" />
        
        {/* Contenu du hero */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cuisine Éthiopienne Authentique
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Découvrez les saveurs traditionnelles de l'Éthiopie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-ethiopian-green hover:bg-ethiopian-green/90 text-white">
              Commander maintenant
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ethiopian-black">
              Voir le menu
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ethiopian-green focus:border-transparent"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mb-8">
            <ProductFiltersComponent
              filters={filters}
              onFiltersChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="animate-cultural-fade"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Produits en vedette */}
        {selectedCategory === "tous" && featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-ethiopian-gold mr-2" />
              <h2 className="text-2xl font-bold">Plats en vedette</h2>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-gray-200 h-6 w-16 rounded"></div>
                      <div className="bg-gray-200 h-8 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid
                products={featuredProducts}
                onViewDetails={(product) => {
                  console.log('Voir détails:', product);
                }}
                showAddToCart={true}
                showWishlist={true}
              />
            )}
          </div>
        )}

        {/* Produits populaires */}
        {selectedCategory === "tous" && popularProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-ethiopian-red mr-2" />
              <h2 className="text-2xl font-bold">Plats les plus vendus</h2>
            </div>
            
            <ProductGrid
              products={popularProducts}
              onViewDetails={(product) => {
                console.log('Voir détails:', product);
              }}
              showAddToCart={true}
              showWishlist={true}
            />
          </div>
        )}

        {/* Tous les produits de la catégorie */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "tous" ? "Tous les plats" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-gray-200 h-6 w-16 rounded"></div>
                    <div className="bg-gray-200 h-8 w-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              onViewDetails={(product) => {
                console.log('Voir détails:', product);
              }}
              showAddToCart={true}
              showWishlist={true}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">Aucun produit trouvé</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {productsData && productsData.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={productsData.currentPage === 0}
                onClick={() => updateFilters({ page: (productsData.currentPage || 0) - 1 })}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4">
                Page {productsData.currentPage + 1} sur {productsData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={productsData.currentPage >= productsData.totalPages - 1}
                onClick={() => updateFilters({ page: (productsData.currentPage || 0) + 1 })}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuisinePage;

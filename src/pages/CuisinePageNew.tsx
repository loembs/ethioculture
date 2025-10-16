import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Search, ChefHat, Flame, Utensils, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartManager } from "@/hooks/useCart";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { DynamicDishCarousel } from "@/components/DynamicDishCarousel";

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

  // Utiliser les données du backend uniquement
  const products = productsData?.content || [];
  
  
  // Filtrer les produits selon la catégorie sélectionnée
  const filteredProducts = products.filter(product => {
    if (selectedCategory === "tous") return true;
    return product.subcategory === selectedCategory;
  });

  const featuredProducts = filteredProducts.filter(product => product.isFeatured);
  const popularProducts = filteredProducts.filter(product => (product.totalSales || 0) > 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Immersif - Responsive */}
      <section className="section-hero relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 flex">
          <img 
            src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg" 
            alt="Cuisine éthiopienne traditionnelle" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ethiopian-red/80 via-spice-berbere/70 to-ethiopian-green/80" />
        
        {/* Éléments décoratifs flottants - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-4 sm:w-6 h-4 sm:h-6 bg-spice-gold rounded-full animate-spice-float opacity-60"></div>
          <div className="absolute top-32 sm:top-40 right-8 sm:right-20 w-3 sm:w-4 h-3 sm:h-4 bg-ethiopian-yellow rounded-full animate-spice-float opacity-40 animate-delay-200"></div>
          <div className="absolute bottom-24 sm:bottom-32 left-8 sm:left-20 w-4 sm:w-5 h-4 sm:h-5 bg-spice-saffron rounded-full animate-spice-float opacity-50 animate-delay-300"></div>
          <div className="absolute bottom-16 sm:bottom-20 right-16 sm:right-32 w-2 sm:w-3 h-2 sm:h-3 bg-ethiopian-red rounded-full animate-spice-float opacity-30 animate-delay-400"></div>
        </div>
        
        {/* Titre principal - Responsive */}
        <div className="text-center mb-6 sm:mb-8 relative z-20 px-4 sm:ml-16 md:ml-24">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-yellow-400 mr-2 sm:mr-4 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl">
              Cuisine <span className="text-yellow-400">Éthiopienne</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg mb-4 sm:mb-6 px-2">
            Découvrez nos plats authentiques qui se révèlent devant vos yeux
          </p>
        </div>

        {/* Carrousel dynamique d'image ronde centrée */}
        <div className="relative z-10 w-full">
          <DynamicDishCarousel products={products} />
          
          {/* Bouton d'action centré - Responsive */}
          <div className="flex justify-center mt-8 sm:mt-12 lg:mt-16 relative z-20 px-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold w-full sm:w-auto max-w-xs sm:max-w-none"
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Commander maintenant
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:py-12" id="menu-section">
        {/* Barre de recherche améliorée - Responsive */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12 animate-cultural-slide-up">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un plat traditionnel..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-ethiopian-green focus:border-transparent text-sm sm:text-base lg:text-lg transition-all duration-300 hover:border-ethiopian-green/50"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Categories Filter améliorées - Responsive */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-12 justify-center animate-cultural-slide-up">
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all duration-300 animate-delay-${(index + 1) * 100} text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 ${
                selectedCategory === category.id 
                  ? 'ethiopian-button' 
                  : 'border-ethiopian-green text-ethiopian-green hover:bg-ethiopian-green hover:text-white'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Produits en vedette - Responsive */}
        {selectedCategory === "tous" && (
          <div className="mb-12 sm:mb-16" id="featured-section">
            {isLoading ? (
              <ProductGrid products={[]} isLoading={true} skeletonCount={6} />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Erreur de chargement des produits en vedette</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <ProductGrid
                products={featuredProducts}
                onViewDetails={(product) => {
                  // TODO: Implémenter la vue des détails
                }}
                showAddToCart={true}
                showWishlist={true}
              />
            ) : null}
          </div>
        )}

        {/* Produits populaires - Responsive */}
        {selectedCategory === "tous" && !isLoading && !error && popularProducts.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center mb-4 sm:mb-6">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-ethiopian-red mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold">Plats les plus vendus</h2>
            </div>
            
            <ProductGrid
              products={popularProducts}
              onViewDetails={(product) => {
                // TODO: Implémenter la vue des détails
              }}
              showAddToCart={true}
              showWishlist={true}
            />
          </div>
        )}


        {/* Tous les produits de la catégorie - Responsive */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold">
              {selectedCategory === "tous" ? "Tous les plats" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>
          
          {isLoading ? (
            <ProductGrid products={[]} isLoading={true} skeletonCount={8} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Erreur de chargement des produits</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              onViewDetails={(product) => {
                // TODO: Implémenter la vue des détails
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

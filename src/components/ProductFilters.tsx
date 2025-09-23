import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Filter, RotateCcw } from 'lucide-react';
import { ProductFilters } from '@/services/productService';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
  className?: string;
}

export const ProductFiltersComponent = ({
  filters,
  onFiltersChange,
  onReset,
  className = ''
}: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  const removeFilter = (key: keyof ProductFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof ProductFilters];
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Réinitialiser
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Masquer' : 'Afficher'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Recherche */}
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Nom du produit..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Catégorie */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select
            value={filters.category || ''}
            onValueChange={(value) => handleFilterChange('category', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              <SelectItem value="food">Cuisine</SelectItem>
              <SelectItem value="art">Art</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sous-catégorie pour la cuisine */}
        {filters.category === 'food' && (
          <div className="space-y-2">
            <Label>Sous-catégorie</Label>
            <Select
              value={filters.subcategory || ''}
              onValueChange={(value) => handleFilterChange('subcategory', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sous-catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les sous-catégories</SelectItem>
                <SelectItem value="plats-principaux">Plats principaux</SelectItem>
                <SelectItem value="entrees">Entrées</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
                <SelectItem value="boissons">Boissons</SelectItem>
                <SelectItem value="epices">Épices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sous-catégorie pour l'art */}
        {filters.category === 'art' && (
          <div className="space-y-2">
            <Label>Sous-catégorie</Label>
            <Select
              value={filters.subcategory || ''}
              onValueChange={(value) => handleFilterChange('subcategory', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sous-catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les sous-catégories</SelectItem>
                <SelectItem value="peinture">Peinture</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
                <SelectItem value="photographie">Photographie</SelectItem>
                <SelectItem value="artisanat">Artisanat</SelectItem>
                <SelectItem value="bijoux">Bijoux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Prix */}
        <div className="space-y-3">
          <Label>Prix</Label>
          <div className="px-3">
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 1000]}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{filters.minPrice || 0}€</span>
              <span>{filters.maxPrice || 1000}€</span>
            </div>
          </div>
        </div>

        {/* Disponibilité */}
        <div className="space-y-2">
          <Label>Disponibilité</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={filters.available === true}
              onCheckedChange={(checked) => 
                handleFilterChange('available', checked ? true : undefined)
              }
            />
            <Label htmlFor="available" className="text-sm">
              Disponible uniquement
            </Label>
          </div>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select
            value={`${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              handleFilterChange('sortBy', sortBy as any);
              handleFilterChange('sortOrder', sortOrder as any);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
              <SelectItem value="price-asc">Prix (croissant)</SelectItem>
              <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
              <SelectItem value="createdAt-desc">Plus récent</SelectItem>
              <SelectItem value="createdAt-asc">Plus ancien</SelectItem>
              <SelectItem value="rating-desc">Mieux noté</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label>Filtres actifs</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === undefined || value === null || value === '') return null;
                
                let displayValue = value.toString();
                if (key === 'category') {
                  displayValue = value === 'food' ? 'Cuisine' : 'Art';
                } else if (key === 'available') {
                  displayValue = 'Disponible';
                } else if (key === 'sortBy') {
                  const sortLabels = {
                    name: 'Nom',
                    price: 'Prix',
                    createdAt: 'Date',
                    rating: 'Note'
                  };
                  displayValue = sortLabels[value as keyof typeof sortLabels] || value;
                }

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {displayValue}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFilter(key as keyof ProductFilters)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

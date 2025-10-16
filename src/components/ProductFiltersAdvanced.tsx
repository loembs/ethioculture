// =============================================
// FILTRES AVANCÉS POUR PRODUITS
// =============================================
import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

interface FiltersProps {
  onFilterChange: (filters: any) => void
  maxPrice?: number
}

export function ProductFiltersAdvanced({ onFilterChange, maxPrice = 100000 }: FiltersProps) {
  const [priceRange, setPriceRange] = useState([0, maxPrice])
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  function applyFilters() {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      available: onlyAvailable,
      featured: onlyFeatured
    })
  }

  function resetFilters() {
    setPriceRange([0, maxPrice])
    setOnlyAvailable(true)
    setOnlyFeatured(false)
    onFilterChange({})
  }

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4"
      >
        <Filter className="h-4 w-4 mr-2" />
        {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
      </Button>

      {showFilters && (
        <Card className="p-4 space-y-4">
          {/* Prix */}
          <div>
            <Label className="mb-2 block">
              Prix: {priceRange[0]} - {priceRange[1]} XOF
            </Label>
            <Slider
              min={0}
              max={maxPrice}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
          </div>

          {/* Disponibilité */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={onlyAvailable}
              onCheckedChange={(checked) => setOnlyAvailable(checked as boolean)}
            />
            <Label htmlFor="available">Disponible uniquement</Label>
          </div>

          {/* En vedette */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={onlyFeatured}
              onCheckedChange={(checked) => setOnlyFeatured(checked as boolean)}
            />
            <Label htmlFor="featured">Produits en vedette</Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={applyFilters} className="flex-1">
              Appliquer
            </Button>
            <Button onClick={resetFilters} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}


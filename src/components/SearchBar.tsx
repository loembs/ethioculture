// =============================================
// BARRE DE RECHERCHE AVANCÉE
// =============================================
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { trackingService } from '@/services/tracking.service'
import { productsService } from '@/services/products.service'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const timer = setTimeout(() => {
      searchProducts()
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  async function searchProducts() {
    setLoading(true)
    try {
      const data = await productsService.searchProducts(query)
      setResults(data.slice(0, 5))
      setShowResults(true)
      
      // Tracker la recherche
      trackingService.trackSearch(query, data.length)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSelectProduct(productId: number) {
    navigate(`/product/${productId}`)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery('')
              setShowResults(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
          {results.map(product => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectProduct(product.id)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.price} XOF</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


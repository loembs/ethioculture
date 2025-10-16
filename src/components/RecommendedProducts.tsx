// =============================================
// PRODUITS RECOMMANDÉS
// =============================================
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trackingService } from '@/services/tracking.service'
import { ProductGrid } from '@/components/ProductGrid'

export function RecommendedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  async function loadRecommendations() {
    try {
      const data = await trackingService.getRecommendations(6)
      setProducts(data)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="my-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div className="my-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Recommandé pour vous</h2>
      </div>
      <ProductGrid products={products.slice(0, 6)} />
    </div>
  )
}


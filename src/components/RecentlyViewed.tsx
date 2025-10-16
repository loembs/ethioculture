// =============================================
// PRODUITS VUS RÉCEMMENT
// =============================================
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { trackingService } from '@/services/tracking.service'
import { ProductGrid } from '@/components/ProductGrid'

export function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      const history = await trackingService.getViewHistory(6)
      const uniqueProducts = history
        .map(h => h.product)
        .filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id)
        )
      setProducts(uniqueProducts)
    } catch (error) {
      console.error('Error loading view history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) return null

  return (
    <div className="my-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Vus récemment</h2>
      </div>
      <ProductGrid products={products.slice(0, 6)} />
    </div>
  )
}


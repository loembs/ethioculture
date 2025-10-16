// =============================================
// PAGE SUIVI DE COMMANDE
// =============================================
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ordersService } from '@/services'

const statusSteps = [
  { key: 'PENDING', label: 'En attente', icon: Clock },
  { key: 'PROCESSING', label: 'En traitement', icon: Package },
  { key: 'SHIPPED', label: 'Expédiée', icon: Truck },
  { key: 'DELIVERED', label: 'Livrée', icon: CheckCircle }
]

export default function OrderTrackingPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      loadOrder()
    }
  }, [orderNumber])

  async function loadOrder() {
    try {
      const data = await ordersService.getOrderByNumber(orderNumber!)
      setOrder(data)
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Commande non trouvée</h2>
        <p className="text-muted-foreground">
          Le numéro de commande {orderNumber} n'existe pas.
        </p>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Suivi de commande</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Commande {order.order_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge>{order.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paiement</p>
              <Badge variant={order.payment_status === 'PAID' ? 'default' : 'secondary'}>
                {order.payment_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">{order.total_amount} XOF</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de suivi */}
      <Card>
        <CardHeader>
          <CardTitle>Progression de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-muted-foreground">En cours...</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


// =============================================
// SERVICE COMMANDES
// =============================================
import { supabase } from '@/config/supabase'

export const ordersService = {
  // Créer une commande
  async createOrder(orderData: {
    items: Array<{
      product_id: number
      quantity: number
      unit_price: number
    }>
    total_amount: number
    payment_method: string
    shipping_address: {
      first_name: string
      last_name: string
      address: string
      city: string
      postal_code: string
      country: string
      phone: string
    }
    notes?: string
    clear_cart?: boolean
  }) {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: orderData
    })

    if (error) throw error
    return data
  },

  // Récupérer les commandes de l'utilisateur
  async getMyOrders() {
    const { data, error } = await supabase
      .from('ethio_orders')
      .select(`
        *,
        order_items(
          *,
          product:ethio_products(id, name, image_url, price)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Récupérer une commande par numéro
  async getOrderByNumber(orderNumber: string) {
    const { data, error } = await supabase
      .from('ethio_orders')
      .select(`
        *,
        order_items(
          *,
          product:ethio_products(id, name, image_url, price)
        )
      `)
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data
  }
}


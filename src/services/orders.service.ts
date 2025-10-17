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
      street: string
      city: string
      postal_code: string
      country: string
      phone: string
    }
    notes?: string
    clear_cart?: boolean
  }) {
    // 1. Récupérer l'utilisateur connecté
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      throw new Error('Authentification requise')
    }
    
    const user = authData?.user
    if (!user) {
      throw new Error('Non authentifié')
    }

    // 2. Obtenir l'ID utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (userError) {
      throw new Error('Profil utilisateur non trouvé')
    }
    if (!userData) throw new Error('Profil utilisateur introuvable')

    // 3. Générer un numéro de commande unique
    const orderNumber = `GZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // 4. Préparer la commande
    const orderPayload = {
      user_id: userData.id,
      order_number: orderNumber,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      payment_status: 'PENDING',
      status: 'PENDING',
      shipping_address: orderData.shipping_address,
      notes: orderData.notes
    }
    
    // 4. Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('ethio_orders')
      .insert(orderPayload)
      .select()
      .single()

    if (orderError) {
      throw new Error('Impossible de créer la commande')
    }

    // 5. Créer les items de commande
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw new Error('Erreur lors de l\'ajout des articles')
    }

    // 6. Vider le panier si demandé
    if (orderData.clear_cart !== false) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userData.id)
        .single()

      if (cart) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id)
      }
    }
    return {
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
      status: order.status,
      createdAt: order.created_at
    }
  },

  // Récupérer les commandes de l'utilisateur
  async getMyOrders() {
    // 1. Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    // 2. Obtenir l'ID utilisateur
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!userData) throw new Error('Profil utilisateur introuvable')

    // 3. Récupérer les commandes
    const { data, error } = await supabase
      .from('ethio_orders')
      .select(`
        *,
        order_items(
          *,
          product:ethio_products(id, name, image_url, price)
        )
      `)
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 4. Mapper au format attendu par le frontend
    return (data || []).map((order: any) => ({
      id: order.id,
      orderDate: order.created_at,
      totalAmount: order.total_amount,
      status: order.status,
      items: order.order_items || []
    }))
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


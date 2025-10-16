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
    console.log('🔍 [STEP 1] Récupération utilisateur...')
    // 1. Récupérer l'utilisateur connecté
    const { data: authData, error: authError } = await supabase.auth.getUser()
    console.log('🔍 [STEP 1] Réponse auth:', { authData, authError })
    
    if (authError) {
      console.error('❌ [STEP 1] Erreur auth:', authError)
      throw new Error(`Erreur authentification: ${authError.message}`)
    }
    
    const user = authData?.user
    if (!user) {
      console.error('❌ [STEP 1] Aucun utilisateur connecté')
      throw new Error('Non authentifié')
    }
    console.log('✅ [STEP 1] User auth ID:', user.id)

    console.log('🔍 [STEP 2] Recherche profil utilisateur...')
    // 2. Obtenir l'ID utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (userError) {
      console.error('❌ [STEP 2] Erreur recherche profil:', userError)
      throw new Error(`Erreur profil: ${userError.message}`)
    }
    if (!userData) throw new Error('Profil utilisateur introuvable')
    console.log('✅ [STEP 2] User ID:', userData.id)

    // 3. Générer un numéro de commande unique
    const orderNumber = `GZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    console.log('✅ [STEP 3] Numéro commande:', orderNumber)

    console.log('🔍 [STEP 4] Création commande...')
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
    console.log('🔍 [STEP 4] Payload envoyé:', JSON.stringify(orderPayload, null, 2))
    
    // 4. Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('ethio_orders')
      .insert(orderPayload)
      .select()
      .single()

    if (orderError) {
      console.error('❌ [STEP 4] Erreur COMPLÈTE:', JSON.stringify(orderError, null, 2))
      console.error('❌ [STEP 4] Message:', orderError.message)
      console.error('❌ [STEP 4] Code:', orderError.code)
      console.error('❌ [STEP 4] Details:', orderError.details)
      console.error('❌ [STEP 4] Hint:', orderError.hint)
      throw new Error(`Erreur commande: ${orderError.message}`)
    }
    console.log('✅ [STEP 4] Commande créée:', order.id)

    console.log('🔍 [STEP 5] Création items de commande...')
    // 5. Créer les items de commande
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price  // Calcul du prix total
    }))
    console.log('🔍 [STEP 5] Items à créer:', orderItems)

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('❌ [STEP 5] Erreur création items:', itemsError)
      throw new Error(`Erreur items: ${itemsError.message}`)
    }
    console.log('✅ [STEP 5] Items créés avec succès')

    console.log('🔍 [STEP 6] Nettoyage panier...')
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
        console.log('✅ [STEP 6] Panier vidé')
      }
    } else {
      console.log('⏭️ [STEP 6] Panier conservé')
    }

    console.log('✅ Commande créée avec succès!')
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


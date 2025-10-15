// =============================================
// SERVICE PANIER
// =============================================
import { supabase } from '@/config/supabase'

export const cartService = {
  // Récupérer le panier de l'utilisateur
  async getCart() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Obtenir l'ID utilisateur
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!userData) throw new Error('User profile not found')

    // Obtenir le panier
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userData.id)
      .single()

    if (!cart) throw new Error('Cart not found')

    // Obtenir les items du panier
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:ethio_products(id, name, price, image_url, stock, available)
      `)
      .eq('cart_id', cart.id)

    if (error) throw error
    return data || []
  },

  // Ajouter un produit au panier
  async addToCart(productId: number, quantity: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userData.id)
      .single()

    // Vérifier si le produit existe déjà
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      // Mettre à jour la quantité
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      // Récupérer le prix du produit
      const { data: product } = await supabase
        .from('ethio_products')
        .select('price')
        .eq('id', productId)
        .single()

      // Ajouter au panier
      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity,
          price: product.price
        })

      if (error) throw error
    }
  },

  // Mettre à jour la quantité
  async updateQuantity(itemId: number, quantity: number) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)

    if (error) throw error
  },

  // Supprimer un item
  async removeFromCart(itemId: number) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  },

  // Vider le panier
  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userData.id)
      .single()

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    if (error) throw error
  }
}


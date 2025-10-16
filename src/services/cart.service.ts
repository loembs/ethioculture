// =============================================
// SERVICE PANIER - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const cartService = {
  // Méthodes panier local (pour compatibilité)
  getLocalCartItems() {
    const cart = localStorage.getItem('localCart')
    return cart ? JSON.parse(cart) : []
  },

  getLocalCartTotal() {
    const items = this.getLocalCartItems()
    return items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
  },

  getLocalCartItemCount() {
    const items = this.getLocalCartItems()
    return items.reduce((total: number, item: any) => total + item.quantity, 0)
  },

  addToLocalCart(product: any, quantity: number = 1) {
    const cart = localStorage.getItem('localCart')
    const items = cart ? JSON.parse(cart) : []
    const existingItem = items.find((item: any) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.push({
        id: Date.now(),
        productId: product.id,
        product,
        quantity,
        price: product.price,
        addedAt: new Date().toISOString()
      })
    }

    localStorage.setItem('localCart', JSON.stringify(items))
  },

  removeFromLocalCart(productId: number) {
    const cart = localStorage.getItem('localCart')
    const items = cart ? JSON.parse(cart) : []
    const filteredItems = items.filter((item: any) => item.productId !== productId)
    localStorage.setItem('localCart', JSON.stringify(filteredItems))
  },

  updateLocalCartItem(productId: number, quantity: number) {
    const cart = localStorage.getItem('localCart')
    const items = cart ? JSON.parse(cart) : []
    const item = items.find((item: any) => item.productId === productId)

    if (item) {
      if (quantity <= 0) {
        this.removeFromLocalCart(productId)
      } else {
        item.quantity = quantity
        localStorage.setItem('localCart', JSON.stringify(items))
      }
    }
  },

  clearLocalCart() {
    localStorage.removeItem('localCart')
  },
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
        product:ethio_products(id, name, description, price, image_url, stock, available, category_id)
      `)
      .eq('cart_id', cart.id)

    if (error) throw error
    
    // Mapper pour correspondre au format attendu par le frontend
    return (data || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
      product: {
        id: item.product?.id,
        name: item.product?.name,
        description: item.product?.description,
        price: item.product?.price,
        image: item.product?.image_url, // ⭐ Mapping image_url vers image
        stock: item.product?.stock,
        available: item.product?.available,
        category: item.product?.category_id === 1 ? 'food' : 'art'
      },
      addedAt: item.created_at
    }))
  },

  // Ajouter un produit au panier (surcharge pour compatibilité)
  async addToCart(productIdOrRequest: number | { productId: number; quantity: number }, quantity?: number) {
    const productId = typeof productIdOrRequest === 'number' ? productIdOrRequest : productIdOrRequest.productId
    const qty = typeof productIdOrRequest === 'number' ? (quantity || 1) : productIdOrRequest.quantity
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
        .update({ quantity: existing.quantity + qty })
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
          quantity: qty,
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

  // Alias pour compatibilité
  async updateCartItem(itemId: number, quantity: number) {
    return this.updateQuantity(itemId, quantity)
  },

  // Supprimer un item
  async removeFromCart(itemId: number) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  },

  // Obtenir le nombre d'items (pour compatibilité)
  async getCartItemCount() {
    const cart = await this.getCart()
    return cart?.reduce((count: number, item: any) => count + item.quantity, 0) || 0
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


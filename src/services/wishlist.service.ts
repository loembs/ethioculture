// =============================================
// SERVICE WISHLIST - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const wishlistService = {
  // Récupérer la wishlist
  async getWishlist() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:ethio_products(
          id, name, price, image_url, stock, available
        )
      `)
      .eq('user_id', userData.id)

    if (error) throw error
    return data || []
  },

  // Ajouter à la wishlist
  async addToWishlist(productId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userData.id,
        product_id: productId
      })

    if (error) throw error
  },

  // Retirer de la wishlist
  async removeFromWishlist(productId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userData.id)
      .eq('product_id', productId)

    if (error) throw error
  },

  // Vérifier si un produit est dans la wishlist
  async isInWishlist(productId: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userData.id)
      .eq('product_id', productId)
      .single()

    return !!data
  }
}


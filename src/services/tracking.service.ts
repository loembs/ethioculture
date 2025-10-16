// =============================================
// SERVICE TRACKING - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const trackingService = {
  // Tracker la vue d'un produit
  async trackProductView(productId: number) {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null
    const sessionId = this.getSessionId()

    await supabase.rpc('track_product_view', {
      p_product_id: productId,
      p_user_id: userId,
      p_session_id: sessionId
    })
  },

  // Sauvegarder une recherche
  async trackSearch(query: string, resultsCount: number) {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query,
        results_count: resultsCount
      })

    if (error) console.error('Error tracking search:', error)
  },

  // Obtenir l'historique de navigation
  async getViewHistory(limit: number = 10) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data, error } = await supabase
      .from('product_views')
      .select(`
        *,
        product:ethio_products(id, name, price, image_url)
      `)
      .eq('user_id', userData.id)
      .order('viewed_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Obtenir les recommandations
  async getRecommendations(limit: number = 6) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Retourner les produits populaires pour les non connectés
      const { data } = await supabase
        .from('ethio_products')
        .select('*')
        .eq('available', true)
        .order('total_sales', { ascending: false })
        .limit(limit)

      return data || []
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { data, error } = await supabase
      .rpc('get_recommended_products', {
        p_user_id: userData.id,
        p_limit: limit
      })

    if (error) throw error
    return data || []
  },

  // Générer/récupérer session ID
  getSessionId(): string {
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }
}


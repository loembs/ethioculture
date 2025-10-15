// =============================================
// SERVICE PRODUITS
// =============================================
import { supabase } from '@/config/supabase'

export const productsService = {
  // Récupérer tous les produits
  async getProducts(filters?: {
    category_id?: number
    available?: boolean
    search?: string
  }) {
    let query = supabase
      .from('ethio_products')
      .select(`
        *,
        category:category(id, name),
        subcategory:subcategories(id, name),
        artist:artists(id, first_name, last_name)
      `)

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters?.available !== undefined) {
      query = query.eq('available', filters.available)
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Récupérer un produit par ID
  async getProductById(id: number) {
    const { data, error } = await supabase
      .from('ethio_products')
      .select(`
        *,
        category:category(*),
        subcategory:subcategories(*),
        artist:artists(*),
        product_images(image_url)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Récupérer les produits en vedette
  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('ethio_products')
      .select('*')
      .eq('is_featured', true)
      .eq('available', true)
      .limit(6)

    if (error) throw error
    return data
  },

  // Récupérer les catégories
  async getCategories() {
    const { data, error } = await supabase
      .from('category')
      .select('*')

    if (error) throw error
    return data
  }
}


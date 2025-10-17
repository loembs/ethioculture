// =============================================
// SERVICE PRODUITS - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const productsService = {
  // Récupérer tous les produits (format compatible avec l'ancien service)
  async getAllProducts(filters?: any) {
    let query = supabase
      .from('ethio_products')
      .select(`
        *,
        category:category(id, name),
        subcategory:subcategories(id, name),
        artist:artists(id, first_name, last_name)
      `)
      .eq('available', true)

    // Filtrer par catégorie si spécifié
    if (filters?.category === 'food') {
      query = query.eq('category_id', 1)
    } else if (filters?.category === 'art') {
      query = query.eq('category_id', 2)
    }

    // Recherche
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    // Mapper au format attendu par le frontend
    let mappedProducts = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: (item.category_id === 1 ? 'food' : 'art') as 'food' | 'art',
      subcategory: item.subcategory?.name,
      image: item.image_url,
      stock: item.stock,
      available: item.available,
      isFeatured: item.is_featured,
      totalSales: item.total_sales,
      rating: item.rating,
      reviewCount: item.review_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))

    // Filtrer par sous-catégorie côté client (après le mapping)
    if (filters?.subcategory) {
      console.log('🔍 Filtrage par subcategory:', filters.subcategory);
      console.log('🔍 Produits avant filtre:', mappedProducts.length);
      
      mappedProducts = mappedProducts.filter((product: any) => {
        const match = product.subcategory?.toLowerCase() === filters.subcategory.toLowerCase();
        if (match) {
          console.log('✅ Match:', product.name, '- subcategory:', product.subcategory);
        }
        return match;
      });
      
      console.log('🔍 Produits après filtre:', mappedProducts.length);
    }

    return {
      content: mappedProducts,
      totalElements: mappedProducts.length,
      totalPages: 1,
      currentPage: 0,
      size: mappedProducts.length
    }
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

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: (data.category_id === 1 ? 'food' : 'art') as 'food' | 'art',
      image: data.image_url,
      stock: data.stock,
      available: data.available,
      isFeatured: data.is_featured,
      totalSales: data.total_sales,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  // Récupérer les produits par catégorie
  async getProductsByCategory(category: 'food' | 'art', subcategory?: string) {
    const categoryId = category === 'food' ? 1 : 2
    
    let query = supabase
      .from('ethio_products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('available', true)

    if (subcategory) {
      query = query.eq('subcategory.name', subcategory)
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category,
      image: item.image_url,
      stock: item.stock,
      available: item.available,
      isFeatured: item.is_featured,
      totalSales: item.total_sales
    }))
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

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: (item.category_id === 1 ? 'food' : 'art') as 'food' | 'art',
      image: item.image_url,
      stock: item.stock,
      available: item.available,
      isFeatured: item.is_featured,
      totalSales: item.total_sales
    }))
  },

  // Récupérer les catégories
  async getCategories() {
    const { data, error } = await supabase
      .from('category')
      .select('*')

    if (error) throw error
    return data
  },

  // Recherche de produits
  async searchProducts(query: string) {
    const { data, error } = await supabase
      .from('ethio_products')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('available', true)

    if (error) throw error
    return data || []
  },

  // Méthodes admin (non implémentées - utiliser dashboard Supabase)
  async createProduct(product: any) {
    throw new Error('Non implémenté - Utiliser le dashboard Supabase')
  },
  
  async updateProduct(id: number, product: any) {
    throw new Error('Non implémenté - Utiliser le dashboard Supabase')
  },
  
  async deleteProduct(id: number) {
    throw new Error('Non implémenté - Utiliser le dashboard Supabase')
  },

  async addReview(productId: number, review: any) {
    throw new Error('Non implémenté')
  },

  async getProductReviews(productId: number) {
    throw new Error('Non implémenté')
  }
}


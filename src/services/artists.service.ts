// =============================================
// SERVICE ARTISTES - SUPABASE
// =============================================
import { supabase } from '@/config/supabase'

export const artistsService = {
  // Récupérer tous les artistes avec comptage des œuvres
  async getAllArtists() {
    // Récupérer les artistes
    const { data: artistsData, error } = await supabase
      .from('artists')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })

    if (error) throw error

    // Pour chaque artiste, compter ses œuvres
    const artistsWithCount = await Promise.all(
      (artistsData || []).map(async (artist: any) => {
        const { count } = await supabase
          .from('ethio_products')
          .select('*', { count: 'exact', head: true })
          .eq('artist_id', artist.id)
          .eq('available', true)

        return {
          id: artist.id,
          firstName: artist.first_name,
          lastName: artist.last_name,
          fullName: `${artist.first_name} ${artist.last_name}`,
          email: artist.email,
          phone: artist.phone,
          biography: artist.biography,
          profileImage: artist.profile_image,
          coverImage: artist.cover_image,
          specialty: artist.specialty,
          yearsOfExperience: artist.years_of_experience,
          website: artist.website,
          isFeatured: artist.is_featured,
          isActive: artist.is_active,
          artworkCount: count || 0
        }
      })
    )

    return artistsWithCount
  },

  // Récupérer les artistes en vedette avec comptage
  async getFeaturedArtists() {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(6)

    if (error) throw error

    const artistsWithCount = await Promise.all(
      (data || []).map(async (artist: any) => {
        const { count } = await supabase
          .from('ethio_products')
          .select('*', { count: 'exact', head: true })
          .eq('artist_id', artist.id)

        return {
          id: artist.id,
          firstName: artist.first_name,
          lastName: artist.last_name,
          fullName: `${artist.first_name} ${artist.last_name}`,
          biography: artist.biography,
          profileImage: artist.profile_image,
          coverImage: artist.cover_image,
          specialty: artist.specialty,
          yearsOfExperience: artist.years_of_experience,
          isFeatured: artist.is_featured,
          artworkCount: count || 0
        }
      })
    )

    return artistsWithCount
  },

  // Récupérer un artiste par ID
  async getArtistById(id: number) {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone,
      biography: data.biography,
      profileImage: data.profile_image,
      coverImage: data.cover_image,
      specialty: data.specialty,
      yearsOfExperience: data.years_of_experience,
      website: data.website,
      isFeatured: data.is_featured,
      isActive: data.is_active
    }
  },

  // Récupérer les œuvres d'un artiste
  async getArtistArtworks(artistId: number) {
    const { data, error } = await supabase
      .from('ethio_products')
      .select('*')
      .eq('artist_id', artistId)
      .eq('available', true)

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: 'art' as 'art',
      image: item.image_url,
      stock: item.stock,
      available: item.available,
      isFeatured: item.is_featured || false,
      totalSales: item.total_sales || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))
  }
}


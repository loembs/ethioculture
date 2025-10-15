// =============================================
// SERVICE AUTHENTIFICATION
// =============================================
import { supabase } from '@/config/supabase'

export const authService = {
  // Inscription
  async signUp(email: string, password: string, userData: {
    first_name: string
    last_name: string
    phone?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error
    return data
  },

  // Connexion
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Obtenir le profil complet
  async getUserProfile() {
    const user = await this.getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}


// =============================================
// SERVICE AUTHENTIFICATION - SUPABASE
// =============================================
import { supabase, supabaseUrl, supabaseAnonKey } from '@/config/supabase'

export const authService = {
  // Connexion avec Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) throw error
    return data
  },

  // Envoyer un code OTP par email
  async sendOTP(email: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-otp-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de l\'envoi du code')
    }

    return response.json()
  },

  // Vérifier le code OTP
  async verifyOTP(email: string, otp: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ email, otp })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Code invalide')
    }

    const result = await response.json()
    
    // Si un access_token est retourné, se connecter avec
    if (result.access_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token || ''
      })
      
      if (error) throw error
      return data
    }

    return result
  },

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

  // Méthode login (alias de signIn pour compatibilité)
  async login(credentials: { email: string; password: string }) {
    return this.signIn(credentials.email, credentials.password)
  },

  // Méthode register (alias de signUp pour compatibilité)
  async register(userData: any) {
    return this.signUp(userData.email, userData.password, {
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone
    })
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    this.clearAuth()
  },

  // Alias logout
  async logout() {
    return this.signOut()
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
      .maybeSingle()

    // Si le profil n'existe pas encore, le créer
    if (!data && !error) {
      console.log('Profil non trouvé, création en cours...')
      
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          auth_user_id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || null,
          role: 'CLIENT'
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Erreur création profil:', createError)
        return null
      }
      
      // Créer aussi le panier
      await supabase.from('carts').insert({ user_id: newProfile.id })
      
      return newProfile
    }

    if (error) {
      console.error('Erreur récupération profil:', error)
      return null
    }
    
    return data
  },

  // Vérifier si l'utilisateur est authentifié
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    } catch {
      return false
    }
  },

  // Obtenir l'utilisateur stocké localement (avec profil)
  async getUser() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null
      
      const profile = await this.getUserProfile()
      if (!profile) return null
      
      return {
        id: user.id,
        email: user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        phone: profile.phone,
      }
    } catch (error) {
      console.error('Erreur getUser:', error)
      return null
    }
  },

  // Nettoyer l'authentification
  clearAuth() {
    // Supabase gère automatiquement
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Vérifier si admin
  async isAdmin(): Promise<boolean> {
    try {
      const profile = await this.getUserProfile()
      return profile?.role === 'ADMIN'
    } catch (error) {
      console.error('Erreur vérification admin:', error)
      return false
    }
  },

  // Vérifier le rôle
  async hasRole(role: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile()
      return profile?.role === role
    } catch (error) {
      console.error('Erreur vérification rôle:', error)
      return false
    }
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}


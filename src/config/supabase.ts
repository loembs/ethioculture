// =============================================
// CONFIGURATION SUPABASE CLIENT
// =============================================
// Client Supabase pour toute l'application

import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check your .env.local file.'
  )
}

// Créer le client Supabase (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'ethioculture-auth'
  },
  db: {
    schema: 'public'
  }
})

// Exporter l'URL et la clé pour les Edge Functions
export { supabaseUrl, supabaseAnonKey }

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      ethio_products: any
      category: any
      users: any
      ethio_orders: any
      // ... autres tables
    }
  }
}


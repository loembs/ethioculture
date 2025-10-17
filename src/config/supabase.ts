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

// Configuration du stockage personnalisé pour éviter les corruptions
const customStorage = {
  getItem: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('❌ Erreur lecture storage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('❌ Erreur écriture storage:', error);
      // Si le localStorage est plein, nettoyer et réessayer
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.log('🧹 localStorage plein, nettoyage automatique...');
        const auth = window.localStorage.getItem('geeza-auth');
        window.localStorage.clear();
        if (auth) window.localStorage.setItem('geeza-auth', auth);
        // Réessayer
        try {
          window.localStorage.setItem(key, value);
        } catch (e) {
          console.error('❌ Impossible d\'écrire même après nettoyage');
        }
      }
    }
  },
  removeItem: (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('❌ Erreur suppression storage:', error);
    }
  }
};

// Créer le client Supabase (singleton) avec protection localStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: customStorage as any,
    storageKey: 'geeza-auth',
    debug: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'x-client-info': 'geeza-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
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


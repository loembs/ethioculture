// =============================================
// GESTIONNAIRE DE SESSION ROBUSTE
// =============================================
// Gère automatiquement les sessions, détecte les problèmes et se répare

import { supabase } from '@/config/supabase';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SESSION_REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes avant expiration

let sessionCheckInterval: NodeJS.Timeout | null = null;

/**
 * Démarre la surveillance automatique de la session
 */
export const startSessionMonitoring = () => {
  // Arrêter toute surveillance existante
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
  }

  console.log('🔍 Démarrage de la surveillance de session');

  // Vérifier immédiatement
  checkAndRefreshSession();

  // Puis vérifier régulièrement
  sessionCheckInterval = setInterval(() => {
    checkAndRefreshSession();
  }, SESSION_CHECK_INTERVAL);

  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session ? 'Session active' : 'Pas de session');
    
    if (event === 'SIGNED_OUT') {
      console.log('👋 Utilisateur déconnecté');
      stopSessionMonitoring();
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 Token rafraîchi automatiquement');
    } else if (event === 'SIGNED_IN') {
      console.log('👤 Utilisateur connecté');
      // Redémarrer la surveillance si connecté
      if (!sessionCheckInterval) {
        startSessionMonitoring();
      }
    }
  });
};

/**
 * Arrête la surveillance de session
 */
export const stopSessionMonitoring = () => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
    console.log('⏹️ Surveillance de session arrêtée');
  }
};

/**
 * Vérifie et rafraîchit la session si nécessaire
 */
const checkAndRefreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Erreur lors de la vérification de session:', error);
      return;
    }

    if (!session) {
      console.log('⚠️ Pas de session active');
      return;
    }

    // Vérifier si la session expire bientôt
    const expiresAt = session.expires_at;
    if (!expiresAt) return;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;

    // Si la session expire dans moins de 10 minutes, la rafraîchir
    if (timeUntilExpiry < SESSION_REFRESH_THRESHOLD / 1000) {
      console.log('⏰ Session expire bientôt, rafraîchissement...');
      
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ Erreur rafraîchissement:', refreshError);
      } else if (data.session) {
        console.log('✅ Session rafraîchie automatiquement');
      }
    } else {
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
      console.log(`✅ Session valide (expire dans ${minutesUntilExpiry} minutes)`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la surveillance:', error);
  }
};

/**
 * Nettoie le stockage en cas de problème
 */
export const cleanupStorage = () => {
  try {
    console.log('🧹 Nettoyage du stockage...');
    
    // Liste des clés à nettoyer en cas de problème
    const keysToClean = [
      'sb-mjmihwjjoknmssnkhpua-auth-token',
      'ethioculture-auth'
    ];
    
    // Garder une copie de la session actuelle
    const currentAuth = localStorage.getItem('ethioculture-auth');
    
    // Nettoyer les anciennes clés corrompues
    keysToClean.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && value !== currentAuth) {
        localStorage.removeItem(key);
        console.log(`🗑️ Clé nettoyée: ${key}`);
      }
    });
    
    console.log('✅ Nettoyage terminé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
};

/**
 * Vérifie la santé de la connexion
 */
export const checkConnectionHealth = async (): Promise<boolean> => {
  try {
    // Test simple de connexion à Supabase
    const { error } = await supabase.from('ethio_products').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Problème de connexion:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur de santé de connexion:', error);
    return false;
  }
};

/**
 * Récupération automatique en cas de problème
 */
export const autoRecover = async (): Promise<boolean> => {
  console.log('🔧 Tentative de récupération automatique...');
  
  try {
    // 1. Nettoyer le stockage
    cleanupStorage();
    
    // 2. Vérifier la connexion
    const isHealthy = await checkConnectionHealth();
    
    if (!isHealthy) {
      console.log('⚠️ Problème de connexion détecté');
      return false;
    }
    
    // 3. Vérifier la session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('⚠️ Pas de session - l\'utilisateur doit se reconnecter');
      return false;
    }
    
    // 4. Essayer de rafraîchir la session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session) {
      console.log('⚠️ Impossible de rafraîchir - reconnexion nécessaire');
      return false;
    }
    
    console.log('✅ Récupération réussie');
    return true;
  } catch (error) {
    console.error('❌ Échec de la récupération:', error);
    return false;
  }
};


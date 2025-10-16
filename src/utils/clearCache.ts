// =============================================
// UTILITAIRE: Nettoyage du Cache
// =============================================
// Fonction pour vider complètement le cache en cas de problème

import { supabase } from '@/config/supabase';

/**
 * Vider tout le cache et déconnecter l'utilisateur
 */
export const clearAllCache = async () => {
  try {
    console.log('🧹 Nettoyage complet du cache...');
    
    // 1. Déconnexion Supabase
    await supabase.auth.signOut();
    
    // 2. Vider le localStorage
    localStorage.clear();
    
    // 3. Vider le sessionStorage
    sessionStorage.clear();
    
    // 4. Si disponible, vider le cache du service worker
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    console.log('✅ Cache nettoyé avec succès');
    
    // 5. Recharger la page
    window.location.href = '/';
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    // Forcer le rechargement même en cas d'erreur
    window.location.href = '/';
  }
};

/**
 * Vider uniquement le cache de l'authentification (sans déconnecter)
 */
export const clearAuthCache = () => {
  try {
    console.log('🧹 Nettoyage du cache d\'authentification...');
    
    // Supprimer uniquement les clés liées à l'auth
    const authKeys = [
      'ethioculture-auth',
      'sb-mjmihwjjoknmssnkhpua-auth-token'
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('✅ Cache d\'authentification nettoyé');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage auth:', error);
  }
};

/**
 * Recharger la session utilisateur
 */
export const refreshSession = async () => {
  try {
    console.log('🔄 Rafraîchissement de la session...');
    
    // D'abord vérifier si une session existe
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.warn('⚠️ Aucune session active');
      return false;
    }
    
    // Rafraîchir la session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('❌ Erreur rafraîchissement:', error);
      // Ne pas forcer la déconnexion, juste retourner false
      return false;
    }
    
    if (data.session) {
      console.log('✅ Session rafraîchie avec succès');
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Erreur rafraîchissement:', error);
    return false;
  }
};

/**
 * Vérifier et réparer la session si nécessaire
 */
export const checkAndRepairSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('⚠️ Aucune session trouvée');
      return false;
    }
    
    // Vérifier si la session est expirée
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    
    if (expiresAt && expiresAt < now) {
      console.log('⚠️ Session expirée, rafraîchissement...');
      return await refreshSession();
    }
    
    console.log('✅ Session valide');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur vérification session:', error);
    return false;
  }
};


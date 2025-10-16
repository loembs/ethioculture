// =============================================
// CONFIGURATION DES FONCTIONNALITÉS
// =============================================
// Active/désactive certaines fonctionnalités selon l'environnement

export const features = {
  // OTP Email - Désactivé jusqu'à ce que les Edge Functions soient déployées
  enableOTPVerification: false,
  
  // Google OAuth - Désactivé pour l'instant
  enableGoogleAuth: false,
  
  // Confirmation d'email
  requireEmailConfirmation: false,
  
  // Mode développement
  isDevelopment: import.meta.env.MODE === 'development',
}

// Instructions pour activer l'OTP après déploiement :
// 1. Déployer les Edge Functions : supabase functions deploy send-otp-email verify-otp
// 2. Tester que les fonctions fonctionnent
// 3. Mettre enableOTPVerification = true


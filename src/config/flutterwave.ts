// =============================================
// CONFIGURATION FLUTTERWAVE
// =============================================
// Configuration des clés Flutterwave

export const flutterwaveConfig = {
  // Clé publique Flutterwave (mode TEST)
  publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-XXXXXXXXXXXXX-X',
  
  // URL de base pour l'API Flutterwave
  apiUrl: 'https://api.flutterwave.com/v3',
  
  // Devise par défaut
  currency: 'XOF', // Franc CFA
  
  // Informations de l'entreprise
  company: {
    name: 'Geezaculture',
    logo: 'https://res.cloudinary.com/dprbhsvxl/image/upload/v1758210753/Geeza_Logo_lwpeuv.png'
  }
};

// Vérifier si la clé publique est configurée
export const isFlutterwaveConfigured = () => {
  return flutterwaveConfig.publicKey && 
         !flutterwaveConfig.publicKey.includes('XXXXXXXXXXXXX');
};


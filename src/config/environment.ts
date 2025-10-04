// Configuration de l'environnement
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://geezabackone.onrender.com/api',
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dprbhsvxl',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'EthioCulture',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV || 'development',
  },
  features: {
    enableReviews: true,
    enableWishlist: true,
    enableNotifications: true,
    enableAnalytics: false,
  }
};

export default config;

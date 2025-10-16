// =============================================
// SERVICES SUPABASE (ACTIFS)
// =============================================
export { authService } from './auth.service';
export { productsService as productService } from './products.service';
export { cartService } from './cart.service';
export { ordersService as orderService } from './orders.service';
export { paymentService } from './payment.service';
export { wishlistService } from './wishlist.service';
export { notificationsService } from './notifications.service';
export { trackingService } from './tracking.service';
export { artistsService } from './artists.service';

// =============================================
// ANCIENS SERVICES (GEEZABACK) - CONSERVÉS MAIS NON UTILISÉS
// =============================================
// Décommenter pour revenir au backend Java
// export { authService } from './authService';
// export { productService } from './productService';
// export { cartService } from './cartService';
// export { orderService } from './orderService';
// export { paymentService } from './paymentService';

// =============================================
// AUTRES SERVICES
// =============================================
export { apiService } from './api';

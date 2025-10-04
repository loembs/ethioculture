// Données statiques de fallback pour améliorer l'expérience utilisateur
import { Product } from '@/services/productService';

// Données statiques pour les œuvres d'art
export const staticArtProducts: Product[] = [
  {
    id: 1,
    name: "Tableau Traditionnel Éthiopien",
    description: "Magnifique tableau représentant la culture éthiopienne traditionnelle avec des couleurs vives et authentiques.",
    price: 150,
    category: 'art',
    subcategory: 'Tableaux',
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    stock: 5,
    available: true,
    isFeatured: true,
    totalSales: 12,
    rating: 4.8,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Sculpture en Bois d'Ébène",
    description: "Sculpture artisanale en bois d'ébène sculptée à la main par des artisans éthiopiens expérimentés.",
    price: 280,
    category: 'art',
    subcategory: 'Sculptures',
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 3,
    available: true,
    isFeatured: true,
    totalSales: 8,
    rating: 4.9,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: 3,
    name: "Vase Décoratif Traditionnel",
    description: "Vase en céramique décoré avec des motifs traditionnels éthiopiens, parfait pour la décoration.",
    price: 85,
    category: 'art',
    subcategory: 'Accessoires décoratifs',
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 8,
    available: true,
    isFeatured: false,
    totalSales: 15,
    rating: 4.6,
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z"
  },
  {
    id: 4,
    name: "Festival de Musique Éthiopienne",
    description: "Concert de musique traditionnelle éthiopienne avec des artistes locaux renommés.",
    price: 25,
    category: 'art',
    subcategory: 'Evenements',
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    stock: 50,
    available: true,
    isFeatured: true,
    totalSales: 0,
    rating: 4.7,
    createdAt: "2024-02-01T18:00:00Z",
    updatedAt: "2024-02-01T18:00:00Z"
  },
  {
    id: 5,
    name: "Atelier de Poterie Traditionnelle",
    description: "Découvrez l'art de la poterie éthiopienne lors de cet atelier interactif.",
    price: 35,
    category: 'art',
    subcategory: 'Evenements',
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 20,
    available: true,
    isFeatured: false,
    totalSales: 0,
    rating: 4.5,
    createdAt: "2024-02-05T14:00:00Z",
    updatedAt: "2024-02-05T14:00:00Z"
  }
];

// Données statiques pour la cuisine
export const staticFoodProducts: Product[] = [
  {
    id: 6,
    name: "Injera Traditionnel",
    description: "Pain traditionnel éthiopien fait à la main avec de la farine de teff.",
    price: 12,
    category: 'food',
    subcategory: 'Plats traditionnels',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    stock: 20,
    available: true,
    isFeatured: true,
    totalSales: 45,
    rating: 4.9,
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-12T08:00:00Z"
  },
  {
    id: 7,
    name: "Doro Wat",
    description: "Plat national éthiopien au poulet avec une sauce épicée aux oignons.",
    price: 18,
    category: 'food',
    subcategory: 'Plats traditionnels',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    stock: 15,
    available: true,
    isFeatured: true,
    totalSales: 32,
    rating: 4.8,
    createdAt: "2024-01-08T12:30:00Z",
    updatedAt: "2024-01-08T12:30:00Z"
  },
  {
    id: 8,
    name: "Kitfo",
    description: "Viande hachée crue assaisonnée avec du niter kibbeh et des épices.",
    price: 22,
    category: 'food',
    subcategory: 'Plats traditionnels',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    stock: 10,
    available: true,
    isFeatured: false,
    totalSales: 18,
    rating: 4.6,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  }
];

// Fonction pour obtenir les données statiques par catégorie
export const getStaticProducts = (category: 'food' | 'art', subcategory?: string): Product[] => {
  const products = category === 'food' ? staticFoodProducts : staticArtProducts;
  
  if (subcategory) {
    return products.filter(product => product.subcategory === subcategory);
  }
  
  return products;
};

// Fonction pour obtenir les produits en vedette
export const getStaticFeaturedProducts = (): Product[] => {
  return [...staticArtProducts, ...staticFoodProducts].filter(product => product.isFeatured);
};

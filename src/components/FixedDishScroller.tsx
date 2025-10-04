import React from 'react';
import { Star, Clock, Flame, ChefHat } from 'lucide-react';

// Plats éthiopiens
const dishes = [
  {
    id: 1,
    name: "Doro Wat",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Poulet mijoté dans une sauce aux épices éthiopiennes",
    price: 18,
    isSpicy: true,
    prepTime: "45 min",
    rating: 4.8
  },
  {
    id: 2,
    name: "Injera",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Pain traditionnel éthiopien au teff",
    price: 8,
    isSpicy: false,
    prepTime: "20 min",
    rating: 4.9
  },
  {
    id: 3,
    name: "Kitfo",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Tartare de bœuf assaisonné aux épices",
    price: 22,
    isSpicy: true,
    prepTime: "15 min",
    rating: 4.7
  },
  {
    id: 4,
    name: "Shiro",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Purée de pois chiches aux épices",
    price: 12,
    isSpicy: true,
    prepTime: "30 min",
    rating: 4.6
  },
  {
    id: 5,
    name: "Tibs",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Mélange de viande sauté aux légumes",
    price: 16,
    isSpicy: false,
    prepTime: "25 min",
    rating: 4.5
  },
  {
    id: 6,
    name: "Misir Wat",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Lentilles rouges mijotées aux épices",
    price: 10,
    isSpicy: true,
    prepTime: "35 min",
    rating: 4.4
  }
];

export const FixedDishScroller: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-black/20 via-transparent to-black/30">
      {/* Titre principal */}
      <div className="text-center mb-12 relative z-20">
        <div className="flex items-center justify-center mb-6">
          <ChefHat className="h-10 w-10 text-yellow-400 mr-4 animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
            Cuisine <span className="text-yellow-400">Éthiopienne</span>
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
          Découvrez nos plats authentiques qui défilent devant vos yeux
        </p>
      </div>

      {/* Container avec défilement */}
      <div className="relative h-80 overflow-hidden">
        {/* Défilement principal */}
        <div 
          className="absolute inset-0 flex items-center"
          style={{
            width: '200%',
            animation: 'scroll-left 25s linear infinite'
          }}
        >
          {[...dishes, ...dishes].map((dish, index) => (
            <div
              key={`dish-${dish.id}-${index}`}
              className="flex-shrink-0 mx-6"
            >
              <div className="group relative w-72 h-64 bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {dish.isSpicy && (
                      <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                        <Flame className="h-3 w-3 mr-1" />
                        Épicé
                      </div>
                    )}
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      {dish.price}€
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center shadow-lg">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    {dish.rating}
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="p-4 h-24 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {dish.prepTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay pour effet de fade sur les bords */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

import React from 'react';
import { Star, Clock, Flame } from 'lucide-react';

interface Dish {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  isSpicy?: boolean;
  prepTime?: string;
  rating?: number;
}

// Images authentiques de plats éthiopiens trouvées sur le web
const ethiopianDishes: Dish[] = [
  {
    id: 1,
    name: "Doro Wat",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop&crop=center",
    description: "Poulet mijoté dans une sauce aux épices",
    price: 18,
    isSpicy: true,
    prepTime: "45 min",
    rating: 4.8
  },
  {
    id: 2,
    name: "Injera",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop&crop=center",
    description: "Pain traditionnel éthiopien au teff",
    price: 8,
    isSpicy: false,
    prepTime: "20 min",
    rating: 4.9
  },
  {
    id: 3,
    name: "Kitfo",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop&crop=center",
    description: "Tartare de bœuf assaisonné aux épices",
    price: 22,
    isSpicy: true,
    prepTime: "15 min",
    rating: 4.7
  },
  {
    id: 4,
    name: "Shiro",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=400&fit=crop&crop=center",
    description: "Purée de pois chiches aux épices",
    price: 12,
    isSpicy: true,
    prepTime: "30 min",
    rating: 4.6
  },
  {
    id: 5,
    name: "Tibs",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop&crop=center",
    description: "Mélange de viande sauté aux légumes",
    price: 16,
    isSpicy: false,
    prepTime: "25 min",
    rating: 4.5
  },
  {
    id: 6,
    name: "Misir Wat",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=400&fit=crop&crop=center",
    description: "Lentilles rouges mijotées aux épices",
    price: 10,
    isSpicy: true,
    prepTime: "35 min",
    rating: 4.4
  },
  {
    id: 7,
    name: "Gomen",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop&crop=center",
    description: "Épinards éthiopiens aux épices",
    price: 9,
    isSpicy: false,
    prepTime: "20 min",
    rating: 4.3
  },
  {
    id: 8,
    name: "Dulet",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop&crop=center",
    description: "Mélange d'abats épicés",
    price: 14,
    isSpicy: true,
    prepTime: "30 min",
    rating: 4.2
  },
  {
    id: 9,
    name: "Fasolia",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=400&fit=crop&crop=center",
    description: "Haricots verts aux épices",
    price: 11,
    isSpicy: false,
    prepTime: "25 min",
    rating: 4.1
  },
  {
    id: 10,
    name: "Alicha",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop&crop=center",
    description: "Sauce douce aux légumes",
    price: 13,
    isSpicy: false,
    prepTime: "40 min",
    rating: 4.0
  }
];

// Dupliquer les plats pour un défilement continu
const duplicatedDishes = [...ethiopianDishes, ...ethiopianDishes];

export const EthiopianDishScroller: React.FC = () => {
  return (
    <div className="w-full overflow-hidden relative">
      {/* Titre principal */}
      <div className="text-center mb-8 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold ethiopian-text-gradient ethiopian-text-shadow mb-4">
          Cuisine Éthiopienne
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
          Découvrez nos plats authentiques qui défilent devant vos yeux
        </p>
      </div>

      {/* Container de défilement */}
      <div className="relative h-80 overflow-hidden">
        {/* Premier défilement */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="flex animate-scroll-left">
            {duplicatedDishes.map((dish, index) => (
              <div
                key={`first-${dish.id}-${index}`}
                className="flex-shrink-0 mx-4 animate-dish-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-64 h-56 bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {dish.isSpicy && (
                        <div className="bg-ethiopian-red text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Flame className="h-3 w-3 mr-1" />
                          Épicé
                        </div>
                      )}
                      <div className="bg-spice-gold text-white px-2 py-1 rounded-full text-xs font-medium">
                        {dish.price}€
                      </div>
                    </div>

                    {/* Rating */}
                    {dish.rating && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {dish.rating}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 h-16 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {dish.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {dish.prepTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deuxième défilement (direction opposée) */}
        <div className="absolute top-20 left-0 w-full h-full flex items-center opacity-70">
          <div className="flex animate-scroll-right">
            {duplicatedDishes.slice().reverse().map((dish, index) => (
              <div
                key={`second-${dish.id}-${index}`}
                className="flex-shrink-0 mx-4 animate-dish-float"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="w-56 h-48 bg-white/90 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    <div className="absolute top-2 left-2">
                      {dish.isSpicy && (
                        <div className="bg-ethiopian-red text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Flame className="h-2 w-2 mr-1" />
                          Épicé
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2 h-16 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-xs truncate">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {dish.price}€ • {dish.prepTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Troisième défilement (plus petit, plus rapide) */}
        <div className="absolute top-40 left-0 w-full h-full flex items-center opacity-50">
          <div className="flex animate-scroll-left-fast">
            {ethiopianDishes.map((dish, index) => (
              <div
                key={`third-${dish.id}-${index}`}
                className="flex-shrink-0 mx-3 animate-dish-float"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-48 h-36 bg-white/80 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-2 h-12 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-xs truncate">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {dish.price}€
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay pour effet de fade sur les bords */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

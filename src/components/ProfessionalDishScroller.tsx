import React from 'react';
import { Star, Clock, Flame, ChefHat } from 'lucide-react';

// Plats éthiopiens avec de vraies images professionnelles
const professionalDishes = [
  {
    id: 1,
    name: "Doro Wat",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Poulet mijoté dans une sauce aux épices éthiopiennes",
    price: 18,
    category: "Plat Principal",
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
    category: "Accompagnement",
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
    category: "Spécialité",
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
    category: "Végétarien",
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
    category: "Plat Principal",
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
    category: "Végétarien",
    isSpicy: true,
    prepTime: "35 min",
    rating: 4.4
  },
  {
    id: 7,
    name: "Gomen",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Épinards éthiopiens aux épices",
    price: 9,
    category: "Végétarien",
    isSpicy: false,
    prepTime: "20 min",
    rating: 4.3
  },
  {
    id: 8,
    name: "Dulet",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&q=80",
    description: "Mélange d'abats épicés",
    price: 14,
    category: "Spécialité",
    isSpicy: true,
    prepTime: "30 min",
    rating: 4.2
  }
];

// Dupliquer pour un défilement continu
const allDishes = [...professionalDishes, ...professionalDishes];

export const ProfessionalDishScroller: React.FC = () => {
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

      {/* Container principal */}
      <div className="relative h-96 overflow-hidden">
        {/* Premier défilement - Principal */}
        <div className="absolute inset-0 flex items-center">
          <div 
            className="flex"
            style={{
              animation: 'scroll-main 40s linear infinite'
            }}
          >
            {allDishes.map((dish, index) => (
              <div
                key={`main-${dish.id}-${index}`}
                className="flex-shrink-0 mx-6"
              >
                <div className="group relative w-80 h-72 bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {dish.isSpicy && (
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                          <Flame className="h-4 w-4 mr-1" />
                          Épicé
                        </div>
                      )}
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {dish.category}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {dish.rating}
                    </div>

                    {/* Prix */}
                    <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      {dish.price}€
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-6 h-24 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {dish.prepTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deuxième défilement - Arrière-plan */}
        <div className="absolute inset-0 flex items-center opacity-30">
          <div 
            className="flex"
            style={{
              animation: 'scroll-bg 35s linear infinite'
            }}
          >
            {allDishes.slice().reverse().map((dish, index) => (
              <div
                key={`bg-${dish.id}-${index}`}
                className="flex-shrink-0 mx-8"
              >
                <div className="w-64 h-56 bg-white/90 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    <div className="absolute top-2 left-2">
                      {dish.isSpicy && (
                        <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Flame className="h-3 w-3 mr-1" />
                          Épicé
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 h-20 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">
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

        {/* Troisième défilement - Petit */}
        <div className="absolute inset-0 flex items-center opacity-20">
          <div 
            className="flex"
            style={{
              animation: 'scroll-small 30s linear infinite'
            }}
          >
            {professionalDishes.map((dish, index) => (
              <div
                key={`small-${dish.id}-${index}`}
                className="flex-shrink-0 mx-6"
              >
                <div className="w-48 h-40 bg-white/80 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500">
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-3 h-16 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 text-xs">
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
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

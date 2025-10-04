import React from 'react';
import { ChefHat } from 'lucide-react';

// Plats éthiopiens avec images rondes
const dishes = [
  {
    id: 1,
    name: "Doro Wat",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 2,
    name: "Injera",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 3,
    name: "Kitfo",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 4,
    name: "Shiro",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 5,
    name: "Tibs",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 6,
    name: "Misir Wat",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 7,
    name: "Gomen",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&crop=center&q=80",
  },
  {
    id: 8,
    name: "Dulet",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center&q=80",
  }
];

export const RoundDishScroller: React.FC = () => {
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

      {/* Container avec défilement d'images rondes */}
      <div className="relative h-60 overflow-hidden">
        {/* Premier rang - Défilement vers la gauche */}
        <div 
          className="absolute top-0 flex items-center"
          style={{
            width: '200%',
            animation: 'scroll-left 20s linear infinite'
          }}
        >
          {[...dishes, ...dishes].map((dish, index) => (
            <div
              key={`top-${dish.id}-${index}`}
              className="flex-shrink-0 mx-8"
            >
              <div className="group relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl transform hover:scale-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Deuxième rang - Défilement vers la droite */}
        <div 
          className="absolute top-20 flex items-center"
          style={{
            width: '200%',
            animation: 'scroll-right 25s linear infinite'
          }}
        >
          {[...dishes.slice().reverse(), ...dishes.slice().reverse()].map((dish, index) => (
            <div
              key={`bottom-${dish.id}-${index}`}
              className="flex-shrink-0 mx-8"
            >
              <div className="group relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl transform hover:scale-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Troisième rang - Défilement vers la gauche (plus rapide) */}
        <div 
          className="absolute top-40 flex items-center"
          style={{
            width: '200%',
            animation: 'scroll-left-fast 15s linear infinite'
          }}
        >
          {[...dishes, ...dishes].map((dish, index) => (
            <div
              key={`fast-${dish.id}-${index}`}
              className="flex-shrink-0 mx-6"
            >
              <div className="group relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-24 h-24 rounded-full object-cover border-3 border-white shadow-lg transform hover:scale-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

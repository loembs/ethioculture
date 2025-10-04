import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Utensils, Flame } from 'lucide-react';

interface Dish {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  isSpicy?: boolean;
  prepTime?: string;
  rating?: number;
}

interface EthiopianDishCarouselProps {
  dishes?: Dish[];
  className?: string;
}

// Plats éthiopiens authentiques pour le carrousel
const defaultDishes: Dish[] = [
  {
    id: 1,
    name: "Doro Wat",
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
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
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
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
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
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
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
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
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
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
    image: "https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg",
    description: "Lentilles rouges mijotées aux épices",
    price: 10,
    category: "Végétarien",
    isSpicy: true,
    prepTime: "35 min",
    rating: 4.4
  }
];

export const EthiopianDishCarousel: React.FC<EthiopianDishCarouselProps> = ({
  dishes = defaultDishes,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation automatique du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
        setIsAnimating(false);
      }, 300);
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, [dishes.length]);

  const getVisibleDishes = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % dishes.length;
      visible.push({
        ...dishes[index],
        position: i,
        isActive: i === 1 // Le plat du milieu est actif
      });
    }
    return visible;
  };

  const visibleDishes = getVisibleDishes();

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <div className="relative h-80 overflow-hidden">
        {/* Titre principal avec animation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Utensils className="h-8 w-8 text-spice-gold mr-3 animate-golden-glow" />
            <h1 className="text-4xl md:text-6xl font-bold ethiopian-text-gradient ethiopian-text-shadow">
              Cuisine Éthiopienne
            </h1>
            <Flame className="h-8 w-8 text-spice-gold ml-3 animate-golden-glow" />
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Découvrez nos plats authentiques qui défilent
          </p>
        </div>

        {/* Carrousel des plats */}
        <div className="flex items-center justify-center h-full pt-20">
          <div className="relative w-full flex items-center justify-center">
            {visibleDishes.map((dish, index) => {
              const isCenter = dish.position === 1;
              const isLeft = dish.position === 0;
              const isRight = dish.position === 2;

              return (
                <div
                  key={`${dish.id}-${currentIndex}`}
                  className={`absolute transition-all duration-500 ease-in-out ${
                    isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  } ${isCenter ? 'animate-dish-balance' : ''}`}
                  style={{
                    transform: `translateX(${
                      isLeft ? '-200%' : isCenter ? '0%' : '200%'
                    }) scale(${
                      isCenter ? '1' : '0.8'
                    })`,
                    zIndex: isCenter ? 10 : isLeft ? 5 : 3,
                    filter: isCenter ? 'none' : 'blur(1px) brightness(0.8)'
                  }}
                >
                  <Card className={`ethiopian-card w-80 h-60 transition-all duration-500 ${
                    isCenter ? 'shadow-2xl' : 'shadow-lg'
                  }`}>
                    <CardContent className="p-0 h-full">
                      {/* Image du plat */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        
                        {/* Overlay avec gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {dish.isSpicy && (
                            <Badge className="bg-ethiopian-red text-white animate-ethiopian-pulse">
                              <Flame className="h-3 w-3 mr-1" />
                              Épicé
                            </Badge>
                          )}
                          <Badge className="bg-spice-gold text-white">
                            {dish.category}
                          </Badge>
                        </div>

                        {/* Rating */}
                        {dish.rating && (
                          <div className="absolute top-3 right-3 bg-black/50 rounded-full px-2 py-1 flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-white text-xs font-medium">{dish.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Contenu de la carte */}
                      <div className="p-4 h-20 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {dish.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {dish.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {dish.prepTime}
                          </div>
                          <div className="text-lg font-bold ethiopian-text-gradient">
                            {dish.price}€
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {dishes.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-spice-gold scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
            />
          ))}
        </div>

        {/* Flèches de navigation */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          onClick={() => {
            setIsAnimating(true);
            setTimeout(() => {
              setCurrentIndex((prevIndex) => 
                prevIndex === 0 ? dishes.length - 1 : prevIndex - 1
              );
              setIsAnimating(false);
            }, 300);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          onClick={() => {
            setIsAnimating(true);
            setTimeout(() => {
              setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
              setIsAnimating(false);
            }, 300);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

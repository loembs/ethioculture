import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  subcategory?: string;
}

interface DynamicDishCarouselProps {
  products: Product[];
}

export const DynamicDishCarousel: React.FC<DynamicDishCarouselProps> = ({ products }) => {
  const [currentDishIndex, setCurrentDishIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentDishIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, [products]);

  // Si pas de produits, afficher un état de chargement
  if (products.length === 0) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="relative flex items-center justify-center h-96">
          <div className="w-80 h-80 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const currentDish = products[currentDishIndex];

  return (
    <div className="relative w-full overflow-hidden">

      {/* Container central avec image ronde */}
      <div className="relative flex items-center justify-center h-96">
        {/* Image ronde principale */}
        <div className="relative">
          <div 
            key={currentDish.id}
            className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl transform transition-all duration-1000 ease-in-out"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.1)'
            }}
          >
            <img
              src={currentDish.image}
              alt={currentDish.name}
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              loading="lazy"
            />
          </div>
          
          {/* Nom du plat */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl">
              <h3 className="text-3xl font-bold text-gray-900">
                {currentDish.name}
              </h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

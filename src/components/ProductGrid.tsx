import { Product } from '@/services/productService';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onViewDetails?: (product: Product) => void;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  className?: string;
  skeletonCount?: number;
}

export const ProductGrid = ({
  products,
  isLoading = false,
  onViewDetails,
  showAddToCart = true,
  showWishlist = true,
  className = '',
  skeletonCount = 6
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(skeletonCount)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">Aucun produit trouvé</p>
          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
          showAddToCart={showAddToCart}
          showWishlist={showWishlist}
          className="animate-cultural-fade"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

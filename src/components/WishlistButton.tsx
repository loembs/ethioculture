// =============================================
// BOUTON WISHLIST
// =============================================
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { wishlistService } from '@/services/wishlist.service'
import { useToast } from '@/hooks/use-toast'

interface WishlistButtonProps {
  productId: number
  size?: 'sm' | 'md' | 'lg'
}

export function WishlistButton({ productId, size = 'md' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkWishlist()
  }, [productId])

  async function checkWishlist() {
    try {
      const inWishlist = await wishlistService.isInWishlist(productId)
      setIsInWishlist(inWishlist)
    } catch (error) {
      // Utilisateur non connecté
      setIsInWishlist(false)
    }
  }

  async function toggleWishlist() {
    setLoading(true)
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId)
        setIsInWishlist(false)
        toast({
          title: 'Retiré des favoris',
          description: 'Le produit a été retiré de vos favoris'
        })
      } else {
        await wishlistService.addToWishlist(productId)
        setIsInWishlist(true)
        toast({
          title: 'Ajouté aux favoris',
          description: 'Le produit a été ajouté à vos favoris'
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Veuillez vous connecter pour ajouter aux favoris',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[size]

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size]

  return (
    <Button
      variant="ghost"
      size="icon"
      className={sizeClass}
      onClick={toggleWishlist}
      disabled={loading}
    >
      <Heart
        className={`${iconSize} transition-all ${
          isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
    </Button>
  )
}


// components/product-card.tsx (atau di page produk Anda)

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, MapPin } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface Product {
  _id: string
  id?: string
  name: string
  price: number
  size: string
  condition: string
  image?: string
}

interface ProductCardProps {
  product: Product
  onToggleFavorite?: () => void
  isFavorite?: boolean
}

export function ProductCard({ product, onToggleFavorite, isFavorite }: ProductCardProps) {
  const { addToCart } = useCart()
  
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking cart button
    e.stopPropagation()
    addToCart(product)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.()
  }

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-2 cursor-pointer">
        
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          <Image
            src={product.image || "https://placehold.co/400"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized={true}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <span className="text-xs font-semibold text-slate-700">{product.condition}</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-10"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </button>

          {/* Quick Add to Cart - appears on hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-white/95 backdrop-blur-sm text-[#3B82F6] hover:bg-white shadow-lg font-semibold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Tambah ke Keranjang
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-[#3B82F6] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#6366F1] bg-clip-text text-transparent">
              {formatRupiah(product.price)}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>Indonesia</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-slate-700">5.0</span>
            </div>
          </div>

          {/* Size Tag */}
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
              Size: {product.size}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
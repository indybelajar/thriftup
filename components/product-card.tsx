"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingCart, Star, MapPin } from "lucide-react"
import { useCart } from "@/lib/cart-context"

// FIX: Update Interface agar sesuai dengan ProductType di Cart Context
interface Product {
  _id: string
  id?: string
  name: string
  price: number
  size: string
  condition: string
  image?: string
  stock?: number
  sellerWhatsapp: string // Tambahan Wajib
}

interface ProductCardProps {
  product: Product
  onToggleFavorite?: () => void
  isFavorite?: boolean
  index?: number
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
    e.preventDefault()
    e.stopPropagation()
    
    // Cek stok sederhana sebelum add
    if ((product.stock || 0) <= 0) {
        alert("Maaf, stok barang ini sudah habis.")
        return
    }

    addToCart(product)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.()
  }

  const isOutOfStock = (product.stock || 0) <= 0

  // Fallback ID handling
  const productId = product._id || product.id

  return (
    <Link href={`/products/${productId}`} className="block h-full group">
      <Card className={`relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#9b5de0]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${isOutOfStock ? 'opacity-80' : ''}`}>
        
        {/* Image Container */}
        <div className="relative aspect-4/5 sm:aspect-square bg-slate-100 overflow-hidden">
          <Image
            src={product.image || "https://placehold.co/400"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
            unoptimized={true}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#fdcffa]/90 backdrop-blur rounded-lg text-xs font-bold text-[#4e56c0] shadow-sm">
            {product.condition}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transform -rotate-6 border-2 border-white">
                    Sold Out
                </span>
             </div>
          )}

          {/* Quick Add to Cart (Hidden if Out of Stock) */}
          {!isOutOfStock && (
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-white/95 backdrop-blur-sm text-[#4e56c0] hover:bg-white shadow-lg font-bold h-10"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  + Keranjang
                </Button>
              </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-[#4e56c0] transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto pt-2">
             <p className="text-lg font-bold text-[#4e56c0] mb-2">
                {formatRupiah(product.price)}
             </p>

             <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                   <MapPin className="w-3 h-3 text-slate-400" /> Indonesia
                </div>
                <span className="px-2 py-1 bg-slate-50 rounded text-slate-600 font-medium">
                   {product.size}
                </span>
             </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
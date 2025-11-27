"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { 
  Star, MapPin, ShieldCheck, Truck, RefreshCw, 
  ArrowLeft, Heart, Share2, ShoppingCart, Check 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Tipe data (sesuaikan dengan API kamu)
interface Product {
  _id?: string
  id?: string | number
  name: string
  price: number
  size: string
  condition: string
  image?: string
  description?: string // Tambahan field deskripsi
  category?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0) // Untuk gallery jika ada multiple images

  // Format IDR
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  // Fetch Single Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Asumsi endpoint API support get by ID: /api/products/[id]
        // Jika belum ada, kamu bisa fetch all lalu .find() di sini sementara
        const res = await fetch(`/api/products`) 
        if (res.ok) {
          const allProducts = await res.json()
          // Mencari produk yang ID-nya cocok dengan URL
          const found = allProducts.find((p: any) => 
            (p._id === params.id) || (p.id?.toString() === params.id)
          )
          setProduct(found)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      // Opsional: Redirect langsung ke cart atau checkout
      // router.push('/cart') 
      alert("Produk berhasil ditambahkan ke keranjang!")
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart(product)
      router.push('/checkout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h1>
        <Link href="/">
          <Button variant="outline">Kembali ke Beranda</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* LEFT COLUMN: IMAGES */}
            <div className="space-y-4">
                <div className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
                    <Image
                        src={product.image || "https://placehold.co/600"}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        unoptimized={true}
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white backdrop-blur shadow-sm">
                        {product.condition}
                    </Badge>
                </div>
                {/* Thumbnail (Dummy loop for visual) */}
                <div className="grid grid-cols-4 gap-4">
                    {[1,2,3].map((_, i) => (
                        <div key={i} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                             <Image
                                src={product.image || "https://placehold.co/200"}
                                alt="Thumbnail"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                                unoptimized={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: INFO & ACTIONS */}
            <div className="flex flex-col h-full">
                
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            Pre-loved
                        </Badge>
                        <div className="flex items-center text-yellow-400 text-sm font-medium">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-slate-700">4.9 (24 Reviews)</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                        {product.name}
                    </h1>
                    
                    <div className="flex items-end gap-3 mt-4">
                        <span className="text-4xl font-bold text-blue-600">
                            {formatRupiah(product.price)}
                        </span>
                        {/* Dummy Discount logic */}
                        <span className="text-lg text-slate-400 line-through mb-1">
                            {formatRupiah(product.price * 1.5)}
                        </span>
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-2">
                            Hemat 33%
                        </span>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <span className="block text-sm text-slate-500 mb-1">Ukuran</span>
                        <div className="inline-flex items-center justify-center px-4 py-2 border-2 border-slate-900 rounded-lg font-bold text-slate-900 min-w-[3rem]">
                            {product.size}
                        </div>
                    </div>
                    <div>
                        <span className="block text-sm text-slate-500 mb-1">Kondisi Barang</span>
                        <div className="flex items-center gap-2 font-medium text-slate-700 mt-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Siap Pakai
                        </div>
                    </div>
                </div>

                <div className="prose prose-slate text-slate-600 mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Deskripsi Produk</h3>
                    <p>
                        {product.description || "Barang ini adalah koleksi thrift berkualitas yang telah melalui proses kurasi ketat. Kondisi masih sangat prima, warna tidak pudar, dan tidak ada cacat mayor. Cocok untuk melengkapi gaya kasual kamu sehari-hari."}
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>Original Brand Guaranteed</li>
                        <li>Sudah dilaundry bersih (Ready to wear)</li>
                        <li>Pengiriman aman dengan bubble wrap</li>
                    </ul>
                </div>

                {/* TRUST BADGES */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl">
                    <div className="text-center">
                        <ShieldCheck className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs text-slate-600 block">Jaminan Aman</span>
                    </div>
                    <div className="text-center border-l border-slate-200">
                        <Truck className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs text-slate-600 block">Kirim Cepat</span>
                    </div>
                    <div className="text-center border-l border-slate-200">
                        <RefreshCw className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs text-slate-600 block">Bebas Retur*</span>
                    </div>
                </div>

                {/* ACTION BUTTONS (STICKY ON MOBILE BOTTOM) */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3 sticky bottom-0 sm:static p-4 sm:p-0 bg-white/80 backdrop-blur-md sm:bg-transparent border-t border-slate-200 sm:border-0 -mx-4 sm:mx-0">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="flex-1 h-12 text-base font-semibold border-slate-300"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                    </Button>
                    <Button 
                        size="lg" 
                        className="flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                        onClick={handleBuyNow}
                    >
                        Beli Sekarang
                    </Button>
                </div>

            </div>
        </div>

        {/* RELATED PRODUCTS (Opsional placeholder) */}
        <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Mungkin Kamu Suka</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {/* Placeholder for related items */}
                 {[1,2,3,4].map((i) => (
                    <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
                 ))}
            </div>
        </div>

      </main>
    </div>
  )
}
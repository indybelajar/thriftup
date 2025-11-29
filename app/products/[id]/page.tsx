"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { 
  Star, ShieldCheck, Truck, RefreshCw, 
  ArrowLeft, Share2, ShoppingCart, Check, AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Tipe data (Harus match dengan ProductType di cart-context)
interface Product {
  _id: string
  id?: string | number
  name: string
  price: number
  size: string
  condition: string
  image?: string
  description?: string
  category?: string
  stock?: number
  sellerWhatsapp: string 
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, items } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`) 
        if (res.ok) {
          const allProducts = await res.json()
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
      const existingItem = items.find((item) => item.product._id === product._id)
      const currentQty = existingItem ? existingItem.quantity : 0
      const availableStock = product.stock || 0

      if (availableStock <= 0) {
          alert("Maaf, stok barang ini sedang habis.")
          return
      }
      if (currentQty + 1 > availableStock) {
          alert(`Stok tidak mencukupi! Hanya tersisa ${availableStock} barang.`)
          return
      }

      addToCart(product)
      alert("Produk berhasil ditambahkan ke keranjang!")
    }
  }

  const handleBuyNow = () => {
    if (product) {
      if ((product.stock || 0) <= 0) {
          alert("Maaf, stok barang ini sedang habis.")
          return
      }
      addToCart(product)
      router.push('/checkout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4e56c0]"></div>
            <p className="text-slate-500 text-sm font-medium">Memuat produk...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h1>
        <p className="text-slate-500 max-w-md">Mungkin barang ini sudah laku terjual atau dihapus oleh penjual.</p>
        <Link href="/">
          {/* FIX: Hapus variant, gunakan className manual */}
          <Button className="border border-[#4e56c0] text-[#4e56c0] bg-white hover:bg-[#f8fafc] h-10 px-4">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    )
  }

  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24">
      
    

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* LEFT COLUMN: IMAGES */}
            <div className="space-y-4">
                <div className="relative aspect-4/5 sm:aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
                    <Image
                        src={product.image || "https://placehold.co/600"}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-80' : 'group-hover:scale-105'}`}
                        unoptimized={true}
                    />
                    
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-[#4e56c0] hover:bg-white backdrop-blur shadow-md border border-[#fdcffa] px-3 py-1.5 text-sm font-bold">
                            {product.condition}
                        </Badge>
                    </div>

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-[2px]">
                            <span className="bg-red-600 text-white px-8 py-3 rounded-full text-xl font-bold uppercase tracking-widest shadow-2xl border-4 border-white transform -rotate-12">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-[#4e56c0] ring-2 ring-[#fdcffa]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'}`}>
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
                
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="bg-[#fdf4ff] text-[#9b5de0] border border-[#9b5de0]/20 hover:bg-[#fdcffa] px-3 py-1">
                            Pre-loved Item
                        </Badge>
                        <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                            <Star className="w-3.5 h-3.5 fill-current mr-1.5" />
                            <span>4.9 (24)</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                        {product.name}
                    </h1>
                    
                    <div className="flex-wrap items-end gap-3 mt-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm inline-flex">
                        <span className="text-4xl font-bold text-[#4e56c0]">
                            {formatRupiah(product.price)}
                        </span>
                        <div className="flex flex-col mb-1">
                            <span className="text-sm text-slate-400 line-through decoration-slate-300">
                                {formatRupiah(product.price * 1.5)}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                                Hemat 33%
                            </span>
                        </div>
                    </div>
                </div>

                <Separator className="my-2 bg-slate-200" />

                <div className="grid grid-cols-2 gap-4 py-6">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ukuran</span>
                        <div className="text-2xl font-black text-slate-800">
                            {product.size || "-"}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stok Tersedia</span>
                        <div className="flex items-center gap-2">
                            {isOutOfStock ? (
                                <span className="text-red-600 font-bold flex items-center gap-2">
                                    Habis <AlertCircle className="w-5 h-5"/>
                                </span>
                            ) : (
                                <span className="text-emerald-600 font-bold text-xl flex items-center gap-2">
                                    {product.stock} <span className="text-sm font-medium text-slate-500">pcs</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        Deskripsi Produk
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                        {product.description || "Barang ini adalah koleksi thrift berkualitas yang telah melalui proses kurasi ketat. Siap untuk digunakan"}
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                            <div className="p-1 rounded-full bg-[#fdf4ff]"><Check className="w-3.5 h-3.5 text-[#9b5de0]" /></div>
                            Jaminan pengiriman cepat & aman
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                            <div className="p-1 rounded-full bg-[#fdf4ff]"><Check className="w-3.5 h-3.5 text-[#9b5de0]" /></div>
                           Ready to use
                        </div>
                    </div>
                </div>

                {/* TRUST BADGES */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center gap-1">
                        <ShieldCheck className="w-5 h-5 text-[#9b5de0]" />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-600">Jaminan Aman</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center gap-1">
                        <Truck className="w-5 h-5 text-[#9b5de0]" />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-600">Kirim Cepat</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center gap-1">
                        <RefreshCw className="w-5 h-5 text-[#9b5de0]" />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-600">Bebas Retur*</span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3 sticky bottom-4 sm:static z-40">
                    <div className="p-4 sm:p-0 bg-white/90 backdrop-blur-xl sm:bg-transparent border border-slate-200 sm:border-0 rounded-2xl shadow-2xl sm:shadow-none flex flex-row gap-3 w-full">
                        {/* FIX: Ganti variant="outline" dan size="lg" */}
                        <Button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="flex-1 h-14 bg-transparent border-2 border-slate-200 text-slate-700 hover:border-[#4e56c0] hover:text-[#4e56c0] hover:bg-[#f8fafc] rounded-xl font-bold"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" /> Keranjang
                        </Button>
                        
                        {/* FIX: Ganti size="lg" */}
                        <Button 
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                            className={`flex-[1.5] h-14 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-white ${isOutOfStock ? 'bg-slate-300 cursor-not-allowed hover:bg-slate-300 text-slate-500' : 'bg-[#4e56c0] hover:bg-[#3d44a0] text-white shadow-indigo-200'}`}
                        >
                            {isOutOfStock ? "Stok Habis" : "Beli Sekarang"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>

        <div className="mt-24 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Mungkin Kamu Suka</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[1,2,3,4].map((i) => (
                    <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse shadow-sm"></div>
                 ))}
            </div>
        </div>

      </main>
    </div>
  )
}
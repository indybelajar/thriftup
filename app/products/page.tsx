"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Heart, ShoppingCart, AlertCircle, Filter, Search } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"

// 1. PISAHKAN LOGIC UTAMA KE KOMPONEN "CONTENT"
function ProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const router = useRouter()
  
  // useSearchParams aman digunakan di sini karena komponen ini akan dibungkus Suspense
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  const { addToCart, items } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/products", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchCategory = filter === "all" 
      ? true 
      : p.category?.toLowerCase() === filter.toLowerCase()

    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchCategory && matchSearch
  })

  const handleAddToCart = (product: any) => {
    const existingItem = items.find((item) => item.product._id === product._id)
    const currentQty = existingItem ? existingItem.quantity : 0
    const availableStock = product.stock || 0

    if (availableStock <= 0) {
        alert("Maaf, stok barang ini sudah habis.")
        return
    }

    if (currentQty + 1 > availableStock) {
        alert(`Stok tidak mencukupi! Hanya tersisa ${availableStock} barang.`)
        return
    }

    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        {searchQuery ? `Hasil: "${searchQuery}"` : "Koleksi ThriftUp"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {searchQuery 
                        ? `Menampilkan ${filteredProducts.length} produk untuk "${searchQuery}"` 
                        : "Temukan harta karun preloved berkualitas tinggi"}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1,2,3,4,5,6,7,8].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {searchQuery ? "Produk Tidak Ditemukan" : "Belum Ada Produk"}
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm text-center">
                    {searchQuery 
                    ? `Maaf, kami tidak menemukan barang dengan kata kunci "${searchQuery}". Coba kata kunci lain.` 
                    : "Belum ada barang yang dijual saat ini. Yuk, jadi yang pertama berjualan!"}
                </p>
                <div className="flex gap-4">
                    {searchQuery && (
                        <Button 
                            onClick={() => router.push('/products')} 
                            className="bg-transparent border border-[#4e56c0] text-[#4e56c0] hover:bg-[#f8fafc] font-bold"
                        >
                            Lihat Semua
                        </Button>
                    )}
                    <Button onClick={() => router.push('/add-product')} className="bg-[#4e56c0] hover:bg-[#3d44a0] font-bold text-white">
                        Jual Barang
                    </Button>
                </div>
            </div>
        ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((p, i) => {
                    const isOutOfStock = (p.stock || 0) <= 0;

                    return (
                    <Card 
                        key={p._id || i} 
                        className={`overflow-hidden group relative border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between bg-white rounded-2xl ${isOutOfStock ? 'opacity-80' : ''}`}
                    >
                        <div className="relative h-72 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => router.push(`/products/${p._id || p.id}`)}>
                            <Image 
                                src={p.image && p.image !== "" ? p.image : "https://placehold.co/400"} 
                                alt={p.name}
                                fill
                                className={`object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
                                unoptimized={true} 
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-white/95 text-slate-800 hover:bg-white backdrop-blur shadow-sm px-2.5 py-1 text-xs font-semibold">
                                    {p.condition}
                                </Badge>
                            </div>
                            <button className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-all z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                                <Heart className="w-4 h-4 text-slate-400 hover:fill-current" />
                            </button>
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg transform -rotate-6 border-2 border-white">
                                        Sold Out
                                    </span>
                                </div>
                            )}
                        </div>

                        <CardContent className="p-5 flex-1 flex flex-col">
                            <div className="mb-2">
                                <h2 
                                    className="font-bold text-slate-900 line-clamp-1 text-lg mb-1 group-hover:text-[#4e56c0] transition-colors cursor-pointer" 
                                    title={p.name}
                                    onClick={() => router.push(`/products/${p._id || p.id}`)}
                                >
                                    {p.name}
                                </h2>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                                        Size: {p.size || "-"} 
                                    </span>
                                    {isOutOfStock ? (
                                        <span className="text-red-500 font-bold flex items-center gap-1">
                                            Habis <AlertCircle className="w-3 h-3"/>
                                        </span>
                                    ) : (
                                        <span className="text-emerald-600 font-medium">
                                            Stok: {p.stock}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                                <p className="font-bold text-xl text-[#4e56c0]">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p.price)}
                                </p>
                            </div>
                        </CardContent>

                        <div className="p-4 pt-0">
                            <Button 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleAddToCart(p);
                                }} 
                                disabled={isOutOfStock} 
                                className={`w-full font-bold shadow-sm transition-all active:scale-95 h-10 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200' : 'bg-[#4e56c0] hover:bg-[#3d44a0] text-white hover:shadow-md'}`}
                            >
                                {isOutOfStock ? (
                                    "Stok Habis"
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4 mr-2" /> + Keranjang
                                    </>
                                )}
                            </Button>
                        </div>

                    </Card>
                    )
                })}
            </div>
        )}
      </div>
    </div>
  )
}

// 2. KOMPONEN WRAPPER DENGAN SUSPENSE
export default function ProductsPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4e56c0]"></div>
            <p className="text-slate-500 font-medium">Memuat halaman...</p>
          </div>
       </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" // WAJIB ADA untuk fitur search
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  
  // 1. Ambil params pencarian dari URL (dikirim dari Navbar)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  const { addToCart, items } = useCart()

  // Fetch products
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

  // --- LOGIC FILTER GABUNGAN (Search + Kategori) ---
  const filteredProducts = products.filter((p) => {
    // 1. Cek Kategori
    const matchCategory = filter === "all" 
      ? true 
      : p.category?.toLowerCase() === filter.toLowerCase()

    // 2. Cek Search Query (jika ada)
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchCategory && matchSearch
  })

  // --- LOGIC ADD TO CART (DENGAN CEK STOK) ---
  const handleAddToCart = (product: any) => {
    const existingItem = items.find((item) => item.product._id === product._id)
    const currentQty = existingItem ? existingItem.quantity : 0
    const availableStock = product.stock || 0

    if (availableStock === 0) {
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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Koleksi ThriftUp"}
          </h1>
          <p className="text-slate-600 mt-1">
            {searchQuery 
              ? `Menampilkan hasil untuk kata kunci "${searchQuery}"` 
              : "Barang preloved yang udah siap nemuin pemilik barunya ✨"}
          </p>
        </div>

        <Select onValueChange={(val) => setFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="outer">Outer</SelectItem>
            <SelectItem value="dress">Dress</SelectItem>
            <SelectItem value="pants">Pants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CONTENT */}
      {loading ? (
         <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1,2,3,4].map((i) => (
                <div key={i} className="h-[350px] bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
         </div>
      ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
             <p className="text-slate-500">
               {searchQuery 
                 ? `Tidak ditemukan barang dengan nama "${searchQuery}".` 
                 : "Belum ada produk."}
             </p>
             {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => window.location.href = '/products'}
                >
                  Lihat Semua Produk
                </Button>
             )}
          </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((p, i) => {
                const isOutOfStock = (p.stock || 0) <= 0;

                return (
                <Card key={p._id || i} className={`overflow-hidden group relative border-none shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between bg-white ${isOutOfStock ? 'opacity-75' : ''}`}>
                
                {/* Bagian Atas: Gambar & Info */}
                <div>
                    <div className="relative h-64 bg-slate-200">
                        <Image 
                            src={p.image && p.image !== "" ? p.image : "https://placehold.co/400"} 
                            alt={p.name}
                            fill
                            className={`object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                            unoptimized={true} 
                        />
                         <button className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition z-10 cursor-pointer">
                            <Heart className="w-4 h-4 text-slate-400 hover:text-pink-500 transition-colors" />
                        </button>
                        
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded">
                            {p.condition}
                        </div>

                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    <CardContent className="p-4 space-y-2">
                        <div>
                            <h2 className="font-semibold text-slate-800 line-clamp-1 text-base" title={p.name}>
                                {p.name}
                            </h2>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-slate-500">
                                    Size: {p.size} 
                                </p>
                                <p className={`text-xs font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                    {isOutOfStock ? "Stok Habis" : `Stok: ${p.stock}`}
                                </p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="font-bold text-lg text-[#3B82F6]">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p.price)}
                            </p>
                        </div>
                    </CardContent>
                </div>

                {/* Bagian Bawah: Tombol */}
                <div className="p-4 pt-0 mt-auto">
                    <Button 
                        onClick={() => handleAddToCart(p)} 
                        disabled={isOutOfStock} 
                        className={`w-full text-white gap-2 transition-transform active:scale-95 ${isOutOfStock ? 'bg-slate-300 cursor-not-allowed hover:bg-slate-300' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                        {isOutOfStock ? (
                            "Sold Out"
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </>
                        )}
                    </Button>
                </div>

            </Card>
            )})}
        </div>
      )}
    </div>
  )
}
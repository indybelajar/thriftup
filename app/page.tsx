"use client"

import { useState, useEffect } from "react"
import Link from "next/link" 
import { MapPin, Star, TrendingUp, Package, Shield } from "lucide-react"

// --- TYPES ---
interface Product {
  _id?: string
  id?: string | number
  name: string
  price: number
  size: string
  condition: string
  image?: string
}

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data.slice(0, 8))
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(index)) {
      newFavorites.delete(index)
    } else {
      newFavorites.add(index)
    }
    setFavorites(newFavorites)
  }

  return (
    // FIX 1: Ganti background utama jadi solid slate-50 (lebih bersih) atau putih
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HERO SECTION */}
      <HeroSection />

      {/* FEATURES SECTION */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="100% Aman"
              description="Transaksi terjamin aman"
              gradient="from-[#4e56c0] to-[#9b5de0]"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="Harga Terbaik"
              description="Hemat hingga 70%"
              gradient="from-[#9b5de0] to-[#d78fee]"
            />
            <FeatureCard 
              icon={<Package className="w-6 h-6" />}
              title="Kualitas Terjamin"
              description="Produk terverifikasi"
              gradient="from-[#d78fee] to-[#fdcffa]"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="sticky top-10 z-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {["All", "Fashion", "Electronics", "Furniture", "Books", "Accessories"].map((cat) => (
              <CategoryTag 
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section id="products" className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Produk Terbaru</h2>
              <p className="text-slate-600 text-sm mt-1">Cari barang incaranmu disini</p>
            </div>
            <Link href="/products" className="text-[#4e56c0] font-semibold text-sm hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard 
                  key={product._id || product.id || index}
                  product={product}
                  index={index}
                  isFavorite={favorites.has(index)}
                  onToggleFavorite={() => toggleFavorite(index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <CTASection />

      {/* FOOTER */}

      
    </div>
  )
}

// ==========================================
// SUB-COMPONENTS (FIXED COLORS)
// ==========================================

function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-[#4e56c0] via-[#9b5de0] to-[#d78fee] text-white py-24 sm:py-32">
            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in border border-white/30 text-white shadow-lg">
                    <Star className="w-4 h-4 text-[#fdcffa] fill-current" />
                    <span>Thrift Barang Kamu Disini</span>
                </div>
                
                {/* Heading */}
                <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 animate-slide-up leading-tight tracking-tight drop-shadow-sm">
                    Sell More, <br/>
                    <span className="text-[#fdcffa] drop-shadow-md">Spend Less.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200 font-medium">
                    Temukan ribuan barang berkualitas. Hemat uangmu, selamatkan bumi.
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up animation-delay-200">
                    <Link href="/products" className="px-8 py-4 bg-white text-[#4e56c0] rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Belanja Sekarang
                    </Link>
                    <Link href="/add-product" className="px-8 py-4 bg-white/10 border border-white/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white/20 transition-all">
                        Jual Barang
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#9b5de0] rounded-full filter blur-[100px] opacity-50 animate-blob"></div>
                 <div className="absolute top-0 -right-24 w-96 h-96 bg-[#fdcffa] rounded-full filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                 <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-[#d78fee] rounded-full filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
            </div>
        </section>
    )
}

function FeatureCard({ icon, title, description, gradient }: any) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-[#9b5de0]/30 hover:shadow-lg transition-all duration-300 group">
      <div className={`w-14 h-14 bg-linear-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-1.5 text-lg">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}

function CategoryTag({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active
          ? "bg-[#4e56c0] text-white shadow-md ring-2 ring-offset-1 ring-[#4e56c0]/50"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#9b5de0]/50"
        }`}
    >
      {label}
    </button>
  )
}

function ProductCard({ product, isFavorite, onToggleFavorite }: any) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(product.price)

  const productId = product._id || product.id

  return (
    <Link href={`/products/${productId}`} className="block group h-full">
        <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#9b5de0]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            
            {/* Image */}
            <div className="relative aspect-4/5 bg-slate-100 overflow-hidden">
                <img
                    src={product.image || "https://placehold.co/400"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#fdcffa]/90 backdrop-blur rounded-lg text-xs font-bold text-[#4e56c0] shadow-sm">
                    {product.condition}
                </div>


            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-[#4e56c0] transition-colors text-lg">
                    {product.name}
                </h3>
                
                <div className="mt-auto pt-2">
                    <p className="text-lg font-bold text-[#4e56c0] mb-2">
                        {formattedPrice}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> Indonesia
                        </div>
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
                            {product.size}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
  )
}

function ProductSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="bg-slate-200 aspect-4/5 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-600">Belum Ada Produk</h3>
            <Link href="/add-product" className="text-sm text-[#4e56c0] hover:underline mt-2 inline-block font-medium">
                Jual produk pertama →
            </Link>
        </div>
    )
}

function CTASection() {
    return (
        // FIX 2: Ganti background slate-900 (kusam) ke Gradient Brand yang cerah
        <section className="py-24 bg-linear-to-br from-[#4e56c0] via-[#9b5de0] to-[#d78fee] text-white text-center relative overflow-hidden">
            
            {/* Background Orbs Effect */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>
            </div>
            
            <div className="max-w-3xl mx-auto px-4 relative z-10">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-sm">
                    Punya Barang Nganggur?
                </h2>
                <p className="text-white/90 mb-10 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
                    Jadikan uang tunai dalam hitungan menit. Gratis listing dan langsung terhubung ke pembeli!
                </p>
                <Link href="/add-product" className="inline-block px-10 py-4 bg-white text-[#4e56c0] hover:bg-[#fdcffa] rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                    Mulai Jualan Sekarang
                </Link>
            </div>
        </section>
    )
}

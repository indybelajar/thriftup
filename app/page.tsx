"use client"

import { useState, useEffect } from "react"
import Link from "next/link" 
import { MapPin, Star, TrendingUp, Package, Shield, Heart } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      
      {/* NOTE: Saya MENGHAPUS Navbar di sini agar tidak nabrak dengan MainNav.
          Pastikan <MainNav /> dipasang di file 'app/layout.tsx' kamu.
      */}

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
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="Harga Terbaik"
              description="Hemat hingga 70%"
              gradient="from-violet-500 to-purple-500"
            />
            <FeatureCard 
              icon={<Package className="w-6 h-6" />}
              title="Kualitas Terjamin"
              description="Produk terverifikasi"
              gradient="from-pink-500 to-rose-500"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="sticky top-[60px] z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
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
              <h2 className="text-3xl font-bold text-slate-800">Produk Terbaru</h2>
              <p className="text-slate-600 text-sm mt-1">Barang branded harga miring</p>
            </div>
            <Link href="/products" className="text-[#3B82F6] font-semibold text-sm hover:underline">
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
      <Footer />
      
      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; animation-fill-mode: both; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] text-white py-16 sm:py-24">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 animate-fade-in border border-white/20">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span>Thrift No. 1 di Indonesia</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-bold mb-6 animate-slide-up leading-tight">
                    Gaya Sultan, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Dompet Teman.</span>
                </h1>
                
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                    Temukan ribuan barang branded preloved berkualitas. Hemat uangmu, selamatkan bumi.
                </p>
                
                <div className="flex justify-center gap-4 animate-slide-up animation-delay-200">
                    <Link href="/products" className="px-8 py-3 bg-white text-[#3B82F6] rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        Belanja Sekarang
                    </Link>
                    <Link href="/add-product" className="px-8 py-3 bg-white/10 border border-white/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white/20 transition-all">
                        Jual Barang
                    </Link>
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ icon, title, description, gradient }: any) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}

function CategoryTag({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active
          ? "bg-slate-900 text-white shadow-md"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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

  // FIX LINK DETAIL: Menggunakan ID yang benar
  const productId = product._id || product.id

  return (
    // FIX: Membungkus seluruh card dengan Link
    <Link href={`/products/${productId}`} className="block group h-full">
        <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                    src={product.image || "https://placehold.co/400"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge Condition */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-md text-[10px] font-bold text-slate-700 shadow-sm">
                    {product.condition}
                </div>

                {/* Love Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault() // Mencegah pindah halaman saat klik love
                        e.stopPropagation()
                        onToggleFavorite()
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-all z-10"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                
                <div className="mt-auto">
                    <p className="text-lg font-bold text-blue-600 mb-2">
                        {formattedPrice}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Indonesia
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
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
                <div className="bg-slate-200 aspect-square rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-600">Belum Ada Produk</h3>
            <Link href="/add-product" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                Jual produk pertama →
            </Link>
        </div>
    )
}

function CTASection() {
    return (
        <section className="py-16 bg-slate-900 text-white text-center">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Punya Barang Nganggur?</h2>
                <p className="text-slate-400 mb-8">Jadikan uang tunai dalam hitungan menit. Gratis listing!</p>
                <Link href="/add-product" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-all">
                    Mulai Jualan
                </Link>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-8 text-center text-sm text-slate-500">
            <p>© 2025 ThriftUp! All rights reserved.</p>
        </footer>
    )
}
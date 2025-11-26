"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Search, ShoppingCart, User, Facebook, Instagram, Twitter } from "lucide-react"



export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* ================= HERO ================= */}
      <section className="w-full py-10 bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#A5B4FC] text-white">
        <div className="mx-auto px-6 flex flex-col justify-center h-full">
          <div className="max-w-2xl space-y-6">

            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" /> 
              <span>Belanja Hemat, Ramah Lingkungan</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-sm">
              Temukan Harta Karun <br/> Tersembunyi di ThriftUp!
            </h1>

            <p className="text-white/90 text-lg leading-relaxed max-w-lg">
              Marketplace barang bekas terpercaya dengan ribuan produk berkualitas. Mulai dari fashion, elektronik, hingga koleksi vintage langka.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#products" className="px-8 py-3.5 bg-white text-[#3B82F6] rounded-full font-bold shadow-lg hover:bg-[#E2E8F0] transition active:scale-95">
                Mulai Belanja
              </Link>
              <Link href="/add-product" className="px-8 py-3.5 border border-white text-white rounded-full font-bold hover:bg-white/10 transition active:scale-95">
                Jual Barangmu
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="w-full bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Fashion", "Electronics", "Furniture", "Books", "Accessories"].map((cat, i) => (
              <CategoryTag key={i} label={cat} active={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <section id="products" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Semua Produk</h2>
          <span className="text-slate-500 text-sm">{products.length} produk</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0F172A] text-slate-300 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl text-white">
              <div className="w-8 h-8 bg-[#3B82F6] text-white rounded-full flex items-center justify-center">T</div>
              ThriftUp!
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Platform jual beli barang bekas terpercaya di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Kategori</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer">Fashion</li>
              <li className="hover:text-white cursor-pointer">Elektronik</li>
              <li className="hover:text-white cursor-pointer">Furniture</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer">Cara Belanja</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer"/>
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer"/>
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer"/>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2025 ThriftUp! All rights reserved.
        </div>

      </footer>
    </div>
  )
}


/* ================= CATEGORY TAG ================= */
function CategoryTag({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`px-6 py-2 rounded-full text-sm font-medium transition whitespace-nowrap
        ${active
          ? "bg-[#6366F1] text-white shadow-md hover:bg-[#3B82F6]"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
        }`}
    >
      {label}
    </button>
  )
}


/* ================= PRODUCT CARD ================= */
function ProductCard({ product }: any) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border-none shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">

      <div className="relative aspect-square bg-slate-200">
        <Image
          src={product.image || "/api/placeholder/400/400"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-3 left-3 bg-[#6366F1] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
          {product.discount}
        </span>

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm">
          {product.condition}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-lg truncate mb-1">
          {product.title}
        </h3>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-[#3B82F6] font-bold text-lg">{product.price}</span>
          <span className="text-slate-400 text-sm line-through mb-0.5">{product.oldPrice}</span>
        </div>

        <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              {product.storeInitial}
            </div>
            <span className="text-slate-600 truncate max-w-[80px]">{product.store}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-current" /> {product.rating}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
          <MapPin className="w-3 h-3" /> {product.location}
        </div>
      </div>
    </div>
  )
}


/* ================= SAMPLE DATA ================= */
const products = [
  {
    title: "Vintage Polaroid Camera",
    price: "Rp 450.000",
    oldPrice: "Rp 850.000",
    discount: "-47%",
    condition: "Good",
    image: "",
    store: "Retro Finds",
    storeInitial: "R",
    location: "Jakarta Selatan",
    rating: "4.8",
  },
  {
    title: "Denim Jacket Vintage 90s",
    price: "Rp 175.000",
    oldPrice: "Rp 350.000",
    discount: "-50%",
    condition: "Like New",
    image: "",
    store: "Thrift Paradise",
    storeInitial: "T",
    location: "Bandung",
    rating: "4.9",
  },
  {
    title: "Kursi Kayu Antik Jati",
    price: "Rp 1.200.000",
    oldPrice: "Rp 2.500.000",
    discount: "-52%",
    condition: "Good",
    image: "",
    store: "Heritage Furniture",
    storeInitial: "H",
    location: "Yogyakarta",
    rating: "5.0",
  },
  {
    title: "Radio Tube Vintage Philips",
    price: "Rp 850.000",
    oldPrice: "Rp 1.500.000",
    discount: "-43%",
    condition: "Good",
    image: "",
    store: "Vintage Electronics",
    storeInitial: "V",
    location: "Surabaya",
    rating: "4.7",
  },
]

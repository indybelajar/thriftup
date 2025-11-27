"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import router
import { Search, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function MainNav() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  
  // State untuk search
  const [query, setQuery] = useState("")
  const router = useRouter()

  // Fungsi handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault() // Mencegah reload halaman
    if (query.trim()) {
      // Arahkan ke halaman products dengan query param
      router.push(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

        {/* LEFT: LOGO */}
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          {/* Pastikan file logo.png ada di folder public, atau ganti icon */}
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          ThriftUp
        </Link>

        {/* MIDDLE: SEARCH BAR */}
        {/* Gunakan tag <form> agar bisa disubmit pakai tombol Enter */}
        <form 
          onSubmit={handleSearch} 
          className="hidden sm:flex items-center w-72 bg-white px-3 py-2 border rounded-full shadow-sm"
        >
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Cari barang..."
            className="ml-2 text-sm w-full outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-4 text-[#3B82F6]">

          {/* PROFILE BUTTON */}
          <Link
            href="/profile"
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <User className="w-6 h-6" />
          </Link>

          {/* CART BUTTON */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-slate-100 rounded-full transition"
          >
            <ShoppingCart className="w-6 h-6" />

            {/* CART BADGE */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
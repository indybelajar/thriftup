"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image" // Import component Image
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MainNav() {
  const { data: session } = useSession()
  const { items } = useCart()
  const router = useRouter()
  const [query, setQuery] = useState("")

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  // Helper untuk mendapatkan inisial nama
  const getInitials = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">

        {/* LEFT: LOGO */}
        <Link href="/" className="font-bold text-xl flex items-center gap-3 group transition-opacity hover:opacity-90">
          
          {/* LOGO IMAGE - ROUNDED */}
          <div className="relative w-10 h-10 group-hover:scale-105 transition-transform rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white">
            <Image 
              src="/logo.svg" 
              alt="ThriftUp Logo"
              fill
              className="object-cover" // Gunakan cover agar gambar memenuhi lingkaran
              unoptimized={true} 
            />
          </div>
          
          <span className="hidden sm:inline bg-linear-to-r from-[#9b5de0] to-[#4e56c0] bg-clip-text text-transparent font-extrabold tracking-tight text-2xl">
            ThriftUp
          </span>
        </Link>

        {/* MIDDLE: SEARCH BAR */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center w-80 lg:w-96 bg-white px-4 py-2.5 border border-slate-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#9b5de0]/30 focus-within:border-[#9b5de0] transition-all"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari barang..."
            className="ml-3 text-sm w-full outline-none bg-transparent placeholder:text-slate-400 text-slate-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-1 sm:gap-3">

          {/* 1. SEARCH BUTTON (Mobile Only) */}
          <button className="md:hidden p-2.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
             <Search className="w-5 h-5" />
          </button>

          {/* 2. CART BUTTON */}
          <Link
            href="/cart"
            className="relative p-2.5 hover:bg-[#fdf4ff] rounded-full transition-colors text-slate-600 hover:text-[#4e56c0] group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Pembatas Kecil */}
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* 3. USER AUTH LOGIC */}
          {session ? (
            // JIKA LOGIN: Tampilkan Avatar (ke Profile) & Logout
            <div className="flex items-center gap-2 pl-2 sm:pl-0">
              
              {/* Profile Link (Avatar) */}
              <Link href="/profile" title="Profil Saya">
                <Avatar className="w-9 h-9 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#9b5de0] transition-all">
                  <AvatarImage src={session.user?.image || ""} className="object-cover" />
                  <AvatarFallback className="bg-linear-to-br from-[#4e56c0] to-[#9b5de0] text-white text-xs font-bold">
                    {getInitials(session.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Logout Button (Desktop) */}
              <button 
                onClick={() => signOut({ callbackUrl: "/" })} 
                className="hidden sm:flex p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // JIKA BELUM LOGIN: Tombol Masuk
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-slate-700 hover:bg-[#f8fafc] hover:text-[#4e56c0] transition-colors border border-transparent hover:border-slate-200 ml-2"
              title="Masuk / Daftar"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  )
}
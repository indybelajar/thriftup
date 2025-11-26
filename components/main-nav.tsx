"use client"

import Link from "next/link"
import { Search, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function MainNav() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

        {/* LEFT: LOGO */}
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-7 h-7" />
          ThriftUp
        </Link>

        {/* MIDDLE: SEARCH BAR */}
        <div className="hidden sm:flex items-center w-72 bg-white px-3 py-2 border rounded-full shadow-sm">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search items…"
            className="ml-2 text-sm w-full outline-none"
          />
        </div>

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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

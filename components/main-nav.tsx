"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export function MainNav() {
  const { items } = useCart()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        
        {/* LOGO */}
        <Link href="/" className="font-semibold text-lg">
          ThriftUp!
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {/* ADD PRODUCT DIHAPUS */}

          <Link href="/cart" className="relative hover:underline">
            Cart
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* NEW PROFILE BUTTON */}
          <Link href="/profile" className="hover:underline font-semibold">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}

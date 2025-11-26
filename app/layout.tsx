import "./globals.css"
import type { Metadata } from "next"
import { CartProvider } from "@/lib/cart-context"
import { MainNav } from "@/components/main-nav"

export const metadata: Metadata = {
  title: "ThriftUp",
  description: "Thrifting store with cart & checkout",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f7f5] text-slate-900">
        <CartProvider>
          <MainNav />
          <main className="mx-auto max-w-5xl px-4 py-6">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}

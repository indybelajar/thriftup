import "./globals.css"
import type { Metadata } from "next"
import { CartProvider } from "@/lib/cart-context"
import { MainNav } from "@/components/main-nav"

export const metadata: Metadata = {
  title: "ThriftUp - Thrift with Purpose",
  description: "Platform jual beli barang bekas terpercaya di Indonesia",
  keywords: ["thrift", "secondhand", "preloved", "barang bekas", "marketplace"],
  authors: [{ name: "ThriftUp Team" }],
  openGraph: {
    title: "ThriftUp - Thrift with Purpose",
    description: "Platform jual beli barang bekas terpercaya di Indonesia",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 antialiased">
        <CartProvider>
          {/* Main Navigation */}
          <MainNav />
          
          {/* Main Content with Smooth Container */}
          <main className="relative">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              {/* Gradient Orbs */}
              <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-40 w-80 h-80 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative">
                <div className="relative">
                  {children}
              </div>
            </div>
          </main>


        </CartProvider>
      </body>
    </html>
  )
}
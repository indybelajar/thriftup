"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react"

export default function CartPage() {
  // Ambil fungsi dari context
  const { items, addToCart, removeFromCart, totalPrice, clearCart } = useCart()

  // --- FORMAT CURRENCY ---
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  // --- EMPTY STATE (Jika keranjang kosong) ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <div className="bg-slate-100 p-6 rounded-full animate-in zoom-in-50 duration-300">
            <ShoppingCart className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Keranjangmu Kosong</h1>
        <p className="text-slate-500 max-w-sm">
          Sepertinya kamu belum menambahkan barang apapun. Yuk cari harta karun thrift favoritmu!
        </p>
        <Link href="/products">
          <Button className="mt-4 px-8" size="lg">
            Mulai Belanja
          </Button>
        </Link>
      </div>
    )
  }

  // --- CART CONTENT ---
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Keranjang Belanja</h1>
            <p className="text-slate-500 mt-1">
                Kamu punya {items.reduce((acc, item) => acc + item.quantity, 0)} barang di keranjang.
            </p>
        </div>
        <Button 
            variant="ghost" 
            onClick={clearCart} 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 self-start md:self-auto transition-colors"
        >
            <Trash2 className="w-4 h-4 mr-2" /> Hapus Semua
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: LIST PRODUK */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card 
              // Handle ID: Cek _id dulu (MongoDB), kalau null pakai id biasa
              key={item.product._id || item.product.id} 
              className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex gap-4 p-4">
                
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden border border-slate-100">
                    <Image 
                        // Cek apakah image ada, kalau kosong pakai placeholder
                        src={item.product.image || "https://placehold.co/200"} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        // PENTING: unoptimized=true biar gak error hostname
                        unoptimized={true}
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                            <h3 className="font-semibold text-slate-800 line-clamp-2 text-lg">
                                {item.product.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    Size: {item.product.size}
                                </span>
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    {item.product.condition}
                                </span>
                            </div>
                        </div>
                        <p className="font-bold text-slate-900 whitespace-nowrap text-lg">
                            {formatRupiah(item.product.price * item.quantity)}
                        </p>
                    </div>

                    {/* Quantity Control & Price per item */}
                    <div className="flex items-end justify-between mt-4 sm:mt-0">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm"
                                onClick={() => removeFromCart(item.product._id || item.product.id)}
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm"
                                onClick={() => addToCart(item.product)}
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="text-xs text-slate-400 hidden sm:block">
                            @ {formatRupiah(item.product.price)} / pcs
                        </div>
                    </div>
                </div>

              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT COLUMN: SUMMARY (Sticky) */}
        <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-md border-slate-200 bg-white">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Total Harga ({items.reduce((a, b) => a + b.quantity, 0)} barang)</span>
                        <span className="font-medium">{formatRupiah(totalPrice)}</span>
                    </div>
                    {/* Contoh Biaya Tambahan (Opsional) */}
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Biaya Layanan</span>
                        <span className="font-medium">Rp 2.000</span>
                    </div>
                    
                    <Separator className="my-2"/>
                    
                    <div className="flex justify-between items-center text-lg text-slate-900">
                        <span className="font-bold">Total Tagihan</span>
                        <span className="font-bold text-[#3B82F6]">{formatRupiah(totalPrice + 2000)}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pb-6">
                    <Link href="/checkout" className="w-full">
                        <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] h-12 text-base font-bold shadow-blue-200 shadow-lg transition-all active:scale-95">
                            Checkout Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/products" className="w-full">
                        <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Lanjut Belanja
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  )
}
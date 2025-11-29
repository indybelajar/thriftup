"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, addToCart, removeFromCart, totalPrice, clearCart } = useCart()

  // --- LOGIC BIAYA LAYANAN ---
  const serviceFee = totalPrice * 0.10 // 10% dari total harga
  const grandTotal = totalPrice + serviceFee

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-[#f8fafc]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Keranjang Kosong</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Yuk cari harta karun thrift favoritmu!
        </p>
        <Link href="/products">
          <Button className="bg-[#4e56c0] hover:bg-[#3d44a0] shadow-lg shadow-indigo-200 transition-all px-8 h-12 text-base font-bold">
            Mulai Belanja
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Keranjang ({items.reduce((acc, item) => acc + item.quantity, 0)})</h1>
            
            <Button 
                onClick={clearCart} 
                className="bg-transparent hover:bg-red-50 text-red-500 h-9 px-3 text-sm font-medium shadow-none"
            >
                Hapus Semua
            </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            
            {/* LIST PRODUK */}
            <div className="space-y-3">
            {items.map((item) => (
                // FIX: Menggunakan (as any)._id untuk menghindari error TS 'id does not exist'
                <Card key={(item.product as any)._id} className="border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-4 flex gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                            <Image 
                                src={item.product.image || "https://placehold.co/200"} 
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h3 className="font-semibold text-slate-800 line-clamp-1 text-sm sm:text-base">
                                        <Link href={`/products/${(item.product as any)._id}`} className="hover:text-[#4e56c0] transition-colors">
                                            {item.product.name}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Size: {item.product.size || "-"} • {item.product.condition}
                                    </p>
                                </div>
                                <p className="font-bold text-slate-900 text-sm">
                                    {formatRupiah(item.product.price * item.quantity)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-[10px] sm:text-xs text-slate-400">
                                    @ {formatRupiah(item.product.price)}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => removeFromCart((item.product as any)._id)}
                                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-slate-700 text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => addToCart(item.product)}
                                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            </div>

            {/* SUMMARY */}
            <Card className="border-none shadow-sm bg-white sticky top-24">
                <CardContent className="p-6 space-y-4">
                    <h2 className="font-bold text-slate-900">Ringkasan</h2>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatRupiah(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-[#4e56c0]">
                            <span>Biaya Layanan (10%)</span>
                            <span>{formatRupiah(serviceFee)}</span>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>Total</span>
                        <span className="text-lg text-[#4e56c0]">{formatRupiah(grandTotal)}</span>
                    </div>

                    <Link href="/checkout" className="block pt-2">
                        <Button className="w-full bg-[#4e56c0] hover:bg-[#3d44a0] font-bold h-10 shadow-lg shadow-indigo-100">
                            Checkout <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
        </div>
    </div>
  )
}
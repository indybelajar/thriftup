"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, ShoppingBag } from "lucide-react"

export default function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart()

  // State untuk data pembeli
  const [buyerName, setBuyerName] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [buyerAddress, setBuyerAddress] = useState("")

  // NOMOR WA ADMIN (Sesuai request)
  const ADMIN_WA_NUMBER = "6285624071378" 

  const handleCheckoutToWhatsApp = () => {
    // 1. Validasi Input
    if (!buyerName || !buyerPhone || !buyerAddress) {
      alert("Mohon lengkapi data diri dan alamat pengiriman dulu ya!")
      return
    }

    // 2. Susun List Barang
    const itemsList = items
      .map((item, index) => {
        return `${index + 1}. ${item.product.name} (Size: ${item.product.size || '-'})
   - Qty: ${item.quantity}
   - Harga: Rp ${item.product.price.toLocaleString("id-ID")}
   - Penjual WA: ${item.product.sellerWhatsapp || "-"}`
      })
      .join("\n")

    // 3. Susun Pesan Lengkap
    const message = `Halo Admin ThriftUp! Saya mau checkout dong:

*DATA PEMBELI*
Nama: ${buyerName}
No WA: ${buyerPhone}
Alamat: ${buyerAddress}

*DETAIL PESANAN*
${itemsList}

*TOTAL TAGIHAN: Rp ${totalPrice.toLocaleString("id-ID")}*

Mohon info rekening untuk pembayaran ya. Terima kasih!`

    // 4. Buat Link WhatsApp
    const encodedMessage = encodeURIComponent(message)
    const waLink = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodedMessage}`

    // 5. Buka WhatsApp & Clear Cart
    window.open(waLink, "_blank")
    clearCart() 
  }

  // JIKA KERANJANG KOSONG
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Keranjang Kosong</h1>
        <p className="text-slate-600">Yuk isi keranjangmu dengan barang thrift keren!</p>
        <Link href="/products">
          <Button>Balik Belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <Link href="/cart" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4"/> Kembali ke Keranjang
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="text-slate-500 mt-1">Lengkapi data diri untuk memproses pesanan via WhatsApp.</p>
      </div>

      <div className="grid md:grid-cols-[1.5fr,1fr] gap-8">
        
        {/* KOLOM KIRI: FORM DATA DIRI */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Data Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input 
                        id="name" 
                        placeholder="Contoh: Budi Santoso" 
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="focus-visible:ring-blue-500"
                    />
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="phone">Nomor WhatsApp Aktif</Label>
                    <Input 
                        id="phone" 
                        placeholder="Contoh: 08123456789" 
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="focus-visible:ring-blue-500"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea 
                        id="address" 
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos" 
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        className="min-h-[100px] focus-visible:ring-blue-500"
                    />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: RINGKASAN & ACTION */}
        <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-lg sticky top-24">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg">Ringkasan Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm items-start">
                            <span className="text-slate-600 w-2/3">
                                <span className="font-semibold text-slate-900">{item.quantity}x</span> {item.product.name}
                            </span>
                            <span className="font-medium text-slate-900">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.product.price * item.quantity)}
                            </span>
                        </li>
                        ))}
                    </ul>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-bold text-lg text-slate-900">
                        <span>Total Tagihan</span>
                        <span className="text-blue-600">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPrice)}
                        </span>
                    </div>

                    <div className="pt-4">
                        <Button 
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] h-12 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                            onClick={handleCheckoutToWhatsApp}
                        >
                            <Send className="w-4 h-4 mr-2" /> 
                            Lanjut ke WhatsApp
                        </Button>
                        <p className="text-xs text-center text-slate-500 mt-3 px-2">
                            Admin akan mengonfirmasi stok dan memberikan info pembayaran di WhatsApp.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  )
}
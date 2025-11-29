"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, ShoppingBag, MapPin, Phone, User, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart()
  const [buyerName, setBuyerName] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [buyerAddress, setBuyerAddress] = useState("")

  const serviceFee = totalPrice * 0.10
  const grandTotal = totalPrice + serviceFee
  const ADMIN_WA_NUMBER = "6285624071378" 

  const handleCheckoutToWhatsApp = () => {
    if (!buyerName || !buyerPhone || !buyerAddress) {
      alert("Mohon lengkapi data diri dan alamat pengiriman dulu ya!")
      return
    }
    const itemsList = items.map((item, index) => 
        `${index + 1}. ${item.product.name} (Size: ${item.product.size || '-'})
   - Qty: ${item.quantity}
   - Harga: Rp ${item.product.price.toLocaleString("id-ID")}`
    ).join("\n")

    const message = `Halo Admin ThriftUp! Saya mau checkout dong:

*DATA PEMBELI*
Nama: ${buyerName}
No WA: ${buyerPhone}
Alamat: ${buyerAddress}

*DETAIL PESANAN*
${itemsList}

----------------------------------
Subtotal: Rp ${totalPrice.toLocaleString("id-ID")}
Biaya Layanan (10%): Rp ${serviceFee.toLocaleString("id-ID")}
*TOTAL TAGIHAN: Rp ${grandTotal.toLocaleString("id-ID")}*
----------------------------------

Mohon info rekening untuk pembayaran ya. Terima kasih!`

    const encodedMessage = encodeURIComponent(message)
    const waLink = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodedMessage}`
    window.open(waLink, "_blank")
    clearCart() 
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center px-4 bg-[#f8fafc]">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-300">
            <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Keranjang Kosong</h1>
            <p className="text-slate-500">Yuk isi keranjangmu!</p>
        </div>
        <Link href="/products">
          <Button className="bg-[#4e56c0] hover:bg-[#3d44a0] shadow-lg h-12 px-8 font-bold">Mulai Belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex flex-col gap-4">
            {/* FIX: Ganti variant="outline" dengan className manual */}
            <Button 
                onClick={() => window.history.back()}
                className="self-start bg-white border border-slate-200 text-slate-600 hover:text-[#4e56c0] hover:bg-slate-50 h-9 px-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2"/> Kembali
            </Button>
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Pesanan</h1>
                <p className="text-slate-500 mt-1">Lengkapi data diri untuk memproses pesanan via WhatsApp.</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#fdf4ff] rounded-xl"><User className="w-6 h-6 text-[#9b5de0]" /></div>
                            <div><CardTitle className="text-lg font-bold text-slate-900">Data Pengiriman</CardTitle><CardDescription>Pastikan data yang kamu isi benar.</CardDescription></div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="grid gap-2">
                            <Label className="text-slate-700 font-medium">Nama Lengkap</Label>
                            <Input placeholder="Contoh: Budi Santoso" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="text-slate-700 focus-visible:ring-[#9b5de0]" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-slate-700 font-medium">Nomor WhatsApp</Label>
                            <Input placeholder="Contoh: 08123456789" type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="text-slate-700 focus-visible:ring-[#9b5de0]" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-slate-700 font-medium">Alamat Lengkap</Label>
                            <Textarea placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className="min-h-[120px] text-slate-700 focus-visible:ring-[#9b5de0]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-white border-slate-200 shadow-lg sticky top-24 overflow-hidden">
                    <div className="h-1.5 bg-linear-to-r from-[#4e56c0] via-[#9b5de0] to-[#fdcffa]"></div>
                    <CardHeader className="bg-white border-b border-slate-100 pb-4 pt-6">
                        <CardTitle className="text-lg font-bold text-slate-900">Ringkasan Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <ul className="space-y-4 max-h-80px overflow-y-auto pr-2 scrollbar-thin">
                            {items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm items-start gap-4">
                                <span className="text-slate-600 font-medium flex-1"><span className="text-[#4e56c0] font-bold mr-1">{item.quantity}x</span> {item.product.name}</span>
                                <span className="font-bold text-slate-900 whitespace-nowrap">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.product.price * item.quantity)}</span>
                            </li>
                            ))}
                        </ul>
                        <Separator className="bg-slate-100" />
                        <div className="flex justify-between items-center text-slate-900"><span className="font-bold text-lg">Total Tagihan</span><span className="font-black text-2xl text-[#4e56c0]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(grandTotal)}</span></div>
                        <div className="pt-4 space-y-3">
                            <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] h-12 text-base font-bold shadow-md text-white" onClick={handleCheckoutToWhatsApp}>
                                <Send className="w-4 h-4 mr-2" /> Lanjut ke WhatsApp
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}
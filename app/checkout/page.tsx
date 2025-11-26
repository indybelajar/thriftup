"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CheckoutPage() {
  const { totalPrice, items, clearCart } = useCart()

  const handleFinish = () => {
    clearCart()
    alert(
      "Thank you! Order kamu akan kami proses setelah pembayaran terkonfirmasi."
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-slate-600">
          Keranjangmu kosong. Tambahkan barang dulu sebelum checkout.
        </p>
        <Link href="/">
          <Button>Balik belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-slate-600">
          Scan QRIS lalu kirim bukti pembayaran ke admin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card className="space-y-3 p-4">
          <h2 className="text-sm font-semibold">Ringkasan Order</h2>
          <ul className="space-y-1 text-sm text-slate-700">
            {items.map((item) => (
              <li key={item.product._id}>
                {item.quantity}x {item.product.name}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-medium">Total</span>
            <span className="text-lg font-semibold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </Card>

        <Card className="space-y-3 p-4 text-center">
          <p className="text-sm font-medium">Scan QRIS untuk bayar</p>
          <div className="relative mx-auto h-48 w-48">
            <Image
              src="/qris.png"
              alt="QRIS ThriftUp"
              fill
              className="rounded-md object-contain"
            />
          </div>
          <Button className="w-full mt-2" onClick={handleFinish}>
            Saya sudah bayar
          </Button>
        </Card>
      </div>
    </div>
  )
}

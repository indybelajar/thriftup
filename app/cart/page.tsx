"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CartPage() {
  const { items, addToCart, removeFromCart, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <p className="text-sm text-slate-600">Keranjangmu masih kosong.</p>
        <Link href="/">
          <Button>Mulai belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          <p className="text-sm text-slate-600">
            Cek lagi sebelum lanjut ke checkout.
          </p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.product._id}
              className="flex items-center justify-between p-3"
            >
              <div>
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity} • Rp{" "}
                  {item.product.price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => addToCart(item.product)}
                >
                  +
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <Link href="/checkout">
            <Button className="w-full">Checkout</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

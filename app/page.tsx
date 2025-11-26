"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import type { ProductType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <p className="text-sm text-slate-600">Loading products...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">ThriftUp Collection</h1>
        <p className="text-sm text-slate-600">
          Barang-barang preloved yang siap diadopsi ✨
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-600">
          Belum ada barang. Tambah dulu di halaman Add Product.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Card key={product._id} className="flex flex-col overflow-hidden">
              <div className="aspect-[4/5] w-full bg-slate-200" />
              {/* nanti bisa ganti pakai <Image src={product.image} ... /> */}

              <div className="flex flex-1 flex-col gap-1 p-3">
                <h2 className="text-sm font-medium">{product.name}</h2>
                <p className="text-xs text-slate-500">
                  {product.size && <>Size {product.size} • </>}
                  {product.condition}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>

                <Button
                  className="mt-3 w-full"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

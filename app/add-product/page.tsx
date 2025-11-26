"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AddProductPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [size, setSize] = useState("")
  const [condition, setCondition] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          size,
          condition,
          image,
        }),
      })

      if (!res.ok) {
        alert("Gagal menyimpan produk")
        return
      }

      setName("")
      setPrice("")
      setSize("")
      setCondition("")
      setImage("")

      alert("Produk berhasil ditambahkan!")
      router.push("/")
    } catch (err) {
      console.error(err)
      alert("Terjadi error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Add New Product</h1>
      <Card className="p-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Nama Barang</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Vintage Denim Jacket"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Harga (Rp)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="120000"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Size</label>
            <Input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="S / M / L"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Condition</label>
            <Input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Like New / Good / etc"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image URL (optional)</label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

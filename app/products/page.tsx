"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Heart } from "lucide-react"

// Dummy data
const dummyProducts = [
  {
    id: 1,
    name: "Oversized Hoodie Uniqlo",
    price: 120000,
    size: "L",
    condition: "Like New",
    category: "outer",
    image: "",
  },
  {
    id: 2,
    name: "Vintage Denim Jacket",
    price: 175000,
    size: "M",
    condition: "Very Good",
    category: "outer",
    image: "",
  },
  {
    id: 3,
    name: "Crop Top Cotton On",
    price: 65000,
    size: "S",
    condition: "Good",
    category: "top",
    image: "",
  },
  {
    id: 4,
    name: "Korean Style Sweatshirt",
    price: 90000,
    size: "Free Size",
    condition: "Like New",
    category: "top",
    image: "",
  },
]

export default function ProductsPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredProducts =
    filter === "all"
      ? dummyProducts
      : dummyProducts.filter((p) => p.category === filter)

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Koleksi ThriftUp</h1>
          <p className="text-slate-600 mt-1">
            Barang preloved yang udah siap nemuin pemilik barunya ✨
          </p>
        </div>

        {/* FILTER */}
        <Select onValueChange={(val) => setFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="outer">Outer</SelectItem>
            <SelectItem value="dress">Dress</SelectItem>
            <SelectItem value="pants">Pants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST PRODUK */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((p) => (
          <Card key={p.id} className="overflow-hidden group relative">

            {/* IMAGE */}
            <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-500">
              Foto di sini
            </div>

            {/* WISHLIST ICON */}
            <button className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-full shadow hover:bg-white transition">
              <Heart className="w-4 h-4 text-pink-500" />
            </button>

            <CardContent className="p-4 space-y-1">
              <h2 className="font-medium text-sm">{p.name}</h2>

              <p className="text-xs text-slate-500">
                Size {p.size} • {p.condition}
              </p>

              <p className="font-semibold mt-1">
                Rp {p.price.toLocaleString("id-ID")}
              </p>

              <Button className="w-full mt-3">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

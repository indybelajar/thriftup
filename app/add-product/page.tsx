"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Loader2, UploadCloud, ArrowLeft, CheckCircle2, X 
} from "lucide-react"

export default function AddProductPage() {
  const router = useRouter()
  
  // Form States
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [size, setSize] = useState("")
  const [stock, setStock] = useState("1") // Default stock is 1
  const [condition, setCondition] = useState("")
  const [sellerWhatsapp, setSellerWhatsapp] = useState("")
  
  // Image Upload States
  const [image, setImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  // 1. FUNGSI UPLOAD KE CLOUDINARY
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!) // Dari .env.local

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) throw new Error("Gagal upload gambar")

      const data = await res.json()
      setImage(data.secure_url) // Simpan URL gambar dari Cloudinary
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal upload gambar. Coba lagi.")
    } finally {
      setUploading(false)
    }
  }

  // 2. FUNGSI REMOVE GAMBAR (Opsional)
  const handleRemoveImage = () => {
    setImage("")
  }

  // 3. SUBMIT KE DATABASE
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
          stock: Number(stock), // Send stock to API
          condition,
          image,
          sellerWhatsapp
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal menyimpan produk")
      }

      alert("Produk berhasil ditambahkan!")
      router.push("/")
    } catch (err) {
      console.error(err)
      alert("Terjadi error saat menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => router.back()}>
             <ArrowLeft className="w-5 h-5"/>
           </Button>
           <div>
             <h1 className="text-2xl font-bold text-slate-900">Jual Barang Baru</h1>
             <p className="text-slate-500">Isi detail barang yang ingin kamu jual</p>
           </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-white border-b border-slate-100 pb-4">
             <CardTitle className="text-lg">Informasi Produk</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* UPLOAD FOTO */}
              <div className="space-y-3">
                <Label>Foto Produk</Label>
                
                {!image ? (
                   // TAMPILAN BELUM ADA FOTO
                   <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {uploading ? (
                         <div className="flex flex-col items-center gap-2 text-blue-600">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="text-sm font-medium">Sedang mengupload...</span>
                         </div>
                      ) : (
                         <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                            <div className="p-3 bg-blue-50 rounded-full">
                               <UploadCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Klik untuk upload foto</span>
                            <span className="text-xs text-slate-400">Format: JPG, PNG (Max 5MB)</span>
                         </div>
                      )}
                   </div>
                ) : (
                   // TAMPILAN SUDAH ADA FOTO (PREVIEW)
                   <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 group">
                      <Image 
                        src={image} 
                        alt="Preview" 
                        fill 
                        className="object-cover" 
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button 
                           type="button" 
                           variant="destructive" 
                           size="sm" 
                           onClick={handleRemoveImage}
                           className="gap-2"
                         >
                            <X className="w-4 h-4"/> Ganti Foto
                         </Button>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                         <CheckCircle2 className="w-3 h-3"/> Uploaded
                      </div>
                   </div>
                )}
              </div>

              {/* FORM FIELDS LAINNYA */}
              <div className="grid gap-6">
                 
                 <div className="grid gap-2">
                    <Label>Nama Barang</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Contoh: Jaket Denim Levi's Vintage"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                       <Label>Harga (Rp)</Label>
                       <Input
                         type="number"
                         value={price}
                         onChange={(e) => setPrice(e.target.value)}
                         required
                         placeholder="150000"
                       />
                    </div>
                    <div className="grid gap-2">
                       <Label>Stok</Label>
                       <Input
                         type="number"
                         value={stock}
                         onChange={(e) => setStock(e.target.value)}
                         required
                         min="1"
                         placeholder="Jumlah stok"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                       <Label>Ukuran</Label>
                       <Input
                         value={size}
                         onChange={(e) => setSize(e.target.value)}
                         placeholder="S / M / L / XL"
                       />
                    </div>
                    <div className="grid gap-2">
                       <Label>Kondisi</Label>
                       <Input
                         value={condition}
                         onChange={(e) => setCondition(e.target.value)}
                         placeholder="Like New / Good / Minus dikit"
                       />
                    </div>
                 </div>

                 <div className="grid gap-2">
                    <Label>Nomor WhatsApp (Aktif)</Label>
                    <Input
                      type="tel"
                      value={sellerWhatsapp}
                      onChange={(e) => setSellerWhatsapp(e.target.value)}
                      required
                      placeholder="08xxxxxxxxxx"
                    />
                    <p className="text-xs text-slate-500">
                       Admin akan menghubungi nomor ini jika barang laku.
                    </p>
                 </div>

              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700"
                disabled={loading || uploading}
              >
                {loading ? (
                   <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Menyimpan...</> 
                ) : (
                   "Jual Barang Sekarang"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
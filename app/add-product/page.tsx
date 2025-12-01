"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react" // Import Session
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Loader2, UploadCloud, ArrowLeft, CheckCircle2, X, PackagePlus, ShieldAlert 
} from "lucide-react"
import Link from "next/link"

export default function AddProductPage() {
  const { data: session, status } = useSession() // Cek status login
  const router = useRouter()
  
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    stock: "1",
    condition: "",
    sellerWhatsapp: ""
  })
  
  const [image, setImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      )
      if (!res.ok) throw new Error("Gagal upload gambar")
      const json = await res.json()
      setImage(json.secure_url)
    } catch (error) {
      alert("Gagal upload gambar. Silakan coba lagi.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image,
        }),
      })

      if (!res.ok) throw new Error("Gagal menyimpan")
      
      alert("Produk berhasil ditambahkan!")
      router.push("/")
    } catch (err) {
      alert("Terjadi error saat menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  // --- RENDER: LOADING SESSION ---
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#4e56c0] animate-spin" />
        <p className="text-slate-500 font-medium">Memeriksa akses...</p>
      </div>
    )
  }

  // --- RENDER: BELUM LOGIN (PROTEKSI) ---
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md text-[#9b5de0]">
            <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Akses Dibatasi</h1>
            <p className="text-slate-500">
              Ups! Kamu harus login dulu sebelum mulai berjualan di ThriftUp.
            </p>
        </div>
        <div className="flex gap-4 w-full justify-center">
            <Link href="/login">
                <Button className="bg-[#4e56c0] hover:bg-[#3d44a0] w-32 font-bold shadow-lg shadow-indigo-200 h-11">
                  Login
                </Button>
            </Link>
            <Link href="/register">
                {/* FIX: Ganti variant="outline" dengan className manual */}
                <Button className="bg-transparent border border-slate-300 text-slate-700 hover:text-[#4e56c0] hover:bg-white w-32 font-bold h-11">
                  Daftar
                </Button>
            </Link>
        </div>
        <Button 
            onClick={() => router.push('/')}
            className="text-sm text-slate-400 hover:text-slate-600 bg-transparent hover:bg-transparent h-auto p-0"
        >
            Kembali ke Beranda
        </Button>
      </div>
    )
  }

  // --- RENDER: SUDAH LOGIN (FORM JUALAN) ---
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER NAVIGATION */}
        <div className="flex items-center gap-4">
           {/* FIX: Ganti variant="ghost" size="icon" dengan className manual */}
           <Button 
             onClick={() => router.back()}
             className="bg-transparent hover:bg-white text-[#4e56c0] w-10 h-10 p-0 rounded-full flex items-center justify-center transition-colors shadow-none"
           >
             <ArrowLeft className="w-5 h-5"/>
           </Button>
           <div>
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Jual Barang</h1>
             <p className="text-slate-500 text-sm">Hai {session?.user?.name}, ayo ubah barang tak terpakai jadi cuan!</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            
            {/* MAIN FORM */}
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#fdcffa] rounded-xl">
                                <PackagePlus className="w-6 h-6 text-[#4e56c0]" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Detail Produk</CardTitle>
                                <CardDescription className="text-slate-500">Lengkapi info produk selengkap mungkin</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-8">
                        <form id="product-form" className="space-y-8" onSubmit={handleSubmit}>
                        
                        {/* IMAGE UPLOADER */}
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-semibold text-sm">Foto Produk</Label>
                            
                            {!image ? (
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#fdf4ff] hover:border-[#9b5de0] transition-all relative cursor-pointer group bg-slate-50/50">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3 text-[#4e56c0]">
                                            <Loader2 className="w-10 h-10 animate-spin" />
                                            <span className="text-sm font-medium animate-pulse">Mengupload...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-slate-500 group-hover:text-[#4e56c0] transition-colors">
                                            <div className="p-4 bg-white shadow-sm rounded-full border border-slate-100 group-hover:shadow-md group-hover:scale-110 transition-all group-hover:border-[#fdcffa]">
                                                <UploadCloud className="w-8 h-8 text-[#9b5de0]" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-700 block group-hover:text-[#4e56c0]">Klik untuk upload</span>
                                                <span className="text-xs text-slate-400">JPG, PNG (Max 5MB)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200 group shadow-sm hover:shadow-md transition-all">
                                    <Image 
                                        src={image} 
                                        alt="Preview" 
                                        fill 
                                        className="object-cover" 
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        {/* FIX: Ganti variant="destructive" dengan className manual */}
                                        <Button 
                                            type="button" 
                                            onClick={() => setImage("")}
                                            className="gap-2 shadow-lg bg-red-500 hover:bg-red-600 text-white h-9 px-4 rounded-md"
                                        >
                                            <X className="w-4 h-4"/> Hapus Foto
                                        </Button>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg font-medium animate-in fade-in zoom-in">
                                        <CheckCircle2 className="w-3.5 h-3.5"/> Berhasil
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FORM FIELDS */}
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label className="text-slate-700 font-medium">Nama Barang</Label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Contoh: Jaket Denim Levi's Vintage 90s"
                                    className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0] placeholder:text-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-slate-700 font-medium">Harga (Rp)</Label>
                                    <Input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        placeholder="150000"
                                        className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0] placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-700 font-medium">Stok</Label>
                                    <Input
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-slate-700 font-medium">Ukuran</Label>
                                    <Input
                                        name="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        placeholder="S / M / L / XL / -"
                                        className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0] placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-slate-700 font-medium">Kondisi</Label>
                                    <Input
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        placeholder="Like New / Good"
                                        className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0] placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-slate-700 font-medium">Nomor WhatsApp (Aktif)</Label>
                                <Input
                                    name="sellerWhatsapp"
                                    type="tel"
                                    value={formData.sellerWhatsapp}
                                    onChange={handleChange}
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    className="text-slate-700 focus-visible:ring-[#9b5de0] focus-visible:border-[#9b5de0] placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Nomor ini akan dihubungi admin saat barang laku.
                                </p>
                            </div>
                        </div>

                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* SIDEBAR ACTIONS (Desktop Sticky) */}
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm bg-white sticky top-24 overflow-hidden">
                    <div className="h-1 bg-linear-to-r from-[#4e56c0] via-[#9b5de0] to-[#fdcffa]"></div>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Siap Jualan?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Pastikan foto jelas dan deskripsi sesuai. Barang yang menarik lebih cepat laku!
                        </p>
                        <Button 
                            form="product-form"
                            type="submit" 
                            className="w-full h-11 text-sm font-bold bg-[#4e56c0] hover:bg-[#3d44a0] shadow-md hover:shadow-lg hover:shadow-[#4e56c0]/20 transition-all active:scale-95 text-white"
                            disabled={loading || uploading}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Memproses...</> 
                            ) : (
                                "Jual Sekarang"
                            )}
                        </Button>
                        {/* FIX: Ganti variant="outline" dengan className manual */}
                        <Button 
                            type="button"
                            className="w-full h-11 bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </div>
  )
}
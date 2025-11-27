"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
// Tambahkan icon Camera dan X
import { Loader2, Camera, X } from "lucide-react"

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  // State Data Profile
  const [userId, setUserId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("") // State baru untuk URL foto
  
  // Loading States
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // State baru untuk upload
  const [isOpen, setIsOpen] = useState(false)

  // 1. SAAT HALAMAN DIBUKA: Cek ID & Ambil Data
  useEffect(() => {
    let storedId = localStorage.getItem("thriftup_user_id")

    if (!storedId) {
      storedId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("thriftup_user_id", storedId)
    }

    setUserId(storedId)
    fetchProfile(storedId)
  }, [])

  // 2. FUNGSI AMBIL DATA DARI DB
  const fetchProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${id}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.userId) {
            setName(data.name)
            setEmail(data.email)
            setBio(data.bio)
            // Set avatar URL jika ada di database
            if (data.avatar) setAvatarUrl(data.avatar)
        } else {
            // Default values
            setName("Guest User")
            setEmail("guest@thriftup.com")
            setBio("Pengguna baru di ThriftUp!")
        }
      }
    } catch (error) {
      console.error("Gagal ambil profil", error)
    } finally {
      setLoading(false)
    }
  }

  // --- FUNGSI UPLOAD KE CLOUDINARY (BARU) ---
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )

      if (!res.ok) throw new Error("Gagal upload gambar")

      const data = await res.json()
      setAvatarUrl(data.secure_url) // Simpan URL baru ke state
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal upload gambar profil.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
      setAvatarUrl("")
  }

  // 3. FUNGSI SIMPAN PROFIL
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          email,
          bio,
          avatar: avatarUrl // Kirim URL avatar ke API
        })
      })

      if (res.ok) {
        alert("Profil berhasil diupdate!")
        setIsOpen(false)
      } else {
        alert("Gagal menyimpan profil")
      }
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>
  }

  // Tentukan sumber gambar avatar (Cloudinary atau Dicebear default)
  const displayAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10 font-sans">

      {/* HEADER SECTION (Tampilan Utama) */}
      <section className="flex items-center gap-6">
        <Avatar className="w-24 h-24 border-2 border-slate-100 shadow-sm">
          <AvatarImage src={displayAvatar} className="object-cover" />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-bold text-slate-800">{name}</h1>
          <p className="text-slate-500">{email}</p>
          <div className="mt-2 text-xs text-slate-400 bg-slate-100 inline-block px-2 py-1 rounded">
            ID: {userId}
          </div>
        </div>
      </section>

      <Separator />
    
      {/* PROFILE CARD */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card className="p-6 bg-white shadow-sm border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800">Informasi Profil</h2>
                    
                    {/* === EDIT DIALOG === */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Edit Profil</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                        <DialogTitle>Edit Profil</DialogTitle>
                        <DialogDescription>Update foto dan informasi pribadimu.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            
                        {/* --- BAGIAN UPLOAD FOTO --- */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 border-4 border-slate-100 shadow-sm">
                                    {isUploading ? (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        </div>
                                    ) : (
                                        <AvatarImage src={displayAvatar} className="object-cover" />
                                    )}
                                    <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                
                                {/* Overlay Tombol Upload */}
                                <label 
                                    htmlFor="avatar-upload" 
                                    className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isUploading ? 'hidden' : ''}`}
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                    <input 
                                        id="avatar-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                </label>

                                {/* Tombol Hapus Foto (Muncul jika ada foto custom) */}
                                {avatarUrl && !isUploading && (
                                    <button 
                                        onClick={handleRemoveImage}
                                        className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors"
                                        type="button"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Klik gambar untuk mengubah foto.</p>
                        </div>

                        {/* --- FORM INPUTS --- */}
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Bio Singkat</Label>
                            <Textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)} 
                                className="resize-none"
                            />
                        </div>
                        </div>

                        <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading || isSaving}>Batal</Button>
                        <Button onClick={handleSaveProfile} disabled={isUploading || isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                        <span className="font-medium text-slate-500">Nama:</span>
                        <span className="text-slate-900">{name}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                        <span className="font-medium text-slate-500">Email:</span>
                        <span className="text-slate-900">{email}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                        <span className="font-medium text-slate-500">Bio:</span>
                        <span className="text-slate-900 leading-relaxed">{bio}</span>
                    </div>
                </div>
            </Card>

            {/* ADD PRODUCT SECTION */}
            <section>
                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-semibold text-slate-800">Kelola Produk</h2>
                </div>
                <Card className="p-8 bg-slate-50 border-dashed border-2 border-slate-300 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => window.location.href='/add-product'}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                        <span className="text-2xl">📦</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700">Jual Barang Baru</h3>
                        <p className="text-sm text-slate-500 mt-1">Tambahkan koleksi thriftmu untuk dijual</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Tambah Produk
                    </Button>
                </Card>
            </section>
        </div>

        {/* SIDEBAR STATS */}
        <div className="md:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
                <h3 className="font-semibold mb-4 opacity-90">Statistik Kamu</h3>
                <div className="space-y-4">
                    <div>
                        <span className="text-3xl font-bold">0</span>
                        <p className="text-sm opacity-80">Barang Terjual</p>
                    </div>
                    <div>
                        <span className="text-3xl font-bold">Rp 0</span>
                        <p className="text-sm opacity-80">Total Pendapatan</p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  )
}
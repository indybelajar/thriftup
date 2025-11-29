"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Camera, X, LogOut, User, Mail, FileText, Package, ArrowRight, ShieldCheck } from "lucide-react"

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchProfile(session.user.email)
    }
  }, [status, session])

  const fetchProfile = async (email: string) => {
    setLoadingProfile(true)
    try {
      const res = await fetch(`/api/profile?email=${email}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.email) {
            setName(data.name || session?.user?.name || "")
            setBio(data.bio || "Pengguna ThriftUp")
            setAvatarUrl(data.avatar || session?.user?.image || "")
        } else {
            setName(session?.user?.name || "")
            setBio("Pengguna baru di ThriftUp!")
            setAvatarUrl(session?.user?.image || "")
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData })
      if (!res.ok) throw new Error("Gagal")
      const data = await res.json()
      setAvatarUrl(data.secure_url)
    } catch (error) {
      alert("Gagal upload gambar.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!session?.user?.email) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, name, bio, avatar: avatarUrl })
      })
      if (res.ok) {
        alert("Berhasil!")
        setIsOpen(false)
      } else alert("Gagal")
    } catch (error) { alert("Error") } finally { setIsSaving(false) }
  }

  if (status === "loading" || loadingProfile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (status === "unauthenticated") return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold">Akses Dibatasi</h1>
        <div className="flex gap-4"><Link href="/login"><Button className="bg-[#4e56c0] hover:bg-[#3d44a0]">Login</Button></Link></div>
      </div>
  )

  const displayAvatar = avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg ring-4 ring-[#f8fafc]">
                    <AvatarImage src={displayAvatar} className="object-cover" />
                    <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2 z-10">
                <h1 className="text-3xl font-extrabold text-slate-900">{name}</h1>
                <p className="text-slate-500 font-medium">{session?.user?.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#4e56c0] hover:bg-[#3d44a0] shadow-md font-bold">Edit Profil</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white">
                        <DialogHeader><DialogTitle>Edit Profil</DialogTitle><DialogDescription>Update info kamu.</DialogDescription></DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Avatar className="w-28 h-28 border-4 border-slate-50">
                                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <AvatarImage src={displayAvatar} className="object-cover" />}
                                </Avatar>
                                <label className="cursor-pointer text-sm text-[#4e56c0] font-bold hover:underline">
                                    Ubah Foto
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading}/>
                                </label>
                            </div>
                            <div className="space-y-4">
                                <div className="text-slate-700 space-y-2"><Label>Nama</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="focus-visible:ring-[#9b5de0]" /></div>
                                <div className="text-slate-700 space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="focus-visible:ring-[#9b5de0]" /></div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            {/* FIX: Ganti variant="outline" */}
                            <Button className="bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Batal</Button>
                            <Button onClick={handleSaveProfile} className="bg-[#4e56c0] hover:bg-[#3d44a0] text-white">Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* FIX: Ganti variant="outline" destructive */}
                <Button onClick={() => signOut({ callbackUrl: '/' })} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">Logout</Button>
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-1 bg-linear-to-r from-[#4e56c0] via-[#9b5de0] to-[#fdcffa]"></div>
                    <CardContent className="p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-4"><div className="p-3 bg-[#f8fafc] rounded-xl text-[#4e56c0]"><User className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 font-bold uppercase">Nama</p><p className="text-slate-900 font-medium text-lg">{name}</p></div></div>
                        <div className="flex items-center gap-4"><div className="p-3 bg-[#f8fafc] rounded-xl text-[#4e56c0]"><Mail className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p className="text-slate-900 font-medium text-lg">{session?.user?.email}</p></div></div>
                    </CardContent>
                </Card>
                <div onClick={() => window.location.href='/add-product'} className="group cursor-pointer">
                    <Card className="bg-linear-to-br from-[#4e56c0] to-[#6b73d6] border-none shadow-lg text-white hover:shadow-xl transition-all hover:-translate-y-1">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div className="flex items-center gap-5"><div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"><Package className="w-8 h-8 text-white" /></div><div><h3 className="text-xl font-bold">Jual Barang</h3><p className="text-indigo-100 mt-1">Jual barang bekasmu sekarang!</p></div></div>
                            <div className="bg-white text-[#4e56c0] p-3 rounded-full shadow-sm"><ArrowRight className="w-5 h-5" /></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
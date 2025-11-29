"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        // Reset form dan redirect ke login
        const form = e.target as HTMLFormElement
        form.reset()
        router.push("/login")
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (error) {
      setError("Terjadi kesalahan sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-slate-700 text-2xl font-bold text-center">Buat Akun Baru</CardTitle>
          <p className="text-sm text-center text-slate-500">
            Daftar untuk mulai berjualan dan belanja
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-slate-700 space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Budi Santoso" 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div className="text-slate-700 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@email.com" 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="text-slate-700 space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="******" 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Login di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Profile } from "@/lib/models/profile"

// --- GET: Ambil Profil Berdasarkan Email ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 })
    }

    await connectDB()
    
    const profile = await Profile.findOne({ email })
    
    // Kembalikan objek kosong jika belum ada profil (nanti frontend yang handle defaultnya)
    return NextResponse.json(profile || {})
  } catch (error) {
    console.error("Error getting profile:", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}

// --- POST: Simpan/Update Profil ---
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, bio, avatar } = body

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 })
    }

    await connectDB()

    // Cari berdasarkan email, lalu update atau buat baru (upsert)
    const profile = await Profile.findOneAndUpdate(
      { email },
      { name, email, bio, avatar },
      { upsert: true, new: true }
    )

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ message: "Error saving profile" }, { status: 500 })
  }
}
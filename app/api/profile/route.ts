import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Profile } from "@/lib/models/profile"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 })
    }

    await connectDB()
    
    const profile = await Profile.findOne({ userId })
    
    // Return empty object if null, let frontend handle defaults
    return NextResponse.json(profile || {})
  } catch (error) {
    console.error("Error getting profile:", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // TAMBAHKAN 'avatar' DI SINI
    const { userId, name, email, bio, avatar } = body

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 })
    }

    await connectDB()

    // UPDATE QUERY UNTUK MENYERTAKAN 'avatar'
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { name, email, bio, avatar },
      { upsert: true, new: true }
    )

    return NextResponse.json(profile)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error saving profile" }, { status: 500 })
  }
}
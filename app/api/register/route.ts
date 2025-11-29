import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi." },
        { status: 400 }
      )
    }

    await connectDB()

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 400 }
      )
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat user baru
    await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "User created." }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    )
  }
}
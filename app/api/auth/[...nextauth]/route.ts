import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  // Provider: Cara login (kita pakai email & password sendiri, bukan Google/FB)
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Logic pengecekan password saat user klik LOGIN
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan Password wajib diisi")
        }

        // 1. Konek database
        await connectDB()

        // 2. Cari user berdasarkan email
        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          throw new Error("Email tidak ditemukan")
        }

        // 3. Cek password (bandingkan password input vs password database yg di-hash)
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordsMatch) {
          throw new Error("Password salah")
        }

        // 4. Jika sukses, kembalikan data user
        return user
      },
    }),
  ],
  // Konfigurasi Session (Pakai JWT agar ringan)
  session: {
    strategy: "jwt",
  },
  // Kunci rahasia untuk enkripsi token (WAJIB ADA di .env.local)
  secret: process.env.NEXTAUTH_SECRET,
  // Halaman custom (jika tidak diisi, NextAuth kasih halaman login bawaan yg jelek)
  pages: {
    signIn: "/login", 
  },
})

export { handler as GET, handler as POST }
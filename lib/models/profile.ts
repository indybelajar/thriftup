import mongoose, { Schema, models, model } from "mongoose"

const ProfileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "Guest User",
    },
    email: {
      type: String,
      default: "-",
    },
    bio: {
      type: String,
      default: "Pengguna baru ThriftUp!",
    },
    // --- TAMBAHKAN FIELD INI ---
    avatar: {
      type: String, // Menyimpan URL gambar (string)
      default: "",  // Default kosong jika user belum upload
    },
  },
  {
    timestamps: true,
  }
)

export const Profile = models.Profile || model("Profile", ProfileSchema)
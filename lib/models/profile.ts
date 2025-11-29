import mongoose, { Schema, models, model } from "mongoose"

const ProfileSchema = new Schema(
  {
    // Gunakan email sebagai ID unik karena terhubung dengan akun Login
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "Pengguna ThriftUp",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

export const Profile = models.Profile || model("Profile", ProfileSchema)
import mongoose, { Schema, models, model } from "mongoose"

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    condition: { type: String },
    image: { type: String },
    sellerWhatsapp: { type: String },
    
    // Tambahkan field Stock
    stock: { 
      type: Number, 
      default: 1, // Default stok 1 jika tidak diisi
      required: true 
    }, 
  },
  { timestamps: true }
)

export const Product = models.Product || model("Product", ProductSchema)
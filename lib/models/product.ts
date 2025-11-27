import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    stock: {
      type: Number,
      default: 1, // Default stock is 1
    },
    condition: {
      type: String,
    },
    image: {
      type: String,
    },
    sellerWhatsapp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Product = models.Product || model("Product", ProductSchema);
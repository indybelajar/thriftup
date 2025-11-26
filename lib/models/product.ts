import mongoose, { Schema, models, model } from "mongoose"

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
    condition: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Product =
  models.Product || model("Product", ProductSchema)

import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find().sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Extract stock from body
    const { name, price, size, stock, condition, image, sellerWhatsapp } = body

    if (!name || !price) {
      return NextResponse.json(
        { message: "Name and price are required" },
        { status: 400 }
      )
    }

    await connectDB()
    
    const product = await Product.create({
      name,
      price,
      size,
      stock: stock || 1, // Default to 1 if not provided
      condition,
      image,
      sellerWhatsapp,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
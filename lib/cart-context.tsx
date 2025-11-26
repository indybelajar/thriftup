"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { ProductType } from "./types"

export type CartItem = {
  product: ProductType
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: ProductType) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: ProductType) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id)
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product._id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  const clearCart = () => setItems([])

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

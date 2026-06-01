"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type CartItem = {
  productId: string
  productName: string
  productNameAr: string | null
  unit: "KG" | "PIECE"
  quantity: number
  unitPrice: number
  lineTotal: number
  image: string | null
}

type CartCtx = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string) => void
  clear: () => void
  totalItems: number
  totalAmount: number
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pastry-cart")
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  // Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem("pastry-cart", JSON.stringify(items))
  }, [items])

  function add(incoming: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === incoming.productId && i.unit === incoming.unit
      )
      if (existing) {
        return prev.map((i) =>
          i.productId === incoming.productId
            ? {
                ...i,
                quantity: Math.round((i.quantity + incoming.quantity) * 1000) / 1000,
                lineTotal: Math.round((i.lineTotal + incoming.lineTotal) * 1000) / 1000,
              }
            : i
        )
      }
      return [...prev, incoming]
    })
  }

  function remove(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function clear() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalAmount = Math.round(items.reduce((s, i) => s + i.lineTotal, 0) * 1000) / 1000

  return (
    <CartContext.Provider value={{ items, add, remove, clear, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}

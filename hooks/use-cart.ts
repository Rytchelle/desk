"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Product } from "@/lib/api"

export interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("vytrini-cart", [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || product.estoque || 0) }
            : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id != id))
    } else {
      setCart((prev) => prev.map((item) => (item.id == id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id != id))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || item.preco || 0) * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }
}

// Re-export Product type for convenience
export type { Product }

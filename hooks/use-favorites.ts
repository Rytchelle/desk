"use client"

import { useLocalStorage } from "./use-local-storage"

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>("vytrini-favorites", [])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }
}

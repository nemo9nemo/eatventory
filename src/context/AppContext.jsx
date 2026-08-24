import { createContext, useContext, useState } from 'react'
import { initialIngredients, recipes } from '../data/mock'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [favorites, setFavorites] = useState([])

  function addIngredient(ingredient) {
    setIngredients((prev) => [...prev, { ...ingredient, id: Date.now() }])
  }

  function updateIngredient(id, updates) {
    setIngredients((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  function removeIngredient(id) {
    setIngredients((prev) => prev.filter((item) => item.id !== id))
  }

  function toggleFavorite(recipeId) {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    )
  }

  const value = {
    ingredients,
    addIngredient,
    updateIngredient,
    removeIngredient,
    favorites,
    toggleFavorite,
    recipes,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

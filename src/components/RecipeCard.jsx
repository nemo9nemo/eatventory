import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getRecipeMatch } from '../utils/match'

export default function RecipeCard({ recipe }) {
  const { ingredients, favorites, toggleFavorite } = useApp()
  const ingredientNames = ingredients.map((i) => i.name)
  const { ownedCount, total, missing } = getRecipeMatch(recipe, ingredientNames)
  const isFavorite = favorites.includes(recipe.id)

  return (
    <div
      className="relative rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
      data-testid={`recipe-card-${recipe.id}`}
    >
      <button
        onClick={() => toggleFavorite(recipe.id)}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        data-testid={`favorite-toggle-${recipe.id}`}
        className="absolute right-2 top-2 text-gray-300 hover:text-amber-400 dark:text-gray-600 dark:hover:text-amber-400"
      >
        <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-amber-400' : ''} />
      </button>
      <Link to={`/recipes/${recipe.id}`} className="flex items-center gap-3 pr-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg font-medium text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          {recipe.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{recipe.name}</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            재료 {ownedCount}/{total}개 보유 · {recipe.time}
          </p>
          {missing.length > 0 && (
            <p className="mt-1 truncate text-xs text-amber-600 dark:text-amber-400">{missing.join(', ')} 없음</p>
          )}
        </div>
      </Link>
    </div>
  )
}

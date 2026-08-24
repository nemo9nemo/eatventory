import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, Check, X as XIcon, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, ingredients, favorites, toggleFavorite } = useApp()
  const recipe = recipes.find((r) => String(r.id) === id)
  const ingredientNames = ingredients.map((i) => i.name)

  if (!recipe) {
    return <div className="px-4 py-10 text-center text-sm text-gray-500">레시피를 찾을 수 없어요.</div>
  }

  const isFavorite = favorites.includes(recipe.id)

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between px-4 pt-6 md:px-8">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={20} className="text-gray-500" />
        </button>
        <button onClick={() => toggleFavorite(recipe.id)} aria-label="즐겨찾기 토글">
          <Star
            size={20}
            fill={isFavorite ? 'currentColor' : 'none'}
            className={isFavorite ? 'text-amber-400' : 'text-gray-300'}
          />
        </button>
      </div>

      <div className="px-4 md:px-8">
        <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-emerald-50 text-3xl font-medium text-emerald-600">
          {recipe.name.slice(0, 1)}
        </div>
        <h1 className="mt-4 text-xl font-medium text-gray-900">{recipe.name}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <Clock size={14} /> {recipe.time} · {recipe.difficulty}
        </p>

        <div className="mt-5">
          <h2 className="text-sm font-medium text-gray-900">재료</h2>
          <ul className="mt-2 space-y-1.5">
            {recipe.ingredients.map((ing) => {
              const owned = ingredientNames.includes(ing)
              return (
                <li key={ing} className="flex items-center gap-2 text-sm">
                  {owned ? <Check size={16} className="text-emerald-600" /> : <XIcon size={16} className="text-gray-300" />}
                  <span className={owned ? 'text-gray-900' : 'text-gray-400'}>{ing}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-900">조리 순서</h2>
          <ol className="mt-2 space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-medium text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'
import { getRecipeMatch } from '../utils/match'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'ready', label: '바로 만들 수 있어요' },
  { key: 'almost', label: '조금만 더 있으면 돼요' },
]

export default function RecipeList() {
  const navigate = useNavigate()
  const { ingredients, recipes } = useApp()
  const ingredientNames = ingredients.map((i) => i.name)
  const [filter, setFilter] = useState('all')

  const list = useMemo(() => {
    return recipes.filter((recipe) => {
      const { missing } = getRecipeMatch(recipe, ingredientNames)
      if (filter === 'ready') return missing.length === 0
      if (filter === 'almost') return missing.length > 0 && missing.length <= 2
      return true
    })
  }, [recipes, ingredientNames, filter])

  return (
    <div className="px-4 pb-10 pt-6 md:px-8">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={20} className="text-gray-500" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">레시피 추천</h1>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.length === 0 ? (
          <EmptyState title="조건에 맞는 레시피가 없어요" description="재료를 더 등록해보세요." />
        ) : (
          list.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        )}
      </div>
    </div>
  )
}

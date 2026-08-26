import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'
import { getRecipeMatch } from '../utils/match'

export default function Home() {
  const navigate = useNavigate()
  const { ingredients, recipes } = useApp()
  const ingredientNames = ingredients.map((i) => i.name)
  const expiringSoon = ingredients.filter((i) => typeof i.expiresInDays === 'number' && i.expiresInDays <= 3).length

  const recommended = [...recipes]
    .map((recipe) => ({ recipe, match: getRecipeMatch(recipe, ingredientNames) }))
    .sort((a, b) => b.match.ownedCount / b.match.total - a.match.ownedCount / a.match.total)
    .slice(0, 4)
    .map(({ recipe }) => recipe)

  return (
    <div className="px-4 pb-8 pt-6 md:px-8">
      <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">잇벤토리</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">있는 재료로 오늘 뭐 만들지 찾아보세요.</p>

      {ingredients.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="아직 등록된 재료가 없어요"
            description="냉장고에 재료를 등록하면 추천을 시작할 수 있어요."
            actionLabel="냉장고로 가기"
            onAction={() => navigate('/fridge')}
          />
        </div>
      ) : (
        <>
          <button
            onClick={() => navigate('/fridge')}
            className="mt-5 w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">보유 재료</p>
            <p className="mt-1 text-xl font-medium text-gray-900 dark:text-gray-100">
              {ingredients.length}개
              {expiringSoon > 0 && (
                <span className="ml-2 text-sm font-normal text-amber-600 dark:text-amber-400">유통기한 임박 {expiringSoon}개</span>
              )}
            </p>
            <p className="mt-1 text-xs text-curry-600 dark:text-curry-400">냉장고 보기 →</p>
          </button>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">오늘 만들 수 있는 요리</h2>
            <button onClick={() => navigate('/recipes')} className="flex items-center gap-1 text-xs text-curry-600 dark:text-curry-400">
              더 보기 <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {recommended.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

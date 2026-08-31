import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Sparkles, RefreshCw, Clock } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function RecipeAiResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const ingredientNames = location.state?.ingredientNames ?? []

  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [recipes, setRecipes] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  async function fetchRecipes() {
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/recommend-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientNames }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data) {
        throw new Error(data?.error || '레시피를 불러오지 못했어요. (배포 환경에서만 동작해요)')
      }
      setRecipes(data.recipes ?? [])
      setStatus('done')
    } catch (err) {
      setErrorMessage(err.message || '알 수 없는 오류가 발생했어요.')
      setStatus('error')
    }
  }

  useEffect(() => {
    if (ingredientNames.length > 0) fetchRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (ingredientNames.length === 0) {
    return (
      <div className="px-4 pb-10 pt-6 md:px-8">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">AI 레시피 추천</h1>
        </div>
        <div className="mt-6">
          <EmptyState
            title="선택된 재료가 없어요"
            description="냉장고에서 재료를 선택한 뒤 다시 시도해주세요."
            actionLabel="냉장고로 가기"
            onAction={() => navigate('/fridge')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-10 pt-6 md:px-8">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">AI 레시피 추천</h1>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        선택한 재료: <span className="text-gray-700 dark:text-gray-300">{ingredientNames.join(', ')}</span>
      </p>

      {status === 'loading' && (
        <div className="mt-14 flex flex-col items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles size={28} className="animate-pulse text-curry-500" />
          AI가 레시피를 만들고 있어요...
        </div>
      )}

      {status === 'error' && (
        <div className="mt-14 flex flex-col items-center gap-3 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{errorMessage}</p>
          <button
            onClick={fetchRecipes}
            className="flex items-center gap-1 rounded-full bg-curry-600 px-4 py-2 text-xs font-medium text-white dark:bg-curry-500"
          >
            <RefreshCw size={14} /> 다시 시도
          </button>
        </div>
      )}

      {status === 'done' && (
        <div className="mt-5 space-y-4">
          {recipes.length === 0 ? (
            <EmptyState title="추천할 레시피를 찾지 못했어요" description="다른 재료로 다시 시도해보세요." />
          ) : (
            recipes.map((recipe, idx) => (
              <div
                key={recipe.id ?? idx}
                data-testid={`ai-recipe-${idx}`}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
              >
                <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">{recipe.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={14} /> {recipe.time} · {recipe.difficulty}
                </p>

                {recipe.usedIngredients?.length > 0 && (
                  <p className="mt-2 text-xs text-curry-600 dark:text-curry-400">
                    사용 재료: {recipe.usedIngredients.join(', ')}
                  </p>
                )}
                {recipe.missingIngredients?.length > 0 && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    추가로 필요해요: {recipe.missingIngredients.join(', ')}
                  </p>
                )}

                <ol className="mt-3 space-y-2">
                  {recipe.steps?.map((step, stepIdx) => (
                    <li
                      key={stepIdx}
                      className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-curry-600 text-[11px] font-medium text-white dark:bg-curry-500">
                        {stepIdx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))
          )}

          <button
            onClick={fetchRecipes}
            className="flex w-full items-center justify-center gap-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <RefreshCw size={14} /> 다른 레시피 추천받기
          </button>
        </div>
      )}
    </div>
  )
}

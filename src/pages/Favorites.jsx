import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'

export default function Favorites() {
  const navigate = useNavigate()
  const { recipes, favorites } = useApp()
  const list = recipes.filter((r) => favorites.includes(r.id))

  return (
    <div className="px-4 pb-10 pt-6 md:px-8">
      <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">즐겨찾기</h1>
      <div className="mt-4 space-y-2">
        {list.length === 0 ? (
          <EmptyState
            title="즐겨찾기한 레시피가 없어요"
            description="레시피 추천 리스트에서 별 아이콘을 눌러 저장해보세요."
            actionLabel="레시피 보러 가기"
            onAction={() => navigate('/recipes')}
          />
        ) : (
          list.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        )}
      </div>
    </div>
  )
}

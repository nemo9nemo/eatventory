import { useMemo, useState } from 'react'
import { Plus, Search, Pin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import IngredientCard from '../components/IngredientCard'
import EmptyState from '../components/EmptyState'
import FridgeFrame from '../components/FridgeFrame'
import TemperatureTabs from '../components/TemperatureTabs'
import ShelfSection from '../components/ShelfSection'
import AddIngredientModal from './AddIngredientModal'

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'room', label: '실온' },
  { key: 'fridge', label: '냉장' },
  { key: 'frozen', label: '냉동' },
]

const SECTION_LABEL = { room: '실온 선반', fridge: '냉장 선반', frozen: '냉동 선반' }

export default function Fridge() {
  const navigate = useNavigate()
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useApp()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [modalState, setModalState] = useState(null) // null | 'new' | ingredient object

  const filtered = useMemo(() => {
    return ingredients.filter((item) => {
      const matchesTab = tab === 'all' || item.category === tab
      const matchesQuery = item.name.includes(query.trim())
      return matchesTab && matchesQuery
    })
  }, [ingredients, tab, query])

  const grouped = useMemo(() => {
    const categories = tab === 'all' ? ['room', 'fridge', 'frozen'] : [tab]
    return categories
      .map((category) => ({ category, items: filtered.filter((item) => item.category === category) }))
      .filter((group) => group.items.length > 0)
  }, [filtered, tab])

  return (
    <div className="px-4 pb-6 pt-6 md:px-8">
      <div className="mx-auto max-w-[720px]">
        <FridgeFrame>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">잇벤토리</p>
              <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">냉장고</h1>
            </div>
            <Search size={18} className="text-gray-400" aria-hidden="true" />
          </div>

          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="재료 이름으로 검색"
              className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-black/20 dark:text-gray-100"
            />
          </div>

          <div className="mt-3">
            <TemperatureTabs tabs={TABS} value={tab} onChange={setTab} />
          </div>

          {grouped.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="아직 등록된 재료가 없어요"
                description="+ 버튼을 눌러 재료를 추가해보세요."
                actionLabel="재료 추가하기"
                onAction={() => setModalState('new')}
              />
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {grouped.map((group) => (
                <ShelfSection
                  key={group.category}
                  category={group.category}
                  label={`${SECTION_LABEL[group.category]} · ${group.items.length}개`}
                >
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
                    {group.items.map((item) => (
                      <IngredientCard key={item.id} ingredient={item} onClick={() => setModalState(item)} />
                    ))}
                  </div>
                </ShelfSection>
              ))}
            </div>
          )}

          {ingredients.length > 0 && (
            <button
              onClick={() => navigate('/recipes')}
              className="relative mt-6 w-full rounded-2xl bg-white py-3 text-sm font-medium text-emerald-600 shadow-sm ring-1 ring-emerald-100 dark:bg-gray-800 dark:ring-emerald-900/40"
            >
              <Pin
                size={14}
                className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-12 text-emerald-600"
                aria-hidden="true"
              />
              이 재료로 레시피 추천받기
            </button>
          )}

          <button
            onClick={() => setModalState('new')}
            aria-label="재료 추가"
            className="absolute bottom-20 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white/40 transition hover:bg-emerald-700 active:scale-95 dark:ring-black/20 md:bottom-6 md:right-6"
          >
            <Plus size={22} />
          </button>
        </FridgeFrame>
      </div>

      {modalState && (
        <AddIngredientModal
          ingredient={modalState === 'new' ? null : modalState}
          onClose={() => setModalState(null)}
          onSave={(data) => {
            if (modalState === 'new') addIngredient(data)
            else updateIngredient(modalState.id, data)
            setModalState(null)
          }}
          onDelete={
            modalState !== 'new'
              ? () => {
                  removeIngredient(modalState.id)
                  setModalState(null)
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
